const express = require("express");
const app = express();
const server = require("http").createServer(app);

const cloudinary = require("cloudinary").v2;
const os = require("os");
const moment = require("moment");
const si = require("systeminformation");
const exec = require("child_process").exec;

const mongoose = require("mongoose");
const alert = require("electron-alert");
const multer = require("multer");
const bcryptjs = require("bcryptjs");
const cookieParser = require("cookie-parser");

const schedule = require("node-schedule");

app.use(cookieParser());

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
app.use(cors());

require("./database/connection");

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const UsersDB = require("./database/schema/users/users");


const CloudinaryDB = process.env.CLOUD_NAME;
const CloudinaryAPIKey = process.env.API_KEY;
const CloudinarySecret = process.env.API_SECRET;

cloudinary.config({
  cloud_name: CloudinaryDB,
  api_key: CloudinaryAPIKey,
  api_secret: CloudinarySecret,
  secure: true,
});

const cloudinaryStorage = multer.memoryStorage(); //Comment it when deploy

const uploadToCloudinaryUsers = async (file) => {
  try {
    console.log("upload starts");
    const result = await cloudinary.uploader.upload(file, {
      folder: "W_Mark_Users",
      resource_type: "auto",
    });
    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const upload1 = multer({ storage: cloudinaryStorage });

const NewUserRegistrationMulter = multer({
  storage: cloudinaryStorage,

  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      // Allow only image files

      return cb(new Error("Please upload an image (JPG, JPEG or PNG)."));
    }

    cb(null, true);
  },
}).fields([
  { name: "userImage", minCount: 0, maxCount: 1 },
]);

app.post("/api/newUserRegistration", NewUserRegistrationMulter, async (req, res) => {
  console.log(req.files);
  try {

    console.log(req.body)
    console.log(req.files)
    const Password = req.body.password;
    const Cpassword = req.body.cpassword;
    const Email = req.body.email;
    const PhoneNo = req.body.phoneNo;
    const FirstName = req.body.firstName;
    const LastName = req.body.lastName;
    const FullName = FirstName + " " + LastName;

    // Already Used Emails

    const UsedEmail = await UsersDB.findOne({ email: Email });
 

    // Already Used Phone Numbers

    const UsedPhoneNo = await UsersDB.findOne({
      phoneNo: PhoneNo,
    });
    

    // Now acutal coding for registration
    if (Password === Cpassword) {
      if (UsedEmail) {
        alert("Sorry , This Email Id is already registered!");
        console.log("Sorry , This Email Id is already registered!");
      } else {
        if (
          UsedPhoneNo
        ) {
          alert(
            "Sorry Phone Number is already registered! /n Please use another Phone Number."
          );
        
        }  else {
            function getAge(dateString) {
              var today = new Date();
              var birthDate = new Date(dateString);
              var age = today.getFullYear() - birthDate.getFullYear();
              var m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              return age;
            }
            const DateOfBirth = req.body.dateOfBirth;

            // Date conversion to IST

            const SubmittedDate = new Date();
            // const DateOfJoining = req.body.dateOfJoining;

            let options = {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            };
            let intlDateObj = new Intl.DateTimeFormat("en-US", options, {
              timeZone: "Asia/Kolkata",
            });

            //Form submission Date

            let ConvertedFormSubmittedDate = intlDateObj.format(SubmittedDate);


            // userImage

            const userImage = req.files.userImage[0];

            const bufferuserImage = userImage.buffer;

            const b64userImageFile =
              Buffer.from(bufferuserImage).toString("base64");

            const dataURIuserImageFile =
              "data:" + userImage.mimetype + ";base64," + b64userImageFile;

            const cldResUserImageFile = await uploadToCloudinaryUsers(
              dataURIuserImageFile
            );

        

            const employeedata = await new UsersDB({
              userType: req.body.userType,
              name: FullName,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              phoneNo: req.body.phoneNo,
              gender: req.body.gender,
              dateOfBirth: req.body.dateOfBirth,
              age: getAge(DateOfBirth),
              country: "India",
              state: req.body.state,
              district: req.body.district,
              location: req.body.location,
              convertedDateOfFormSubmission: ConvertedFormSubmittedDate,
              dateOfFormSubmission: new Date(),
              userImage: {
                data: cldResUserImageFile.secure_url,
                originalFileName: userImage.originalname,
                publicId: cldResUserImageFile.public_id,
                contentType: `image/${cldResUserImageFile.format}`,
              },


              password: req.body.password,
            });

            await employeedata.save();
            console.log("Saved in Database Successfully");
           new alert(
              `${FullName} Registered Successfully! \n Please Login to Continue`
            );
            // res.redirect("/EmployeeLogin");
          } 
        }
      
    } else {
      alert("Sorry! Password And Confirm Passwords do not match.");
    }
  } catch (err) {
    console.log(` Error During Registering Scale 1 Employees --> ${err} `);
  }
});



app.post("/api/login", async (req, res) => {
  let token;
  const Email = req.body.email;
  const Password = req.body.password;

  // FindOne Funtion For all of the scales database

  const data1 = await UsersDB.findOne({
    email: Email,
  });
 
  if (data1) {
    const isMatch = await bcryptjs.compare(Password, data1.password);

    if (isMatch === true) {
      const token = await data1.generateAuthToken();
      await UsersDB.updateOne(
        { _id: data1._id },
        { status: "online" }
      );

      res.cookie("cookies1", token, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
      });
      console.log("Login Successful")
      // res.redirect("/CustomerSavingAccountsProfile");
    } else if (isMatch === false) {
      res.send("Sorry Password And Email Are Not Matched As Per Our System.");
    } else {
      res.send("Sorry!");
    }
  }
});


















app.listen(PORT, () => {
    console.log("Server is running on : ", PORT);
  });