import { useState } from "react";
// import { useEffect } from "react";
import { useContext } from "react";
// import { UserContext } from "../../App";
// import axios from "axios";

const Login = () => {
  //   const { state, dispatch } = useContext(UserContext);

  //   const [Data, setData] = useState({ post: [] });

  //   useEffect(() => {
  //     axios
  //       .get("/api/empSearchResults")
  //       .then((response) => {
  //         const data = response.data;

  //         setData({ post: data });

  //         if (data.status === 4000) {
  //           console.log("Sorry wrong credentials!");
  //         } else {
  //           console.log("Login Successful.");

  //           //dispatch function here
  //           dispatch({ type: "USER", payload: false });
  //         }

  //         console.log("data fetch successfully");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }, []);

  let name, value;
  const [user, setUser] = useState({ email: "", password: "" });

  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  return (
    <>
      <div className="main-body-login">
        {/* Form Starts Here */}
        <form className="loginForm" action="/api/login" method="POST">
          <section>
            {" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>{" "}
            <span></span> <span></span> <span></span> <span></span>
            <div className="signin">
              <div className="content">
                <h2>Login</h2>

                <div className="form">


                  <div className="inputBox">
                    <input
                      type="email"
                      name="email"
                      onChange={handleInput}
                      required
                    />{" "}
                    <i>Email</i>
                  </div>

                  <div className="inputBox">
                    <input
                      type="password"
                      name="password"
                      onChange={handleInput}
                      required
                    />{" "}
                    <i>Password</i>
                  </div>

                  <div className="links">
                    {" "}
                    <a href="#">Forgot Password</a> <a href="#">Signup</a>
                  </div>

                  <div className="inputBox ">
                    <input type="reset" value="Reset" className="resetbtn" />
                  </div>
                  <div className="inputBox">
                    <input type="submit" value="Login" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default Login;
