import { useState, useEffect } from "react";
import axios from "axios";

const RequestNewSavingAccount = () => {
  let name, value;
  const [user, setUser] = useState("");

  const [userImage, setImage1] = useState("");
  const [voterIdImage, setImage2] = useState("");
  const [aadharImage, setImage3] = useState("");
  const [panImage, setImage4] = useState("");

  const [branches, setBranches] = useState([]);

  const [data, setData] = useState({
    userType: "",
    accountStatus: "",
    email: "",
    name: "",
    fatherName: "",
    dateOfBirth: "",
    phoneNo_1: "",
    qualification: "",
    country: "",
    state: "",
    district: "",
    fullAddress: "",
    dateOfFormSubmission: "",
    password: "",
    cpassword: "",
  });
  const UserDetails = async () => {
    try {
      const res = await fetch("/api/empProfile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      setUser(data);

      if (!res === 200) {
        throw new Error(`Error during retreive data - ${Error}`);
      }

      if (!res === 200) {
        throw new Error(`Error during retreive data - ${Error}`);
      }
    } catch (err) {
      console.log(`Error during catch of User's Data -  ${err}`);
    }
  };
  useEffect(() => {
    UserDetails();
  }, []);

  const branchesList = async () => {
    try {
      const res = await fetch("/api/bankbranchList", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      setBranches(data);

      if (!res === 200) {
        throw new Error(`Error during retreive data - ${Error}`);
      }

      if (!res === 200) {
        throw new Error(`Error during retreive data - ${Error}`);
      }
    } catch (err) {
      console.log(`Error during catch of User's Data -  ${err}`);
    }
  };
  useEffect(() => {
    branchesList();
  }, []);

  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var bodyFormData = new FormData();
    bodyFormData.append("userType", data.userType);

    bodyFormData.append("accountStatus", data.accountStatus);
    bodyFormData.append("email", data.email);
    bodyFormData.append("name", data.name);
    bodyFormData.append("fatherName", data.fatherName);

    bodyFormData.append("dateOfBirth", data.dateOfBirth);
    bodyFormData.append("phoneNo_1", data.phoneNo_1);
    bodyFormData.append("country", data.country);
    bodyFormData.append("state", data.state);
    bodyFormData.append("district", data.district);
    bodyFormData.append("fullAddress", data.fullAddress);
    bodyFormData.append("dateOfFormSubmission", data.dateOfFormSubmission);

    bodyFormData.append("password", data.password);
    bodyFormData.append("cpassword", data.cpassword);

    bodyFormData.append("userImage", userImage);


    try {
      console.log(bodyFormData);
      await axios.post(
        "/api/reqNewSavAcc",

        bodyFormData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("New Saving Account Saved Successfully");

      window.location.reload();
    } catch (error) {
      //handle error

      console.log(error);
    }
  };

  return (
    <>
      <div className="main-body1">
        <div className="nav-btn mt-4">
          <h2
            style={{
              color: "white",
              background: "#367588",
              padding: "1rem",
              borderRadius: "10px",
              margin: "1rem 3.5rem",
              textAlign: "center",
            }}
          >
            {" "}
            New Account Form :{" "}
          </h2>
        </div>
        <div className="registrationForm">
          <form method="POST">
            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">User Type : </label>
              <select
                onChange={handleInput}
                name="userType"
                className="form formInputRegistraion text_input_forms"
              >
                <option>Customer</option>
                <option>Seller</option>
              </select>
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Name : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="text"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="name"
                placeholder=""
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Email : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="text"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="email"
                placeholder="Official Email Id only"
              />
            </div>

            {/* Hidden Scale Input Value : */}
            <input
              type="hidden"
              name="accountType"
              value="saving"
              placeholder=""
            />

            {/* Hidden Account Number Input Value : */}
            <input
              type="hidden"
              name="accountNumber"
              value={Number(50)}
              placeholder=""
            />

            {/* Hidden Account Amount Value : */}
            <input type="hidden" name="totalAmount" value="0" placeholder="" />

            {/* Hidden Date Of Form Submission : */}
            <input
              type="hidden"
              name="dateOfFormSubmission"
              value={new Date()}
            ></input>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Father&apos;s Name </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="text"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="fatherName"
                placeholder=""
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Date Of Birth : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="date"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="dateOfBirth"
                placeholder=""
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label"> Phone Number : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="number"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="phoneNo_1"
                placeholder=""
              />
            </div>

          

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Country : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="text"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="country"
                placeholder="whichever country's citizenship do you have"
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">State : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="text"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="state"
                placeholder=""
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">District : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="text"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="district"
                placeholder=""
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Full Address : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="text"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="fullAddress"
                placeholder=""
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">
                {" "}
                Upload Your Photo :{" "}
              </label>
              <input
                autoComplete="off"
                onChange={(e) => {
                  setImage1(e.target.files[0]);
                }}
                type="file"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="userImage"
                placeholder=""
              />
            </div>
            {userImage && (
              <img
                src={URL.createObjectURL(userImage)}
                alt="Preview"
                style={{ width: "200px", height: "150px", marginLeft: "5rem" }}
              />
            )}


            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Password : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="password"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="password"
                placeholder="create a strong , unpredectible password"
              />
            </div>

            <div className="mb-3 formDivRegistraion text_input_container">
              {" "}
              <label className="form-label">Confirm Password : </label>
              <input
                autoComplete="off"
                onChange={handleInput}
                type="password"
                className="form formInputRegistraion text_input_forms"
                id="exampleFormControlInput1"
                name="cpassword"
                placeholder=""
              />
            </div>

            <button
              className="btn btn-primary btn-lg m-3"
              style={{ float: "right", fontSize: "large" }}
              onClick={handleSubmit}
            >
              Add Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RequestNewSavingAccount;
