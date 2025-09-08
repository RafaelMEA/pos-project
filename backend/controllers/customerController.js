const customerModel = require("../models/customerModel");

exports.showCustomers = async (req, res) => {
  try {
    const { data, error } = await customerModel.getCustomers();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ error: "Failed to fetch customers" });
  }
};

exports.storeCustomer = async (req, res) => {
    try {
        const {first_name, middle_name, last_name, email, phone} = req.body;
        const {data, error} = await customerModel.storeCustomers(first_name, middle_name, last_name, email, phone);
        if (error) {
            return res.status(500).json({error: error.message});
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error storing customer:", error);
        return res.status(500).json({error: "Failed to store customer"});
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);

        const updateData = {
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
        }

        const {data, error} = await customerModel.updateCustomer(customerId, updateData);

        if (error) {
            return res.status(500).json({error: error.message});
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error updating customer:", error);
        return res.status(500).json({error: "Failed to update customer"});
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);

        const {data, error} = await customerModel.deleteCustomer(customerId);

        if (error) {
            return res.status(500).json({error: error.message});
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).json({error: "Failed to delete customer"});
    }
};