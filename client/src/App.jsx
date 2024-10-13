import { BrowserRouter, Routes, Route } from "react-router-dom";

import './CSS/App.css'
import './CSS/navbar.css'
import './CSS/Registration.css'

import Navbar from "./Components/Navbar"
import NewUserRegistration from "./Components/Users/NewUserRegistration";

function App() {

  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
        <Route path="/NewUserRegistration" element={<NewUserRegistration />} > </Route>
          </Routes>
        </BrowserRouter>
  )
}

export default App
