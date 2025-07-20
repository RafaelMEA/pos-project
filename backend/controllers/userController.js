const userModel = require('../models/userModel');

exports.storeUser = async (req, res) => {
    try {
        const { email, password, first_name, middle_name, last_name, phone_number } = req.body;
        const { data, error } = await userModel.storeUser(email, password, first_name, middle_name, last_name, phone_number);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error storing user:", error);
        return res.status(500).json({ error: "Failed to store user" });
    }
}

