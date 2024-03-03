import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
// import { Home } from "./pages/Home";
// import { Transaction } from "./pages/Transaction";
import Login from "./pages/Login/Login";
// import Auth from "./components/Auth/Auth";
import Cashier from "./pages/Cashier/Cashier";
// import { Home } from "./pages/Home/index";
// import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
// import SetNewPassword from "./pages/ForgotPassword/SetNewPassword";
// import AdminRoute from "./components/Auth/AdminRoute";
// import {
// 	LoggedInRoute,
// 	LogInRoute,
// } from "./components/Auth/LoggedInUserRoute";
// // import "./App.css";
// import { ProductLists } from "./pages/ProductLists/ProductLists";
// import { ProductDetail } from "./pages/ProductDetail/ProductDetail";
// import { SidebarWithHeader } from "./components/SideBar/SideBar";
// import { Report } from "./pages/Report/Report";
// import { AddProduct } from "./pages/AddProduct/AddProduct";
// import { EditProduct } from "./pages/EditProduct/EditProduct";
// import { CategoryLists } from "./pages/CategoryLists/CategoryLists";
// import { DashboardAdmin } from "./pages/DashboardAdmin/DashboardAdmin";
// import { TransactionDetail } from "./pages/TransactionDetail/TransactionDetail";

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cashier-data" element={<Cashier />} />
      </Routes>
    </Box>
  );
}

export default App;
