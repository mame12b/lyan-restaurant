import AdminDashboard from "../pages/admin/AdminDashboard";
import Restaurants from "../pages/admin/Restaurants";
import Branch from "../pages/admin/Branch";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";

const adminRoutes = [
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/restaurants", element: <Restaurants /> },
  { path: "/admin/branches", element: <Branch /> },
  { path: "/admin/orders", element: <Orders /> },
  { path: "/admin/users", element: <Users /> },
];

export default adminRoutes;
