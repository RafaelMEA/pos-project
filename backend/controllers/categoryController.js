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


