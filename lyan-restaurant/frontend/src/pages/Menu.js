import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import "../styles/global.css"; // Ensure styles are imported

const Menu = () => {
    const { restaurantId } = useParams(); // Get branchId from URL
    // const [menuItems, setMenuItems] = useState([]);
   // const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(true);
     //const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/menu/${restaurantId}`);
                if (!response.ok) {
                    throw new Error("Failed to load menu");
                }
                const data = await response.json();
                setMenu(data);
            } catch (error) {
                console.error(error);
                //setError("Failed to load menu.");
            }
        };
    
        fetchMenu();
    }, [restaurantId]);
    

    return (
        <div className="menu-container">
            <h1>Menu</h1>
            <ul className="menu-list">
                {menu.length > 0 ? (
                    menu.map((item) => (
                        <li key={item._id} className="menu-item">
                            <h3>{item.itemName}</h3>
                            <p>Price: ${item.price}</p>
                            <p>{item.description}</p>
                        </li>
                    ))
                ) : (
                    <p>No menu items available.</p>
                )}
            </ul>
        </div>
    );
};

export default Menu;
