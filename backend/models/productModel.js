const supabase = require("../lib/supabaseClient");
const { nanoid } = require("nanoid");

const getProducts = async () => {
  try {
    const { data, error } = await supabase.from("products").select();

    if (error) {
      console.error("Supabase query error:", error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in getProducts:", error);
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
};

const storeProduct = async (product) => {
  const {
    product_name,
    product_details,
    price,
    quantity,
    supplier,
    image,
    category_id,
  } = product;

  if (!product_name || price == null || quantity == null) {
    throw new Error("Missing required fields");
  }

  const generateInternalBarCode = () => "IN" + nanoid(10);
  const finalBarcode = generateInternalBarCode();

  const { data: existingProduct } = await supabase
    .from("products")
    .select()
    .eq("barcode", finalBarcode)
    .single();

  if (existingProduct) {
    throw new Error("Product with this barcode already exists");
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        product_name,
        product_details,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        barcode: finalBarcode,
        supplier,
        image,
        category_id,
        is_deleted: false,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  getProducts,
  storeProduct,
};
