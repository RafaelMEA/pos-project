const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/customers`, {
                headers: {
                    "x-api-key": API_KEY,
                },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    console.log("Customers:", customers);
    
    return (
        <div>
            <h1>Customers</h1>
        </div>
    )
}

export default Customers