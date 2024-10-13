import { BrowserRouter, Routes, Route } from "react-router-dom";

import './CSS/App.css'
import './CSS/navbar.css'
import './CSS/Registration.css'
import './CSS/LoginForm.css'
import './CSS/Footer.css'

import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import NewUserRegistration from "./Components/Users/NewUserRegistration";
import Login from "./Components/Login";

function App() {

  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
        <Route path="/NewUserRegistration" element={<NewUserRegistration />} > </Route>
        <Route path="/Login" element={<Login />} > </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
  )
}

export default App
