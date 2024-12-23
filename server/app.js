const express = require("express");
const app = express();
const server = require("http").createServer(app);

const cloudinary = require("cloudinary").v2;
const os = require("os");
const moment = require("moment");
const si = require("systeminformation");
const exec = require("child_process").exec;
const shortid = require("shortid");

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
const authenticate = require("./authenticate/customerAuthenticate");

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const UsersDB = require("./database/schema/users/users");

const EnquiryDB = require("./database/schema/enquiry");
const SocialMediaDB = require("./database/schema/socialMedia");
const PhoneAndEmailDB = require("./database/schema/phoneAndEmail");
const TagsDB = require("./database/schema/tags");
const CategoriesDB = require("./database/schema/categories");
const BrandsDB = require("./database/schema/products/brands");
const BankOfferDB = require("./database/schema/BankOffers/bankOffers");
const NavbarItemsDB = require("./database/schema/navbarItems");
const MarketsDB = require("./database/schema/markets/markets");
const ProductsDB = require("./database/schema/products/products");
const AdvertisementsDB = require("./database/schema/advertisements/advertisement");
const HomePageTopCarouselDB = require("./database/schema/homePage/topCarousel");
const AdminNavbarSettingContentDB = require("./database/schema/adminNavbarSettingContent");

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
}).fields([{ name: "userImage", minCount: 0, maxCount: 1 }]);

app.post(
  "/api/newUserRegistration",
  NewUserRegistrationMulter,
  async (req, res) => {
    console.log(req.files);
    try {

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
          if (UsedPhoneNo) {
            alert(
              "Sorry Phone Number is already registered! /n Please use another Phone Number."
            );
          } else {
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
  }
);

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
      await UsersDB.updateOne({ _id: data1._id }, { status: "online" });

      res.cookie("cookies1", token, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
      });
      console.log("Login Successful");

      res.redirect("/AdminCustomersList");
    } else if (isMatch === false) {
      res.send("Sorry Password And Email Are Not Matched As Per Our System.");
    } else {
      res.send("Sorry!");
    }
  }
});




// Logout Function

app.get("/api/logout", authenticate, async (req, res) => {
  try {
    const modelName = req.rootUser.constructor.modelName;

    let model;

    switch (modelName) {
      case "W_Mark_Users":
        model = UsersDB;

        break;

      default:
        throw new Error(`Unknown model name: ${modelName}`);
    }

    await model.updateOne({ _id: req.id }, { $set: { status: "offline" } });
    res.clearCookie("cookies1", { path: "/" });
    console.log("cookies-deleted");
    res.redirect("/Login");
  } catch (err) {
    console.log(`Error During Logout - ${err}`);
  }
});



// Customer Account APIs and deleting Functions

