import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetails from "../pages/ProductDetails";
import ShopDetails from "../pages/ShopDetails";
import CategoryDetails from "../pages/CategoryDetails";
import CreateShop from "../pages/createShop";
import Products from "../pages/Products";
import Checkout from "../pages/Checkout"
import Orders from "../pages/OrderPage";
import ShopDashboard from "../pages/shopDashboard";
import CreateProduct from "../pages/CreateProduct";
import MyShop from "../pages/MyShop";
import UpdateProduct from "../pages/updateproduct";
import ShopOrders from "../pages/shopOrders";
import EditShop from "../pages/EditShop";
import ProtectedRoute from "../components/Protected";
import AdminDashboard from "../pages/adminDashboard";
import AdminUsers from "../pages/adminUsers";
import AdminShops from "../pages/adminShops";
import AdminProducts from "../pages/adminProducts";
import AdminOrders from "../pages/adminOrder";
import Profile from "../pages/Profile";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/product/:id" element={<ProtectedRoute> <ProductDetails /> </ProtectedRoute>} />

      <Route path="/shop/:id" element={ <ProtectedRoute>  <ShopDetails /> </ProtectedRoute>} />

      <Route path="/category/:id" element={ <ProtectedRoute> <CategoryDetails /> </ProtectedRoute>} />

      <Route path="/create-shop" element={ <ProtectedRoute><CreateShop /> </ProtectedRoute>} />

       <Route path="/products" element={<ProtectedRoute> <Products /> </ProtectedRoute>}/>

       <Route path="/checkout" element={ <ProtectedRoute> <Checkout /> </ProtectedRoute>} />

       <Route path="/orders" element={ <ProtectedRoute><Orders /> </ProtectedRoute>} />

       <Route path="/shop-dashboard" element={<ProtectedRoute> <ShopDashboard /> </ProtectedRoute>} />

       <Route path="/create-product" element={<ProtectedRoute> <CreateProduct /> </ProtectedRoute>}/>

       <Route path="/my-shop" element={ <ProtectedRoute> <MyShop /> </ProtectedRoute>} />

       <Route path="/update-product/:id" element={ <ProtectedRoute> <UpdateProduct /> </ProtectedRoute>} />

       <Route path="/shop-orders" element={<ProtectedRoute> <ShopOrders /> </ProtectedRoute>} />

       <Route path="/edit-shop" element={<ProtectedRoute><EditShop /> </ProtectedRoute>} />

       <Route path="/admin/dashboard" element={<AdminDashboard />} />

       <Route path="/admin/users" element={<AdminUsers />} />

       <Route path="/admin/shops" element={<AdminShops />} />

       <Route path="/admin/products" element={<AdminProducts />}/>

       <Route path="/admin/orders" element={<AdminOrders />} />

       <Route path="/profile" element={<Profile />} />

    </Routes>
  );
};

export default AppRoutes;



