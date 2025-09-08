const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/users`, {
                headers: {
                    "x-api-key": API_KEY,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log("Users:", users);

    return (
        <div>
            <h1>Users</h1>
        </div>
    )
}

export default Users