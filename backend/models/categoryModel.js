const supabase  = require("../lib/supabaseClient");

const getCategories = async () => {
  try {
      const { data, error } = await supabase
          .from("categories") 
          .select();
      
      if (error) {
          // Log the error for debugging
          console.error('Supabase query error:', error);
          throw new Error(`Failed to fetch categories: ${error.message}`);
      }
      
      return { data, error: null };
  } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error in getCategories:', error);
      return { 
          data: null, 
          error: error.message || 'An unexpected error occurred' 
      };
  }
};




module.exports = {
    getCategories,
};
