const supabase = require("../lib/supabaseClient");

const getCustomers = async () => {
  try {
    const { data, error } = await supabase.from("customers").select();

    if (error) {
      // Log the error for debugging
      console.error("Supabase query error:", error);
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error in getCustomers:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

const storeCustomers = async (
  first_name,
  middle_name,
  last_name,
  email,
  phone
) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          first_name,
          middle_name,
          last_name,
          email,
          phone,
          is_deleted: false,
        },
      ])
      .select();
    if (error) {
      console.error("Error storing customer:", error);
      throw new Error(`Failed to store customer: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in storeCustomers:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

const updateCustomer = async (
  customerId,
  first_name,
  middle_name,
  last_name,
  email,
  phone
) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .update({
        first_name,
        middle_name,
        last_name,
        email,
        phone,
      })
      .eq("customer_id", customerId)
      .select();
    if (error) {
      console.error("Error updating customer:", error);
      throw new Error(`Failed to update customer: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in updateCustomers:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

const deleteCustomer = async (customerId) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .update({ is_deleted: true })
      .eq("customer_id", customerId)
      .eq("is_deleted", false)
      .select();

    if (error) {
      console.error("Error deleting customer:", error);
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in deleteCustomer:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

module.exports = {
  getCustomers,
  storeCustomers,
  updateCustomer,
  deleteCustomer,
};
