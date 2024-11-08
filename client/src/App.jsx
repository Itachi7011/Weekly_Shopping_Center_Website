import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useReducer } from "react";
import { reducer, initialState } from "./reducers/UseReducer";

import 'react-tabs/style/react-tabs.css';
import 'regenerator-runtime/runtime';

import "./CSS/App.css";
import "./CSS/navbar.css";
import "./CSS/Registration.css";
import "./CSS/LoginForm.css";
import "./CSS/Footer.css";
import "./CSS/adminSidebar.css";
import "./CSS/dashboard.css";
import "./CSS/ProductList.css";

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

// Categories

import NewCategory from "./Components/Admin/Categories/NewCategory";
import NewSubCategory from "./Components/Admin/Categories/NewSubCategory";
import ShowAllCategories from "./Components/Admin/Categories/ShowAllCategories";



// Categories

import NewBrand from "./Components/Admin/Brands/NewBrand";
import ShowAllBrands from "./Components/Admin/Brands/ShowAllBrands";

// Navbar Items
import NewNavbarItem from "./Components/Admin/NavbarItems/NewNavbarItem";
import ShowAllNavbarItems from "./Components/Admin/NavbarItems/ShowAllNavbarItems";

// Markets
import AddMarketData from "./Components/Admin/MarketsData/AddMarketData";
import ShowMarketData from "./Components/Admin/MarketsData/ShowMarketData";

// Products
import AddProductData from "./Components/Admin/ProductsData/AddProductData";
import ShowProductsData from "./Components/Admin/ProductsData/ShowProductsData";
import ProductsList from "./Components/Products/ProductsList";
import ProductProfile from "./Components/Products/ProductProfile";

// Bank Offers

import AddBankOffer from "./Components/Admin/BankOffer/AddBankOffer";
import UpdateBankOffer from "./Components/Admin/BankOffer/UpdateBankOffer";
import ViewAllBankOffers from "./Components/Admin/BankOffer/ViewAllBankOffers";

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
          <Route
            path="/PhoneAndEmailAddress"
            element={<PhoneAndEmailAddress />}
          ></Route>
          <Route path="/SocialMedia" element={<SocialMedia />}></Route>

          {/* Tags */}
          <Route path="/NewTag" element={<NewTag />}></Route>
          <Route path="/ShowAllTags" element={<ShowAllTags />}></Route>

          {/* Categories */}
          <Route path="/NewCategory" element={<NewCategory />}></Route>
          <Route path="/NewSubCategory" element={<NewSubCategory />}></Route>
          <Route path="/ShowAllCategories" element={<ShowAllCategories />}></Route>

           {/* Bank Offers */}
           <Route path="/AddBankOffer" element={<AddBankOffer />}></Route>
          <Route path="/UpdateBankOffer" element={<UpdateBankOffer />}></Route>
          <Route path="/ViewAllBankOffers" element={<ViewAllBankOffers />}></Route>


          {/* Brands */}
          <Route path="/NewBrand" element={<NewBrand />}></Route>
          <Route path="/ShowAllBrands" element={<ShowAllBrands />}></Route>

          {/* Navbar Items */}
          <Route path="/NewNavbarItem" element={<NewNavbarItem />}></Route>
          <Route
            path="/ShowAllNavbarItems"
            element={<ShowAllNavbarItems />}
          ></Route>

          {/* Markets */}
          <Route path="/AddMarketData" element={<AddMarketData />}></Route>
          <Route
            path="/ShowMarketData"
            element={<ShowMarketData />}
          ></Route>

          {/* Products */}
          <Route path="/AddProductData" element={<AddProductData />}></Route>
          <Route
            path="/ShowProductsData"
            element={<ShowProductsData />}
          ></Route>
          <Route
            path="/ProductsList"
            element={<ProductsList />}
          ></Route>
          <Route
            path="/ProductProfile"
            element={<ProductProfile />}
          ></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
