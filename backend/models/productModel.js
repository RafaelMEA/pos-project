const supabase = require("../lib/supabaseClient");


const getProducts = async () => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select();
        
        if (error) {
            console.error('Supabase query error:', error);
            throw new Error(`Failed to fetch products: ${error.message}`);
        }
        
        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error in getProducts:', error);
        return { 
            data: null, 
            error: error.message || 'An unexpected error occurred' 
        };
    }
};

module.exports = {
    getProducts
};