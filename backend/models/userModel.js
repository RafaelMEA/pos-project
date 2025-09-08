const supabase = require("../lib/supabaseClient");
const bcrypt = require("bcryptjs");

const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
                user_id,
                first_name,
                middle_name,
                last_name,
                email,
                phone_number,
                role_id,
                roles (
                    role_name
                )
            `
      )
      .eq("is_deleted", false)
      .order("user_id", { ascending: true });

    if (error) {
      console.error("Supabase query error:", error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in getUsers:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

const storeUser = async (
  email,
  password,
  first_name,
  middle_name,
  last_name,
  phone_number
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
          role_id: 2,
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

const updateUser = async (
  userId,
  { first_name, middle_name, last_name, email, phone_number, role_id }
) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name,
        middle_name,
        last_name,
        email,
        phone_number,
        role_id,
      })
      .eq("user_id", userId)
      .eq("is_deleted", false).select(`
                user_id,
                first_name,
                middle_name,
                last_name,
                email,
                phone_number,
                role_id,
                roles (
                    role_name
                )
            `);

    if (error) {
      console.error("Error updating user:", error);
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in updateUser:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

const deleteUser = async (userId) => {
  try {
    // Implement soft delete by setting is_deleted to true
    const { data, error } = await supabase
      .from("users")
      .update({ is_deleted: true })
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .select();

    if (error) {
      console.error("Error deleting user:", error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in deleteUser:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  storeUser,
};
