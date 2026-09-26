import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Returns from "./pages/Returns";

// Delivery Partner
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryOrderDetails from "./pages/delivery/DeliveryOrderDetails";
import DeliveryProfile from "./pages/delivery/DeliveryProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== CUSTOMER ==================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/account"
          element={<Account />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/returns"
          element={<Returns />}
        />

        {/* ==================== DELIVERY PARTNER ==================== */}

        <Route
          path="/delivery/dashboard"
          element={<DeliveryDashboard />}
        />

        <Route
          path="/delivery/order/:sellerOrderId"
          element={<DeliveryOrderDetails />}
        />

        <Route
          path="/delivery/profile"
          element={<DeliveryProfile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;