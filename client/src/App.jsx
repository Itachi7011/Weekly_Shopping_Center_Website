import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useReducer } from "react";
import { reducer, initialState } from "./reducers/UseReducer";

import "./CSS/App.css";
import "./CSS/navbar.css";
import "./CSS/Registration.css";
import "./CSS/LoginForm.css";
import "./CSS/Footer.css";
import "./CSS/adminSidebar.css";
import "./CSS/dashboard.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NewUserRegistration from "./Components/Users/NewUserRegistration";
import Login from "./Components/Login";

// Admin
import AdminSidebar from "./Components/Admin/AdminSidebar";
import Dashboard from "./Components/Admin/Dashboard";
import AdminCustomersList from "./Components/Admin/AccountsList/AdminCustomersList";
import AdminSellerList from "./Components/Admin/AccountsList/AdminSellerList";

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <AdminSidebar />
        <Routes>
          <Route path="/NewUserRegistration" element={<NewUserRegistration />}>
            {" "}
          </Route>
          <Route path="/Login" element={<Login />}>
            {" "}
          </Route>

          {/* Admin */}
          <Route path="/Dashboard" element={<Dashboard />}>
            {" "}
          </Route>
          <Route path="/AdminCustomersList" element={<AdminCustomersList />}>
            {" "}
          </Route>
          <Route path="/AdminSellerList" element={<AdminSellerList />}>
            {" "}
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
