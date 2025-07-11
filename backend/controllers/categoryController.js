const categoryModel = require('../models/categoryModel');

exports.showCategories = async (req, res) => {
    try {
        const { data, error } = await categoryModel.getCategories();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories" });
    }
}

exports.storeCategories = async (req, res) => {
    try {
        const {category_name}  = req.body
        const { data, error } = await categoryModel.storeCategories( category_name);

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories" });
    }
}

exports.updateCategories = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { category_name } = req.body;
        
        if (!category_name) {
            return res.status(400).json({ error: "Category name is required" });
          }
        
        const { data, error } = await categoryModel.updateCategories(categoryId, category_name);

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories" });
    }
}

exports.deleteCategories = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { data, error } = await categoryModel.deleteCategories(categoryId);

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories" });
    }
}




