const supabase = require("../lib/supabaseClient");
const bcrypt = require("bcryptjs");

const storeUser = async (
  email,
  password,
  first_name,
  middle_name,
  last_name,
  phone_number,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          first_name,
          middle_name,
          last_name,
          phone_number,
          role_id: 1,
          is_deleted: false,
        },
      ])
      .select();

    if (error) {
      console.error("Error storing user:", error);
      throw new Error(`Failed to store user: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in storeUser:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

module.exports = {
  storeUser,
};
