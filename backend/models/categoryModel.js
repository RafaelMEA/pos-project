const supabase  = require("../lib/supabaseClient");

const getCategories = async () => {
    const { data, error } = await supabase
      .from("categories") 
      .select();
  
    return { data, error };
  };

module.exports = {
    getCategories,
};