app.get("/api/adminCustomersList", async (req, res) => {
  try {
    const data = await UsersDB.find({ userType: "Customer" });
    console.log(data);

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/deleteCustomerAccount", async (req, res) => {
  try {
    await UsersDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Customer Account Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedSCustomerAccount", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await UsersDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log(
      "Selected Customer Accounts Deleted from Database Successfully"
    );
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

// Sellers Account APIs and deleting Functions

app.get("/api/adminSellersList", async (req, res) => {
  try {
    const data = await UsersDB.find({ userType: "Seller" });
    console.log(data);

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/deleteSellersAccount", async (req, res) => {
  try {
    await UsersDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Sellers Account Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedSellersAccount", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await UsersDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Sellers Accounts Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

// Admins Account APIs and deleting Functions

app.get("/api/adminsList", async (req, res) => {
  try {
    const data = await UsersDB.find({ userType: "Admin" });
    console.log(data);

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/deleteAdminAccount", async (req, res) => {
  try {
    await UsersDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Admin Account Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedAdminsAccount", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await UsersDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Admin Accounts Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

// All Users API

app.get("/api/allUsersList", async (req, res) => {
  try {
    const data = await UsersDB.find();

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// Advertisement


const uploadToCloudinaryAdvertisement = async (file) => {
  try {
    console.log("upload starts");
    const result = await cloudinary.uploader.upload(file, {
      folder: "W_Mark_Advetises",
      resource_type: "auto",
    });
    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const AdvertisementImageMulter = multer({
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
}).fields([{ name: "image", minCount: 1, maxCount: 1 }]);




app.post("/api/AddAdvertisement", AdvertisementImageMulter, async (req, res) => {
  try {
    console.log(req.files.image);
    console.log(req.body);

    const photo = req.files.image[0];

    const bufferlogo = photo.buffer;

    const b64logoFile = Buffer.from(bufferlogo).toString("base64");

    const dataURIlogoFile = "data:" + photo.mimetype + ";base64," + b64logoFile;

    const cldResLogoFile = await uploadToCloudinaryAdvertisement(dataURIlogoFile);

    const userData = await new AdvertisementsDB({
      sponserName: req.body.sponserName,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      redirectLink: req.body.redirectLink,
      isEnable: false,

      position: Array.isArray(req.body.position) ? req.body.position : (typeof req.body.position === 'string' ? req.body.position.split(',').map(pos => pos.trim()) : []),

      subCategories: Array.isArray(req.body.subCategories) ? req.body.subCategories : (typeof req.body.subCategories === 'string' ? req.body.subCategories.split(',').map(pos => pos.trim()) : []),

      tags: Array.isArray(req.body.tags) ? req.body.tags : (typeof req.body.tags === 'string' ? req.body.tags.split(',').map(pos => pos.trim()) : []),

      content: req.body.content,
      createdByName: req.body.createdByName,
      createdByEmail: req.body.createdByEmail,
      createdByUserType: req.body.createdByUserType,
      dateOfFormSubmission: new Date(),
      image: {
        data: cldResLogoFile.secure_url,
        originalFileName: photo.originalname,
        publicId: cldResLogoFile.public_id,
        contentType: `image/${cldResLogoFile.format}`,
      },
    });

    await userData.save();
    console.log("New Advertisement Added in Database Successfully");
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/deleteAdvertisement", async (req, res) => {
  try {
    await AdvertisementsDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Advertisement Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedAdvertisement", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await AdvertisementsDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Advertisements Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/allAdvertisementList", async (req, res) => {
  try {
    const data = await AdvertisementsDB.find();

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});



app.post("/api/changeIsEnableAdvertise", async (req, res) => {
  try {
    const { id, isEnabled } = req.body; // Destructure id and isEnabled from request body

    console.log(req.body)


    try {

      // Find the advertisement by id and update the isEnabled field

      const updatedAdvertisement = await AdvertisementsDB.findByIdAndUpdate(

        id,

        { isEnable: isEnabled }, // Update the isEnabled field

        { new: true } // Return the updated document

      );


      if (!updatedAdvertisement) {

        return res.status(404).send("Advertisement not found");

      }
      console.log(updatedAdvertisement)

    } catch (err) {

      console.log(err);

      res.status(500).send("Server error");

    }

  } catch (err) {
    console.log(err);
  }
});


// Advertisement


const uploadToCloudinaryHomePageTopCarousel = async (file) => {
  try {
    console.log("upload starts");
    const result = await cloudinary.uploader.upload(file, {
      folder: "W_Mark_HomePage_Top_Carousel",
      resource_type: "auto",
    });
    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const HomePageTopCarouselImageMulter = multer({
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
}).fields([{ name: "image", minCount: 1, maxCount: 1 }]);




app.post("/api/AddHomePageTopCarousel", HomePageTopCarouselImageMulter, async (req, res) => {
  try {
    console.log(req.files.image);
    console.log(req.body);

    const photo = req.files.image[0];
    const bufferlogo = photo.buffer;
    const b64logoFile = Buffer.from(bufferlogo).toString("base64");
    const dataURIlogoFile = "data:" + photo.mimetype + ";base64," + b64logoFile;
    const cldResLogoFile = await uploadToCloudinaryHomePageTopCarousel(dataURIlogoFile);
    const userData = await new AdvertisementsDB({

      redirectLink: req.body.redirectLink,
      content: req.body.content,
      createdByName: req.body.createdByName,
      createdByEmail: req.body.createdByEmail,
      createdByUserType: req.body.createdByUserType,
      image: {
        data: cldResLogoFile.secure_url,
        originalFileName: photo.originalname,
        publicId: cldResLogoFile.public_id,
        contentType: `image/${cldResLogoFile.format}`,
      },
      dateOfFormSubmission: new Date(),

    });

    await userData.save();
    console.log("New Home Page Top Carousel Added in Database Successfully");
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/deleteAdvertisement", async (req, res) => {
  try {
    await AdvertisementsDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Home Page Top Carousel Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedAdvertisement", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await AdvertisementsDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Home Page Top Carousels Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/allAdvertisementList", async (req, res) => {
  try {
    const data = await AdvertisementsDB.find();

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});






//    Tags

app.post("/api/addTag", async (req, res) => {
  try {
    const userData = await new TagsDB({
      tagName: req.body.tagName,
      content: req.body.content,
      createdBy: req.body.createdBy,
      dateOfFormSubmission: new Date(),
    });
    await userData.save();
    console.log("New Tag Added in Database Successfully");
    res.send({ status: "Ok", data: "New Tag Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/tagsList", async (req, res) => {
  try {
    const data = await TagsDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Tag List -${err}`);
  }
});

app.post("/api/deleteTag", async (req, res) => {
  try {
    await TagsDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Tag Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedTags", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await TagsDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Tag Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});


//    Categories

app.post("/api/addCategory", async (req, res) => {
  try {
    const userData = await new CategoriesDB({
      categoryName: req.body.categoryName,
      content: req.body.content,
      createdBy: req.body.createdBy,
      dateOfFormSubmission: new Date(),
    });
    await userData.save();
    console.log("New Tag Added in Database Successfully");
    res.send({ status: "Ok", data: "New Category Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/categoriesList", async (req, res) => {
  try {
    const data = await CategoriesDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Category List -${err}`);
  }
});

app.post("/api/deleteCategory", async (req, res) => {
  try {
    await CategoriesDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Category Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedCategories", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await CategoriesDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Category Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

//    Sub - Categories

app.post("/api/addSubCategory", async (req, res) => {
  try {

    const category = req.body.categoryName;
    const subCategory = req.body.subCategoryName;
    const CategoriesDB1 = await CategoriesDB.findOne({
      categoryName: category,
    });

    await CategoriesDB1.updateOne({
      $push: {
        subCategoryName: subCategory,
      },
    });

    console.log("New SubCategory Added in Database Successfully");
    res.send({ status: "Ok", data: "New SubCategory Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});


app.post("/api/deleteSubCategory", async (req, res) => {
  try {

    console.log(req.body.subCategoryName)

    const ObjectId = require("mongoose").Types.ObjectId;

    const result = await CategoriesDB.updateOne(
      {
        _id: new ObjectId(req.body.id),
        categoryName: req.body.categoryName
      },
      {
        $pull: {
          subCategoryName: req.body.subCategoryName
        }
      }

    );

    if (result.nModified === 0) {

      return res.status(404).send({ status: "ERROR", message: "No matching category found or subcategory not found" });

    }

    console.log("SubCategory Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});


//    Brands

app.post("/api/addBrand", async (req, res) => {
  try {
    const userData = await new BrandsDB({
      brandName: req.body.brandName,
      categoryName: req.body.categoryName,
      content: req.body.content,
      createdBy: req.body.createdBy,
      dateOfFormSubmission: new Date(),
    });
    await userData.save();
    console.log("New Brand Added in Database Successfully");
    res.send({ status: "Ok", data: "New Brand Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/brandsList", async (req, res) => {
  try {
    const data = await BrandsDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Brand List -${err}`);
  }
});

app.post("/api/deleteBrand", async (req, res) => {
  try {
    await BrandsDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Brand Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedBrands", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await BrandsDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Brand Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});





//    Navbar Items

app.post("/api/addNavbarItems", async (req, res) => {
  try {

    const userData = await new NavbarItemsDB({
      itemName: req.body.itemName,
      itemLink: req.body.itemLink,
      itemIcon: req.body.itemIcon,
      subItems: JSON.parse(req.body.subItems),
      createdBy: req.body.createdBy,
      dateOfFormSubmission: new Date(),
    });
    await userData.save();
    console.log("New Navbar Items Added in Database Successfully");
    res.send({ status: "Ok", data: "New Tag Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/navbarItemsList", async (req, res) => {
  try {
    const data = await NavbarItemsDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Navbar Items List -${err}`);
  }
});

app.post("/api/deleteNavbarItems", async (req, res) => {
  try {
    await NavbarItemsDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Navbar Items Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedNavbarItems", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await NavbarItemsDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Navbar Items Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

//    Markets

const uploadToCloudinaryMarkets = async (file) => {
  try {
    console.log("upload starts");
    const result = await cloudinary.uploader.upload(file, {
      folder: "W_Mark_Markets",
      resource_type: "auto",
    });
    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const MarketsImageMulter = multer({
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
}).fields([{ name: "photo", minCount: 1, maxCount: 1 }]);

app.post("/api/addMarkets", MarketsImageMulter, async (req, res) => {
  try {
    const photo = req.files.photo[0];

    const bufferlogo = photo.buffer;

    const b64logoFile = Buffer.from(bufferlogo).toString("base64");

    const dataURIlogoFile = "data:" + photo.mimetype + ";base64," + b64logoFile;

    const cldResLogoFile = await uploadToCloudinaryMarkets(dataURIlogoFile);

    const userData = await new MarketsDB({
      name: req.body.name,
      state: req.body.state,
      district: req.body.district,
      location: req.body.location,
      totalShops: req.body.totalShops,
      speciality: JSON.parse(req.body.speciality),
      createdBy: req.body.createdBy,
      dateOfFormSubmission: new Date(),
      photo: {
        data: cldResLogoFile.secure_url,
        originalFileName: photo.originalname,
        publicId: cldResLogoFile.public_id,
        contentType: `image/${cldResLogoFile.format}`,
      },
    });

    await userData.save();
    console.log("New Market Added in Database Successfully");
    res.send({ status: "Ok", data: "New Tag Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/marketsList", async (req, res) => {
  try {
    const data = await MarketsDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Market List -${err}`);
  }
});

app.post("/api/deleteMarket", async (req, res) => {
  try {
    await MarketsDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Market Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedMarket", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await MarketsDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Market Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});


// Admin Navbar Setting Contents

app.post("/api/addNewAdminNavBarSettingsContents", async (req, res) => {
  try {

    const userData = await new AdminNavbarSettingContentDB({
      name: req.body.name,
      link: req.body.link,
      details: req.body.details,
      createdByName: req.body.createdByName,
      createdByEmail: req.body.createdByEmail,
      dateOfFormSubmission: new Date(),

    });

    await userData.save();
    console.log("New Admin Navbar Setting Content Added in Database Successfully");
    res.send({ status: "Ok", data: "New Tag Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/adminNavBarSettingsContentsList", async (req, res) => {
  try {
    const data = await AdminNavbarSettingContentDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Market List -${err}`);
  }
});


//    Products


const uploadToCloudinaryMultipleFiles = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "W_Mark_Products",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );


    // End the stream with the file buffer

    stream.end(file.buffer);

  });

};


const ProductsImageMulter = multer({
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
}).fields([{ name: "images", minCount: 1, maxCount: 8 }]);

app.post("/api/addNewProduct", ProductsImageMulter, async (req, res) => {
  try {



    const productImagesRaw = req.files.images;

    const productImages = await Promise.all(
      productImagesRaw.map((file) => uploadToCloudinaryMultipleFiles(file))
    );

    const processedImages = productImages.map((cldRes) => ({
      data: cldRes.secure_url,

      publicId: cldRes.public_id,

      originalFileName: cldRes.original_filename + "." + cldRes.format,

      contentType: `image/${cldRes.format}`,
    }));

    const stockAvailable = req.body.stock_available;

    let productId;
    do {
      productId = shortid.generate();
    } while (await ProductsDB.findOne({ id: productId }));

    // Discount Calculation

    const price = parseFloat(req.body.price) || 0;

    const discount = parseFloat(req.body.sellerDiscount) || 0;
    const adminDiscount = parseFloat(req.body.adminDiscount) || 0;
    const totalDiscount = discount + adminDiscount

    const discountAmount = (price * totalDiscount) / 100;

    const effectivePrice = price - discountAmount;
    const EffectivePrice = effectivePrice.toFixed(0)

    const tags = JSON.parse(req.body.tags);
    console.log(tags.map(tag => tag))


    const userData = await new ProductsDB({
      id: productId,
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      effectivePrice: EffectivePrice,
      newOrRefurbished: req.body.newOrRefurbished,
      brand: req.body.brand,
      model: req.body.model,
      color: req.body.color,
      weight: req.body.weight,
      marketName: req.body.marketName,
      dimensions: req.body.dimensions,
      sellerDiscount: req.body.sellerDiscount,
      adminDiscount: req.body.adminDiscount,
      adminDiscount: 0,
      rating: 0,
      stock_available: req.body.stock_available,
      stockNextRefillDate: req.body.stockNextRefillDate,
      youtubeUrl: req.body.youtubeUrl,
      productDetails: req.body.productDetails,
      warrantyDetails: req.body.warrantyDetails,
      technicalDetails: req.body.technicalDetails,
      tags: JSON.parse(req.body.tags),
      createdByName: req.body.createdByName,
      createdByType: req.body.createdByType,
      dateOfFormSubmission: new Date(),
      images: processedImages,

    });

    await userData.save();
    console.log("New Product Added in Database Successfully");
    res.send({ status: "Ok", data: "New Tag Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.get("/api/productsList", async (req, res) => {
  try {
    const data = await ProductsDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Product List -${err}`);
  }
});

app.post("/api/deleteProduct", async (req, res) => {
  try {

    await ProductsDB.deleteOne({
      _id: req.body.id,

    });

    console.log("Product Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedProduct", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await ProductsDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log("Selected Product Deleted Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});


// Add To Cart Product

// app.post("/api/addToCartProduct", async (req, res) => {
//   // console.log(req.body)

//   const id = req.body.productId;

//   const DB = await ProductsDB.findOne({ _id: id })
//   // console.log(DB)

//   if (!DB) {
//     return res.status(404).send({ status: "Error", message: "Product not found." });
//   }

//   const data = {
//     userName: req.body.userName,
//     userEmail: req.body.userEmail,
//     productId: req.body.productId,
//     productName: req.body.productName,
//     dateOfFormSubmission: new Date(),
//   };

//   if (!Array.isArray(DB.addToCart)) {

//     console.error("addToCart is not an array or is undefined");

//     return res.status(500).send({ status: "Error", message: "Internal server error." });

//   }


//   // Find the index of the existing entry

//   const existingEntryIndex = DB.addToCart.findIndex(item =>
//     (
//       item.userEmail === (req.body.userEmail)) && (item.productId === (req.body.productId)
//     )

//   );
//   console.log("1 : ", existingEntryIndex)



//   // Check if the entry exists

//   if (existingEntryIndex !== -1) {

//     DB.addToCart.splice(existingEntryIndex, 1);
//     await DB.save();
//     console.log("Removed From Cart Successfully!");
//     res.send({ status: "Ok", data: "Removed From Cart Successfully." });


//   } else {
//     DB.addToCart.push(data);
//     await DB.save();
//     console.log("Add To Cart Successfully");

//     res.send({ status: "Ok", data: "Add To Cart Successfully." });

//   }





//   console.log("New Product Added in Database Successfully");



// })

app.post("/api/addToCartProduct", async (req, res) => {

  const id = req.body.productId;


  const DB = await ProductsDB.findOne({ _id: id });

  const userEntry = await UsersDB.findOne({ email: req.body.userEmail });
  console.log("userEntry: ", userEntry)

  const cartItem = {

    productName: req.body.productName,

    productId: req.body.productId,

  };

  if (!DB) {

    return res.status(404).send({ status: "Error", message: "Product not found." });

  }


  const productData = {

    userName: req.body.userName,

    userEmail: req.body.userEmail,

    productId: req.body.productId,

    productName: req.body.productName,

    dateOfFormSubmission: new Date(),

  };


  // Check if the product is already in the ProductsDB cart

  if (!Array.isArray(DB.addToCart)) {

    console.error("addToCart is not an array or is undefined");

    return res.status(500).send({ status: "Error", message: "Internal server error." });

  }


  // Find the index of the existing entry in ProductsDB

  const existingEntryIndex = DB.addToCart.findIndex(item =>

    item.userEmail === req.body.userEmail && item.productId === req.body.productId

  );


  // Check if the entry exists in ProductsDB

  if (existingEntryIndex !== -1) {

    DB.addToCart.splice(existingEntryIndex, 1);

    await DB.save();

    console.log("Removed From Cart Successfully!");

    // res.send({ status: "Ok", data: "Removed From Cart Successfully." });

  } else {

    DB.addToCart.push(productData);

    await DB.save();

    console.log("Add To Cart Successfully");



    res.send({ status: "Ok", data: "Add To Cart Successfully." });

  }

  // Now handle the UsersDB entry




  if (userEntry) {
    // User exists, check if the product is already in the cart

    const existingCartIndex = userEntry.cart.findIndex(item => item.productId === req.body.productId);
    console.log("existingCartIndex", existingCartIndex)


    if (existingCartIndex !== -1) {

      userEntry.cart.splice(existingCartIndex, 1);

      await userEntry.save();

      console.log("Product removed from user's cart.");
      res.send({ status: "Ok", data: "Removed From Cart Successfully." });


    } else {


      // Add the new product to the user's cart if it doesn't exist

      userEntry.cart.push(cartItem);

      await userEntry.save();

      console.log("Product added to existing user's cart.");


    }

  } else {
    // If user does not exist, create a new entry

    const newUserEntry = new UsersDB({

      userName: req.body.userName,

      userEmail: req.body.userEmail,

      cart: [cartItem], // Initialize cart with the new product

    });

    await newUserEntry.save();

    console.log("New user entry created with cart.");
  }



  console.log("New Product Added in Database Successfully");

});


// Product Rating And Reviews

app.post("/api/productRating", async (req, res) => {

  try {

    const id = req.body.id;

    const rating = parseInt(req.body.rating);

    const title = req.body.title;
    const comment = req.body.comment;



    const product = await ProductsDB.findById(id);

    if (!product) {

      return res.status(404).send({ message: "Product not found" });

    }

    let commentId;
    do {
      commentId = shortid.generate();
    } while (await ProductsDB.findOne({ "reviews.commentId": commentId }));


    const newReview = {

      commentId: commentId,
      rating: rating,
      title: title,
      comment: comment,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      dateOfFormSubmission: new Date()

    };


    product.reviews.push(newReview);


    const totalRatings = product.reviews.reduce((acc, review) => acc + review.rating, 0) || 0;

    const averageRating = totalRatings / product.reviews.length;


    // Update the product with the new review and average rating

    product.averageRating = averageRating.toFixed(0);


    // Save the updated product

    const updatedProduct = await product.save();



    // Send a single response after the product is successfully saved

    res.status(200).send({

      message: "Rating added successfully",

      averageRating: averageRating.toFixed(0), // Send the average rating as a string

      product: updatedProduct, // Optionally include the updated product

    });


  } catch (err) {

    console.error(`Error during sending Product List - ${err}`);

    res.status(500).send({ message: "Error updating product" });

  }

});


app.post("/api/likedComment", async (req, res) => {

  try {

    const { id, userName, userEmail, commentId } = req.body;


    // Find the product by ID


    const product = await ProductsDB.findById(id);


    if (!product) {

      return res.status(404).send({ message: "Product not found" });

    }


    // Find the review with the matching commentId

    const review = product.reviews.find(review => review.commentId === commentId);


    if (!review) {
      console.log("Review not found")

      return res.status(404).send({ message: "Review not found" });

    }


    // Check if the user has already liked the comment


    const alreadyLikedIndex = await review.likes.findIndex(like => like.userEmail === userEmail);


    if (alreadyLikedIndex !== -1) {

      // User has already liked the comment, remove their like
      console.log("You have already liked this comment")

      await review.likes.splice(alreadyLikedIndex, 1);

      console.log("Like removed successfully");

      await product.save();

      return res.status(200).send({ message: "Like removed successfully" });

    }

    // Check if the user has already disliked the comment

    const alreadyDisLikedIndex = await review.disLikes.findIndex(like => like.userEmail === userEmail);


    if (alreadyDisLikedIndex !== -1) {

      // User has already liked the comment, remove their like
      console.log("You have already disliked this comment")

      await review.disLikes.splice(alreadyDisLikedIndex, 1);

      console.log("Dislike removed successfully");

      await product.save();

      // return res.status(200).send({ message: "Dislike removed successfully" });

    }


    // Push the like into the likes array

    await review.likes.push({

      userName,

      userEmail,

      dateOfFormSubmission: new Date() // Store the current date

    });


    // Save the updated product

    await product.save();

    console.log("comment liked successfully")


    // Send a success response

    res.status(200).send({

      message: "Liked Comment added successfully",

    });


  } catch (err) {

    console.error(`Error during sending Liked Comment - ${err}`);

    res.status(500).send({ message: "Error Sending Liked Comment" });

  }

});

app.post("/api/dislikedComment", async (req, res) => {

  try {

    const { id, userName, userEmail, commentId } = req.body;


    // Find the product by ID


    const product = await ProductsDB.findById(id);


    if (!product) {

      return res.status(404).send({ message: "Product not found" });

    }


    // Find the review with the matching commentId

    const review = product.reviews.find(review => review.commentId === commentId);


    if (!review) {
      console.log("Review not found")

      return res.status(404).send({ message: "Review not found" });

    }


    // Check if the user has already disliked the comment

    const alreadyDisLikedIndex = await review.disLikes.findIndex(like => like.userEmail === userEmail);


    if (alreadyDisLikedIndex !== -1) {

      // User has already liked the comment, remove their like
      console.log("You have already disliked this comment")

      await review.disLikes.splice(alreadyDisLikedIndex, 1);

      console.log("Dislike removed successfully");

      await product.save();

      return res.status(200).send({ message: "Dislike removed successfully" });

    }

    // Check if the user has already liked the comment


    const alreadyLikedIndex = await review.likes.findIndex(like => like.userEmail === userEmail);


    if (alreadyLikedIndex !== -1) {

      // User has already liked the comment, remove their like
      console.log("You have already liked this comment")

      await review.likes.splice(alreadyLikedIndex, 1);

      console.log("Like removed successfully");

      await product.save();

      // return res.status(200).send({ message: "Like removed successfully" });

    }



    // Push the like into the dislikes array

    await review.disLikes.push({

      userName,

      userEmail,

      dateOfFormSubmission: new Date() // Store the current date

    });


    // Save the updated product

    await product.save();

    console.log("comment disiked successfully")


    // Send a success response

    res.status(200).send({

      message: "Disiked Comment added successfully",

    });


  } catch (err) {

    console.error(`Error during sending Disiked Comment - ${err}`);

    res.status(500).send({ message: "Error Sending Disiked Comment" });

  }

});

// Bank Offers



const uploadToCloudinaryBankOffer = async (file) => {
  try {
    console.log("upload starts");
    const result = await cloudinary.uploader.upload(file, {
      folder: "W_Mark_Bank_Offers",
      resource_type: "auto",
    });
    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const BankOfferMulter = multer({
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
}).fields([{ name: "logo", minCount: 0, maxCount: 1 }]);




app.post("/api/addBankOffer", BankOfferMulter, async (req, res) => {
  try {


    const photo = req.files.logo[0];

    const bufferlogo = photo.buffer;

    const b64logoFile = Buffer.from(bufferlogo).toString("base64");

    const dataURIlogoFile = "data:" + photo.mimetype + ";base64," + b64logoFile;

    const cldResLogoFile = await uploadToCloudinaryBankOffer(dataURIlogoFile);

    const userData = await new BankOfferDB({
      bankName: req.body.bankName,
      tenure: req.body.tenure,
      processingFees: req.body.processingFees,
      rateOfInterest: req.body.rateOfInterest,
      phoneNo: req.body.phoneNo,
      prepaymentCharges: req.body.prepaymentCharges,
      loanAmount: req.body.loanAmount,
      otherInformation: req.body.otherInformation,
      foreclosureCharges: req.body.foreclosureCharges,
      logo: {
        data: cldResLogoFile.secure_url,
        originalFileName: photo.originalname,
        publicId: cldResLogoFile.public_id,
        contentType: `image/${cldResLogoFile.format}`,
      },
      dateOfFormSubmission: new Date(),
    });
    await userData.save();
    console.log("New Bank Offer Added in Database Successfully");
    res.send({ status: "Ok", data: "New Developer Details Saved." });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});


app.get("/api/bankOfferList", async (req, res) => {
  try {
    const data = await BankOfferDB.find();
    res.send(data);
  } catch (err) {
    console.log(`Error during sending Properties List -${err}`);
  }
});

app.post("/api/updateBankOffer", BankOfferMulter, async (req, res) => {
  try {






    const id = req.body.id;

    let previous = await BankOfferDB.findOne({
      _id: id,
    });

    const prevPublicId = previous.logo.publicId;

    const updateData = {
      bankName: req.body.bankName,
      tenure: req.body.tenure,
      processingFees: req.body.processingFees,
      rateOfInterest: req.body.rateOfInterest,
      phoneNo: req.body.phoneNo,
      prepaymentCharges: req.body.prepaymentCharges,
      loanAmount: req.body.loanAmount,
      otherInformation: req.body.otherInformation,
      foreclosureCharges: req.body.foreclosureCharges,

      dateOfFormSubmission: new Date(),
    }

    if (req.files === undefined) {
      updateData.logo = {
        publicId: previous.logo.publicId,
        originalFileName: previous.logo.originalFileName,
        data: previous.logo.data,
        contentType: "image/png",
      };

      console.log("Bank Offer (without Images) Updated Successfully");
    } else {

      const photo = req.files.logo[0];
      console.log(photo)

      const bufferlogo = photo.buffer;

      const b64logoFile = Buffer.from(bufferlogo).toString("base64");

      const dataURIlogoFile = "data:" + photo.mimetype + ";base64," + b64logoFile;

      const cldResLogoFile = await uploadToCloudinaryBankOffer(dataURIlogoFile);


      if (cldResLogoFile) {
        try {
          await cloudinary.uploader.destroy(prevPublicId, {
            invalidate: true,
          });
        } catch (err) {
          console.error(`Error deleting image from Cloudinary: ${err}`);
        }

        updateData.logo = {
          publicId: cldResLogoFile.public_id,
          originalFileName: photo.originalname,
          data: cldResLogoFile.secure_url,
          contentType: "image/png",
        };

        console.log("Logo (with image) Updated Successfully");
      } else {
        updateData.logo = {
          publicId: previous.logo.publicId,
          data: previous.logo.data,
          contentType: "image/png",
        };
        console.log("Logo (without image) Updated Successfully");
      }
    }

    await BankOfferDB.findOneAndUpdate(
      { _id: id },
      {
        $set: updateData,
      }
    );
    console.log("Existing Bank Offer Updated in Database Successfully");
    res.send({ status: "Ok", data: "Existing Bank Offer Updated." });
  } catch (err) {
    console.log(`Error during updating bank offer -${err}`);
  }
});

app.post("/api/deleteBankOffer", async (req, res) => {
  try {
    await BankOfferDB.deleteOne({
      _id: req.body.id,
    });
    console.log("Bank Offer Deleted from Database Successfully");
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

app.post("/api/deleteSelectedBankOffers", async (req, res) => {
  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    const ids = req.body.ids;
    const objectIds = ids.map((id) => new ObjectId(id));

    await BankOfferDB.deleteMany({
      _id: { $in: objectIds },
    });
    console.log(
      "Selected Bank Offers Deleted from Database Successfully"
    );
    res.send({ status: "OK", data: "Deleted" });
  } catch (err) {
    console.log(err);
    res.redirect("/failure-message");
  }
});

// Profile Funtions

app.get("/api/userProfile", authenticate, async (req, res) => {
  try {
    res.send(req.rootUser);
  } catch (err) {
    console.log(`Error during Employeee Profile Page -${err}`);
  }
});

app.get("/api/uptime", async (req, res) => {
  const uptime = os.uptime();
  const uptimeString = moment.duration(uptime, "seconds").humanize();
  console.log(uptimeString);

  res.json({ uptime: uptimeString });
});

app.get("/api/system-status", async (req, res) => {
  try {
    const systemInfo = await si.system();
    const cpuInfo = await si.cpu();
    const memInfo = await si.mem();
    const diskLayout = await si.diskLayout();
    const networkInfo = await si.networkStats();

    const diskInfo = diskLayout.reduce(
      (acc, disk) => {
        if (typeof disk.size === "number") {
          acc.total += disk.size;

          acc.available += 0; // or some other default value
        }

        return acc;
      },
      { total: 0, available: 0 }
    );

    const diskUsed = diskInfo.total - diskInfo.available;

    const systemStatus = {
      system: {
        os: systemInfo.os,
        platform: systemInfo.platform,
        arch: systemInfo.arch,
        uptime: os.uptime(),
      },

      cpu: {
        manufacturer: cpuInfo.manufacturer,
        brand: cpuInfo.brand,
        model: cpuInfo.model,
        cores: cpuInfo.cores,
        speed: cpuInfo.speed,
        usage: cpuInfo.usage,
      },

      os: {
        platform: os.platform(),

        arch: os.arch(),

        release: os.release(),

        type: os.type(),

        hostname: os.hostname(),
      },

      memory: {
        total: memInfo.total,
        used: memInfo.used,
        active: memInfo.active,
        available: memInfo.available,
      },

      disk: {
        total: (diskInfo.total / 1024 / 1024 / 1024).toFixed(2) + " GB",

        used: (diskUsed / 1024 / 1024 / 1024).toFixed(2) + " GB",

        available: (diskInfo.available / 1024 / 1024 / 1024).toFixed(2) + " GB",
      },

      network: {
        rx: networkInfo[0].rx,
        tx: networkInfo[0].tx,
      },
    };
    console.log(systemStatus);

    res.json(systemStatus);

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "Failed to retrieve system status" });
  }
});

let isConnected = false;

mongoose.connection.once("open", () => {

  isConnected = true;

});

app.get("/api/db-status", (req, res) => {
  if (isConnected) {
    res.status(200).json({ message: "Connected" });
  } else {
    res.status(500).json({ message: "Not Connected" });
  }
});

app.get("/api/response-time", (req, res) => {
  const startTime = Date.now();

  // Simulate some work or database query

  setTimeout(() => {
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    res.json({ responseTime: `${responseTime}ms` });
  }, 2000); // simulate 2 seconds of work
});


app.listen(PORT, () => {
  console.log("Server is running on : ", PORT);
});
