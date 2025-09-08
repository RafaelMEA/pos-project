const userModel = require("../models/userModel");

exports.showUsers = async (req, res) => {
  try {
    const { data, error } = await userModel.getUsers();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.storeUser = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      middle_name,
      last_name,
      phone_number,
    } = req.body;
    const { data, error } = await userModel.storeUser(
      email,
      password,
      first_name,
      middle_name,
      last_name,
      phone_number
    );
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error storing user:", error);
    return res.status(500).json({ error: "Failed to store user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const updateData = {
      firstName: req.body.first_name,
      middleName: req.body.middle_name,
      lastName: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      role_id: req.body.role_id,
    };

    const { data, error } = await userModel.updateUser(userId, updateData);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { data, error } = await userModel.deleteUser(userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};
