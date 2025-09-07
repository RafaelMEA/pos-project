const productModel = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    const { data, error } = await productModel.getProducts();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.storeProduct = async (req, res) => {
    try {
        const { data, error } = await productModel.storeProduct(req.body);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await productModel.updateProduct(id, req.body);
    if (error) {
      return res.status(500).json({ error: error.message || String(error) });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || String(error) });
  }
};

