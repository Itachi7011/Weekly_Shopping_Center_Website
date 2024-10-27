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
const NavbarItemsDB = require("./database/schema/navbarItems");
const MarketsDB = require("./database/schema/markets/markets");
const ProductsDB = require("./database/schema/products/products");

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
      console.log(req.body);
      console.log(req.files);
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

//    Navbar Items

app.post("/api/addNavbarItems", async (req, res) => {
  try {
    console.log(req.body);

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

//    Products

const uploadToCloudinaryProducts = async (file) => {
  try {
    console.log("upload starts");
    const result = await cloudinary.uploader.upload(file, {
      folder: "W_Mark_Products",
      resource_type: "auto",
    });
    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
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
}).fields([{ name: "images", minCount: 1, maxCount: 4 }]);

app.post("/api/addProducts", ProductsImageMulter, async (req, res) => {
  try {
    
    const projectImageRaw = req.files.images;

    const projectImage = await Promise.all(
      projectImageRaw.map((file) => uploadToCloudinaryMultipleFiles(file))
    );

    const processedImages = projectImage.map((cldRes) => ({
      data: cldRes.secure_url,

      publicId: cldRes.public_id,
      
      originalFileName: cldRes.original_filename + "." + cldRes.format,

      contentType: `image/${cldRes.format}`,
    }));

    //
    let productId;
    do {
      productId = shortid.generate();
    } while (await ProductsDB.findOne({ id: productId }));
    const userData = await new ProductsDB({
      id: productId,
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      brand: req.body.brand,
      model: req.body.model,
      size: req.body.size,
      color: req.body.color,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      discount: req.body.discount,
      stock_quantity: req.body.stock_quantity,
      youtubeUrl: req.body.youtubeUrl,
      description: req.body.description,
      status: req.body.status,
      tags: JSON.parse(req.body.tags),
      createdBy: req.body.createdBy,
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
