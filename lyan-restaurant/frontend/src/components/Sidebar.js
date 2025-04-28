import { useState } from "react";
import { Drawer, List, ListItem,ListItemIcon,  ListItemText } from "@mui/material";
import  DashboardIcon  from "@mui/icons-material/Dashboard";
import  RestaurantMenuIcon   from "@mui/icons-material/RestaurantMenu";
import  StoreIcon   from "@mui/icons-material/Store";
import  MenuBookIcon  from "@mui/icons-material/MenuBook";
import  PeopleIcon  from "@mui/icons-material/People";
import   SettingsIcon  from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const Sidebar = () =>{
    const navigate = useNavigate();
    const [selected, setSelected] = useState("");

    const menuItems = [
{ text : "Dashboard", icon : <DashboardIcon />, path : "/admin/dashboard" },
{ text : "Restaurants", icon : <RestaurantMenuIcon />, path : "/admin/restaurants" },
{ text : "Branches", icon : <StoreIcon />, path : "/admin/branches" },
{ text : "Menus", icon : <MenuBookIcon />, path : "/admin/menus" },
{ text : "Orders", icon : <PeopleIcon />, path : "/admin/orders" },
{ text : "Users", icon : <PeopleIcon />, path : "/admin/users"},
{ text : "Settings", icon : <SettingsIcon />, path : "/admin/settings"},
 ];

 return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
    <List>
      {menuItems.map((item, index) => (
        <ListItem
          button
          key={index}
          selected={selected === item.text}
          onClick={() => {
            setSelected(item.text);
            navigate(item.path);
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </Drawer>

 );
};
export default Sidebar;