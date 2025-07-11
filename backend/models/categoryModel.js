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

const storeCategories = async (categoryName) => {
    try {
        const {data, error} = await supabase
            .from("categories")
            .insert([
                {
                    category_name: categoryName
                }
            ])
            .select();
        
        if(error) {
            console.error('Error storing category:', error);
            throw new Error(`Failed to store category: ${error.message}`);
        }
        return {data, error:null}
    } catch (error) {
        console.error('Unexpected error in getCategories:', error);
        return { 
            data: null, 
            error: error.message || 'An unexpected error occurred' 
        };
    }
}

const updateCategories = async (categoryId, categoryName) => {
    try {
        const {data, error} = await supabase
            .from("categories")
            .update({
                category_name: categoryName
            })
            .eq("category_id", categoryId)
            .select();
        
        if(error) {
            console.error('Error updating category:', error);
            throw new Error(`Failed to update category: ${error.message}`);
        }
        return {data, error:null}
    } catch (error) {
        console.error('Unexpected error in updateCategory:', error);
        return { 
            data: null, 
            error: error.message || 'An unexpected error occurred' 
        };
    }
}

const deleteCategories = async (categoryId) => {
    try {
        const {data, error} = await supabase
            .from("categories")
            .delete()
            .eq("category_id", categoryId)
            .select();
        
        if(error) {
            console.error('Error deleting category:', error);
            throw new Error(`Failed to delete category: ${error.message}`);
        }
        return {data, error:null}
    } catch (error) {
        console.error('Unexpected error in deleteCategory:', error);
        return { 
            data: null, 
            error: error.message || 'An unexpected error occurred' 
        };
    }
}

module.exports = {
    getCategories,
    storeCategories,
    updateCategories,
    deleteCategories
};
