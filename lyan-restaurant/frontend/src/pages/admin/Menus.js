import React, { useEffect, useState } from "react";
import axios from "axios";

const Menus =() => {
    const [menus, setMenus] = useState([]);

    useEffect(()=> {
        const fetchMenus = async ()=>{
         try {
            const response = await axios.get('http://localhost:5000/api/menus');
            setMenus(response.data);
         } catch (error) {
            console.error("failed to fetch menus", error);
         }
        };
        fetchMenus();
    }, []);

    return (
        <div>
        <h2>Menu Management</h2>
        {menus.length > 0 ? (
            <ul>
                {menus.map((menu) => (
                    <li key={menu._id}>{menu.name} - {menu.price} ETB</li>
                ))}
            </ul>
        ) : (
            <p>No menus found.</p>
        )}
    </div>
    );
};
export default Menus;