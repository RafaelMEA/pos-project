const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/token");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("is_deleted", false)
    .single();

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  try {
    const jti = crypto.randomUUID();
    const refreshToken = generateRefreshToken(user, jti);
    const accessToken = generateAccessToken(user);

    const userId = user.user_id || user.id;

    if (!userId) {
      console.error("No user ID found in user object:", user);
      return res.status(500).json({ message: "User ID not found" });
    }

    const { error } = await supabase.from("tokens").insert([
      {
        user_id: userId,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ]);

    if (error) {
      console.error("Error inserting token:", error);
      throw error;
    }

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        accessToken,
        user: {
          id: userId,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role_id: user.role_id,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during login" });
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await supabase.from("tokens").delete().eq("token", token);
    res.clearCookie("refreshToken");
  }
  res.sendStatus(204);
};

exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: stored } = await supabase
      .from("tokens")
      .select("id")
      .eq("token", token)
      .eq("user_id", decoded.id)
      .single();

    if (!stored) return res.status(403).json({ message: "Invalid token" });

    const accessToken = generateAccessToken({ id: decoded.id });
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};
