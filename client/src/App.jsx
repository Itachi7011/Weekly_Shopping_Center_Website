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
import AdminsList from "./Components/Admin/AccountsList/AdminsList";

// Phone No. And Email And Settings

import PhoneAndEmailAddress from "./Components/Admin/ContactInfoAndSocialMedia/PhoneAndEmailAddress";
import SocialMedia from "./Components/Admin/ContactInfoAndSocialMedia/SocialMedia";

// Tags
import NewTag from "./Components/Admin/Tags/NewTag";
import ShowAllTags from "./Components/Admin/Tags/ShowAllTags";

// Navbar Items
import NewNavbarItem from "./Components/Admin/NavbarItems/NewNavbarItem";
import ShowAllNavbarItems from "./Components/Admin/NavbarItems/ShowAllNavbarItems";

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <AdminSidebar />
        <Routes>
          <Route
            path="/NewUserRegistration"
            element={<NewUserRegistration />}
          ></Route>
          <Route path="/Login" element={<Login />}></Route>

          {/* Admin */}
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route
            path="/AdminCustomersList"
            element={<AdminCustomersList />}
          ></Route>
          <Route path="/AdminSellerList" element={<AdminSellerList />}></Route>
          <Route path="/AdminsList" element={<AdminsList />}></Route>

          {/* Phone No. And Email And Settings */}
          <Route path="/PhoneAndEmailAddress" element={<PhoneAndEmailAddress />}></Route>
          <Route path="/SocialMedia" element={<SocialMedia />}></Route>

          {/* Tags */}
          <Route path="/NewTag" element={<NewTag />}></Route>
          <Route path="/ShowAllTags" element={<ShowAllTags />}></Route>

          {/* Navbar Items */}
          <Route path="/NewNavbarItem" element={<NewNavbarItem />}></Route>
          <Route path="/ShowAllNavbarItems" element={<ShowAllNavbarItems />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
