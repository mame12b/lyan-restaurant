import React, { useEffect, useState } from "react";
import axios from "axios";

const Menu =() => {
    const [menus, setMenu] = useState([]);

    useEffect(()=> {
        const fetchMenu = async ()=>{
         try {
            const response = await axios.get('http://localhost:5000/api/menu');
            setMenu(response.data);
         } catch (error) {
            console.error("failed to fetch menu", error);
         }
        };
        fetchMenu();
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
export default Menu;