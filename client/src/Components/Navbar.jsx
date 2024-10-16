// import { UserContext } from "../App";
// import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Navbar = () => {
  // const { state, dispatch } = useContext(UserContext);

  const [user, setUser] = useState("");
  const [Data, setData] = useState({ post: [] });

  useEffect(() => {
    axios
      .get("/api/userProfile")
      .then(async (response) => {
        const data = await response.data;

        setUser(data);

        console.log("data fetched successfully");
      })
      .catch((err) => {
        console.log(`Error during catch of setProfile -  ${err}`);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/navbarItemsList")
      .then((response) => {
        const data = response.data;

        setData({ post: data });
      })
      .catch((err) => {
        console.log("Error during Data:", err);
      });
  }, []);

  return (
    <div>
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          <i className="fas fa-bullhorn flip-horizontal ps-2"></i> Weekly Market{" "}
          <i className="fas fa-bullhorn ps-2"></i>
        </a>
        <ul className="navbar-links">
          <li className="navbar-dropdown">
            <a href="/">
              <i className="fas fa-home me-1"></i>Home
            </a>
          </li>

          {Data.post.map(
            ({ itemName, itemLink, itemIcon, subItems }) => {
              return (
                <>
                  <li className="navbar-dropdown">
                    <a href="#">
                      <i className={itemIcon}></i>
                      {itemName}
                    </a>
                    <div className="dropdown">
                      {subItems.map((item) => {
                        return (
                          <>
                            <a href={item.link}>{item.name}</a>
                          </>
                        );
                      })}
                    </div>
                  </li>
                </>
              );
            }
          )}

          {!user ? (
            <li className="navbar-dropdown">
              <a href="#">
                <i className="fas fa-user me-1"></i>User
              </a>
              <div className="dropdown">
                <a href="/Login">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </a>
                <a href="/NewUserRegistration">
                  <i className="fas fa-user-plus me-2"></i>Signup
                </a>
              </div>
            </li>
          ) : (
            <>
              <li className="navbar-dropdown">
                <a href="#">
                  <i className="fas fa-heart me-1" style={{ color: "red" }}></i>
                  Liked
                </a>
              </li>
              <li className="navbar-dropdown">
                <a href="/api/logout">
                  <i className="fas fa-sign-out-alt me-1"></i>Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
