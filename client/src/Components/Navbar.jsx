const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <a href="#" className="navbar-logo">
        <i className="fas fa-bullhorn flip-horizontal ps-2"></i>   Weekly Market  <i className="fas fa-bullhorn ps-2"></i>
        </a>
        <ul className="navbar-links">
          <li className="navbar-dropdown">
            <a href="#"><i className="fas fa-home me-1"></i>Home</a>
         
          </li>
          <li className="navbar-dropdown">
            
            <a href="#"><i className="fas fa-building me-1"></i>Markets</a>
            <div className="dropdown">
              <a href="#">Ladoo</a>
              <a href="#">Besan Ladoo</a>
              <a href="#">Ghee Besan Ladoo</a>
              <a href="#">Nariyal Ladoo</a>
              <a href="#">Kaju Katli</a>
              <a href="#">Rasgulla</a>
            </div>
          </li>
          <li className="navbar-dropdown">
            <a href="#"><i className="fas fa-shopping-bag me-1"></i>Products</a>
            <div className="dropdown">
              <a href="#">Lachha Paratha</a>
              <a href="#">Rumali Roti</a>
              <a href="#">Tandoori Roti</a>
              <a href="#">Butter Roti</a>
              <a href="#">Plain Naan</a>
              <a href="#">Butter Naan</a>
            </div>
          </li>
          <li className="navbar-dropdown">
            <a href="#"><i className="fas fa-map-marker-alt me-1"></i>Locations</a>
            <div className="dropdown">
              <a href="#">Plain Rice</a>
              <a href="#">Veg Pulao</a>
              <a href="#">Veg Biryani</a>
              <a href="#">Paneer Biryani</a>
              <a href="#">Lemon Rice</a>
              <a href="#">Veg Kashmiri Pulao</a>
            </div>
          </li>
          <li className="navbar-dropdown">
            <a href="#"><i className="fas fa-comments me-1"></i>Community</a>
            <div className="dropdown">
              <a href="#">Paneer Chill Dry</a>
              <a href="#">Paneer Garlic</a>
              <a href="#">Veg Garlic</a>
              <a href="#">Veg Chilli</a>
            </div>
          </li>
          <li className="navbar-dropdown">
            <a href="#"><i className="fas fa-user me-1"></i>User</a>
            <div className="dropdown">
              <a href="/Login"><i className="fas fa-sign-in-alt me-2"></i>Login</a>
              <a href="/NewUserRegistration"><i className="fas fa-user-plus me-2"></i>Signup</a>
            
            </div>
          </li>
          <li className="navbar-dropdown">
            <a href="#"><i className="fas fa-heart me-1" style={{color:"red"}}></i>Liked</a>
            
          </li>
          <li className="navbar-dropdown">
            <a href="#"><i className="fas fa-sign-out-alt me-1"></i>Logout</a>
            
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
