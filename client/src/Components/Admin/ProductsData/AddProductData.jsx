import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import debounce from "lodash/debounce";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Container,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Radio,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const AddNewproject = () => {
  const inputArr = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];
  const [arr, setArr] = useState(inputArr);
  const [bankOffers, setBankOffers] = useState({ post: [] });
  const [selectedValues, setSelectedValues] = useState([]);
  const [bankOfferSend, setbankOfferSend] = useState([]);
  const [selectedValues1, setSelectedValues1] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSubLocation, setSelectedSubLocation] = useState("");
  const [locations, setLocations] = useState([]);

  const [subLocations, setSubLocations] = useState([]);
  const [usps, setUsps] = useState([]);

  const [Localities, setLocalities] = useState({ post: [] });
  const [tabIndex, setTabIndex] = useState(0);
  const [image, setImage] = useState("");
  const [image1, setImage1] = useState([]);
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");
  const [image6, setImage6] = useState("");
  const [image7, setImage7] = useState("");
  const [image8, setImage8] = useState("");

  const [specificationText, setSpecificationText] = useState("");
  const [locationMapText, setLcationMapText] = useState("");
  const [masterPlanText, setMasterPlanText] = useState("");
  const [pricePlanText, setPricePlanText] = useState("");
  const [paymentPlanText, setPaymentPlanText] = useState("");
  const [constructionText, setConstructionText] = useState("");
  const [contactUsText, setContactUsText] = useState("");

  const [data, setData] = useState("");
  const [user, setUser] = useState({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    brand: "",
    model: "",
    size: "",
    color: "",
    weight: "",
    dimensions: "",
    stock_quantity: "",
    youtubeUrl: "",
    status: "",
    tags: "",
    frontPhoto: "",
    createdBy: "",
  });


  const UserDetails = async () => {
    try {
      const res = await fetch("/api/userProfile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      setData(data);

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

  useEffect(() => {
    axios
      .get("/api/categoriesList")
      .then((response) => {
        const data = response.data;

        setCategory( data );
      })
      .catch((err) => {
        console.log("Error during Data:", err);
      });
  }, []);
 
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const regRef = useRef(null);

  const debouncedHandleInputUsp = debounce((e) => {
    const { value } = e.target;
    setUsps([...usps, value]);
  }, 300);

  const debouncedHandleInput = debounce((e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }, 300);

  const handleDropdownChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const debouncedOnChange = debounce((event, editor) => {
    const data = editor.getData();

    setLcationMapText(data);
  }, 500); // debounce for 500ms

  const debouncedOnChange1 = debounce((event, editor) => {
    const data = editor.getData();

    setMasterPlanText(data);
  }, 500);
  const debouncedOnChange2 = debounce((event, editor) => {
    const data = editor.getData();

    setPricePlanText(data);
  }, 500);
  const debouncedOnChange3 = debounce((event, editor) => {
    const data = editor.getData();

    setPaymentPlanText(data);
  }, 500);
  const debouncedOnChange4 = debounce((event, editor) => {
    const data = editor.getData();

    setConstructionText(data);
  }, 500);
  const debouncedOnChange5 = debounce((event, editor) => {
    const data = editor.getData();

    setContactUsText(data);
  }, 500);

  const debouncedOnChange6 = debounce((event, editor) => {
    const data = editor.getData();

    setSpecificationText(data);
  }, 500);

  const addInput = () => {
    setArr((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
        },
      ];
    });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setbankOfferSend([...bankOfferSend, value]);
    } else {
      setbankOfferSend(bankOfferSend.filter((val) => val !== value));
    }
  };

  const handleCheckboxChange1 = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedValues1([...selectedValues1, value]);
    } else {
      setSelectedValues1(selectedValues1.filter((val) => val !== value));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit button pressed");

    var bodyFormData = new FormData();
    bodyFormData.append("ownerName", data.developerName);
    bodyFormData.append("email", User.email);
    bodyFormData.append("totalAmount", data.totalAmount);
    bodyFormData.append("projectType", data.projectType);
    bodyFormData.append("userType", User.userType);
    bodyFormData.append("projectListedBy", User.name);
    bodyFormData.append("phoneNo", User.phoneNo);

    bodyFormData.append("total_area", data.total_area);
    bodyFormData.append("project_name", data.project_name);
    bodyFormData.append("min_area", data.min_area);
    bodyFormData.append("max_area", data.max_area);
    bodyFormData.append("bank_offers", JSON.stringify(bankOfferSend));
    bodyFormData.append("amenities", JSON.stringify(selectedValues1));
    bodyFormData.append("floorPlan", data.floorPlan);
    bodyFormData.append("featureProject", data.featureProject);
    bodyFormData.append("usp", JSON.stringify(usps));
    bodyFormData.append("posession_date", data.posession_date);
    bodyFormData.append("reg", data.reg);
    bodyFormData.append("rera_approval", data.rera_approval);
    bodyFormData.append("price", data.price);
    bodyFormData.append("min_price", data.min_price);
    bodyFormData.append("developerName", data.developerName);
    bodyFormData.append("youtube_URL", data.youtube_URL);
    bodyFormData.append("max_price", data.max_price);
    bodyFormData.append("area", data.area);
    bodyFormData.append("open_area", data.open_area);
    bodyFormData.append("projectFor", data.projectFor);
    bodyFormData.append("project_lane_address", data.project_lane_address);
    bodyFormData.append("sub_location", selectedSubLocation);
    bodyFormData.append("location", selectedLocation);
    bodyFormData.append("city", selectedCity);
    // bodyFormData.append("city", data.city);
    bodyFormData.append("constructionStatus", data.constructionStatus);
    bodyFormData.append("bhkNumber", data.bhkNumber);
    bodyFormData.append("no_of_tower", data.no_of_tower);
    bodyFormData.append("no_of_floor", data.no_of_floor);
    bodyFormData.append("no_of_units", data.no_of_units);
    bodyFormData.append("metaKeyword", data.metaKeyword);

    bodyFormData.append("specificationStatus", data.specificationStatus);
    bodyFormData.append("locationMapStatus", data.locationMapStatus);
    bodyFormData.append("masterPlanStatus", data.masterPlanStatus);
    bodyFormData.append("floorPlanStatus", data.floorPlanStatus);
    bodyFormData.append("pricePlanStatus", data.pricePlanStatus);
    bodyFormData.append("paymentPlanStatus", data.paymentPlanStatus);
    bodyFormData.append("e_brochureStatus", data.e_brochureStatus);
    bodyFormData.append(
      "constructionUpdateStatus",
      data.constructionUpdateStatus
    );
    bodyFormData.append("contactUsStatus", data.contactUsStatus);

    bodyFormData.append("logoImage", image);

    // bodyFormData.append("projectImage", image1);
    // Array.from(image1).forEach(item=>{
    //   bodyFormData.append("projectImage", JSON.stringify(image1))
    // })
    // bodyFormData.append("projectImage", image1)

    for (let i = 0; i < image1.length; i++) {
      bodyFormData.append("projectImage", image1[i]);
    }

    // image1.forEach((file, index) => {

    //   bodyFormData.append(`projectImage${index}`, file);

    // });
    for (let i = 0; i < image2.length; i++) {
      bodyFormData.append("floorPlanImage", image2[i]);
    }

    // bodyFormData.append("floorPlanImage", image2);
    bodyFormData.append("pricePlanImage", image3);
    bodyFormData.append("paymentPlanImage", image4);
    bodyFormData.append("locationMapImage", image8);

    bodyFormData.append("e_brochureImage", image5);
    bodyFormData.append("constructionUpdateImage", image6);
    bodyFormData.append("contactUsImage", image7);

    bodyFormData.append("constructionData", constructionText);
    bodyFormData.append("project_specification", specificationText);
    bodyFormData.append("locationMap", locationMapText);
    bodyFormData.append("masterPlan", masterPlanText);
    bodyFormData.append("pricePlanDetails", pricePlanText);
    bodyFormData.append("paymentPlanDetails", paymentPlanText);
    bodyFormData.append("contactUsDetails", contactUsText);

    try {
      await axios.post(
        "/api/add-new-project",

        bodyFormData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("New Property added Successfully");

      // request successful, refresh the page

      window.location.reload();
    } catch (error) {
      //handle error

      console.log(error);
    }
  };

  return (
    <div
      className="newProjectMainDiv"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        marginTop: "3rem",
        marginBottom: "5rem",
        marginLeft: "5rem",
        marginRight: "5rem",
        borderRadius: "20px",
        padding: "1rem"
        // zIndex: "999",
        // position: "absolute",
        // left: "12rem",
      }}
    >
      <div>
        <div>
          <h2 style={{ textAlign: "center", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", margin: "1% 30%", padding: "0.2rem" }}>Add New Product</h2>
        </div>

        <div className="tablist">
          <Tabs
            forceRenderTabPanel={true}
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <TabList>
              <Tab id="Project">Product</Tab>
              <Tab>Brand</Tab>
              <Tab id="LocationMap">Specifications</Tab>
              <Tab id="MasterPlan">Price Details</Tab>
              <Tab id="FloorPlan">Stock Available</Tab>
              <Tab id="PricePlan">Images & Videos</Tab>

            </TabList>

            <TabPanel>
              <Container
                component="main"
                maxWidth="xl"
                rowspacing={2}
                style={{
                  marginTop: "2%",
                  marginBottom: "2%",
                  display: "block",
                }}
              >
                <div>
                  <Grid container spacing={2} rowSpacing={1.2}>
                    {/* email address */}
                    <Grid item xs={4}>
                      Project Name
                      <TextField
                        placeholder="Project Name"
                        // label="Project Name"
                        size="small"
                        fullWidth
                        name="project_name"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      Meta Keyword{" "}
                      <TextField
                        placeholder="Meta Keyword"
                        fullWidth
                        size="small"
                        name="metaKeyword"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                    <br />
                    <Grid item xs={4}>
                      For{" "}
                      <select
                        style={{
                          height: "3.7vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        name="projectFor"
                        onChange={handleDropdownChange}
                        value={data.projectFor}
                      >
                        <option value=""></option>
                        <option value="Sell">Sell</option>
                        <option value="Rent">Rent</option>
                      </select>
                    </Grid>
                    <Grid item xs={4}>
                      Minimum Price{" "}
                      <TextField
                        placeholder="Minimum Price"
                        // label="Minimum Price"
                        name="min_price"
                        fullWidth
                        size="small"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                    {/* last name */}
                    <Grid item xs={4}>
                      Maximum Price{" "}
                      <TextField
                        placeholder="Maximum Price"
                        name="max_price"
                        fullWidth
                        size="small"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                    <br />
                    <br />
                    <Grid
                      container
                      xs={12}
                      spacing={2}
                      rowSpacing={2}
                      style={{ marginLeft: "0.1%" }}
                    >
                      <Grid item xs={4}>
                        Minimum Area{" "}
                        <TextField
                          placeholder="Minimum Area"
                          // label="Minimum Area"
                          name="min_area"
                          fullWidth
                          size="small"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                      {/* last name */}
                      <Grid item xs={4}>
                        Maximum Area{" "}
                        <TextField
                          placeholder="Maximum Area"
                          // label="Maximum Area"
                          name="max_area"
                          fullWidth
                          size="small"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={4}>
                      <InputLabel id="demo-simple-select-label">
                        Project Type
                      </InputLabel>

                      <select
                        style={{
                          height: "6vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        name="projectType"
                        onChange={handleDropdownChange}
                        value={data.projectType}
                      >
                        <option value=""></option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Commercial Plot">Commercial Plot</option>
                      </select>
                    </Grid>
                    <Grid item xs={4}>
                      <InputLabel id="demo-simple-select-label">
                        Select BHK
                      </InputLabel>

                      <select
                        style={{
                          height: "6vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        name="bhkNumber"
                        onChange={handleDropdownChange}
                        value={data.bhkNumber}
                      >
                        <option value=""></option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK</option>
                        <option value="5 BHK">5 BHK</option>
                        <option value="5+ BHK">5+ BHK</option>
                      </select>
                    </Grid>
                    <Grid item xs={4}>
                      <InputLabel id="demo-simple-select-label">
                        Construction Status
                      </InputLabel>

                      <select
                        style={{
                          height: "6vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        name="constructionStatus"
                        onChange={handleDropdownChange}
                        value={data.constructionStatus}
                      >
                        <option value=""></option>
                        <option value="New Launch">New Launch</option>
                        <option value="Under Construction">
                          Under Construction
                        </option>
                        <option value="Ready To Move">Ready To Move</option>
                      </select>
                    </Grid>
                    <br />
                    <Grid
                      container
                      xs={12}
                      spacing={2}
                      style={{ marginLeft: "0.1%" }}
                    >
                      <Grid item xs={4}>
                        <FormControl>
                          <FormLabel id="demo-radio-buttons-group-label">
                            Feature Project
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                              name="featureProject"
                              className="radioBtn"
                              onChange={debouncedHandleInput}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                              name="featureProject"
                              className="radioBtn"
                              onChange={debouncedHandleInput}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl>
                          <FormLabel id="demo-radio-buttons-group-label">
                            RERA Approval
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                              name="rera_approval"
                              className="radioBtn"
                              onChange={debouncedHandleInput}
                              onClick={() => {
                                regRef.current.style.display = "block";
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                              name="rera_approval"
                              className="radioBtn"
                              onChange={debouncedHandleInput}
                              onClick={() => {
                                regRef.current.style.display = "none";
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      <br />
                      <Grid
                        item
                        xs={4}
                        ref={regRef}
                        style={{ display: "none" }}
                      >
                        <TextField
                          placeholder="Reg"
                          label="Reg"
                          fullWidth
                          onChange={debouncedHandleInput}
                          name="reg"
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      xs={12}
                      spacing={2}
                      rowSpacing={1}
                      style={{ marginLeft: "0.1%" }}
                    >
                      <Grid item xs={4}>
                        <TextField
                          placeholder=" USP"
                          label="USP"
                          fullWidth
                          name="usp"
                          onChange={debouncedHandleInputUsp}
                        />
                      </Grid>
                      {arr.map((item, i) => {
                        return (
                          <Grid item xs={4}>
                            <TextField
                              placeholder=" USP"
                              label="USP"
                              fullWidth
                              onChange={debouncedHandleInputUsp}
                              // size="40"
                              name="usp"
                            />
                          </Grid>
                        );
                      })}{" "}
                      <br />
                      <div>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={addInput}
                          style={{
                            marginLeft: "1rem",
                            marginBottom: "-5rem",
                            padding: "0rem !important",
                            height: "5px !important",
                            fontSize: "large",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </Grid>
                    <Grid
                      container
                      xs={12}
                      spacing={2}
                      rowSpacing={1}
                      style={{ marginLeft: "0.1%", marginTop: "3rem" }}
                    >
                      <Grid item xs={4}>
                        <TextField
                          placeholder="Possession Date"
                          label="Possession Date"
                          fullWidth
                          name="posession_date"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          placeholder=" No. Of Units"
                          label="No. Of Units"
                          fullWidth
                          name="no_of_units"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          placeholder=" No. Of Tower"
                          label="No. Of Tower"
                          fullWidth
                          name="no_of_tower"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          placeholder=" No. Of Floor"
                          label="No. Of Floor"
                          fullWidth
                          name="no_of_floor"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          placeholder=" Total Area"
                          label="Total Area"
                          fullWidth
                          name="total_area"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          placeholder=" Open Area"
                          label="Open Area"
                          fullWidth
                          name="open_area"
                          onChange={debouncedHandleInput}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <FormLabel id="demo-radio-buttons-group-label">
                        Bank Offer
                      </FormLabel>
                      <br />
                      {bankOffers.post.map(({ bankName, logo }) => {
                        return (
                          <>
                            <Checkbox
                              {...label}
                              className="checkboxAddProject"
                              name="amenities"
                              onChange={handleCheckboxChange}
                              value={bankName}
                            />
                            {bankName}{" "}
                            <img
                              height={30}
                              width={30}
                              src={logo.data}
                              alt="amenity"
                            />
                          </>
                        );
                      })}
                    </Grid>

                    <Grid item xs={8}>
                      <FormLabel id="demo-radio-buttons-group-label">
                        Project Images
                      </FormLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Project Logo
                        <input
                          type="file"
                          name="logoImage"
                          onChange={(e) => {
                            setImage(e.target.files[0]);
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={8}>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Project Image
                        <input
                          multiple="multiple"
                          type="file"
                          name="projectImage"
                          onChange={(e) => {
                            setImage1((prevImages) => [
                              ...prevImages,
                              ...e.target.files,
                            ]);
                            // setImage1(e.target.files);
                            // setImage1((prevImages) => {

                            //   const newImages = [...e.target.files];

                            //   return [...prevImages, ...newImages];

                            // });
                            console.log(image1);
                          }}
                        />
                      </Button>{" "}
                      ( You can selsect upto 5 Project Images)
                    </Grid>
                    <Grid item xs={8}>
                      <FormLabel id="demo-radio-buttons-group-label">
                        Youtube URL Link
                      </FormLabel>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        placeholder=" Set Project Youtube URL"
                        label="Project Youtube URL"
                        fullWidth
                        type="text"
                        name="youtube_URL"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <InputLabel id="demo-simple-select-label">
                        Choose Developer
                      </InputLabel>

                      <select
                        style={{
                          height: "6vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        onChange={handleDropdownChange}
                        name="developerName"
                        value={data.developerName}
                      >
                        <option value=""></option>
                        <option value="IREO Developer">IREO Developer</option>
                        <option value="M3M Developer">M3M Developer</option>
                        <option value="Ansal Developer">Ansal Developer</option>
                        <option value="Godrej Developer">
                          Godrej Developer
                        </option>
                        <option value="Mapsko Group">Mapsko Group</option>

                        <option value="Corona Developer">
                          Corona Developer
                        </option>
                        <option value="Era Group">Era Group</option>

                        <option value="Cosmos Infra">Cosmos Infra</option>
                        <option value="Soldier Housing">Soldier Housing</option>

                        <option value="Assotech">Assotech</option>
                        <option value="Universal Group">Universal Group</option>

                        <option value="ABW Infrastructure Limited">
                          ABW Infrastructure Limited
                        </option>
                        <option value="Orchid Infrastructure Developers">
                          Orchid Infrastructure Developers
                        </option>

                        <option value="Ramprashta Group">
                          Ramprashta Group
                        </option>
                        <option value="Unitech Group">Unitech Group</option>
                        <option value="Pareena Associated">
                          Pareena Associated
                        </option>
                        <option value="Smart City Developers Pvt. Ltd">
                          Smart City Developers Pvt. Ltd.
                        </option>
                        <option value="Vatika Developers">
                          Vatika Developers
                        </option>
                        <option value="Jagrit Infrastructure Pvt. Ltd">
                          Jagrit Infrastructure Pvt. Ltd.
                        </option>
                        <option value="MVL Limited">MVL Limited</option>
                        <option value="Chishlm Furnished Apartments">
                          Chishlm Furnished Apartments
                        </option>
                        <option value="Paras Buildtech Pvt. Ltd.">
                          Paras Buildtech Pvt. Ltd.
                        </option>
                        <option value="Orris Infrastructure Pvt. Ltd">
                          Orris Infrastructure Pvt. Ltd.
                        </option>
                        <option value="ABW Infrastructure Limited">
                          ABW Infrastructure Limited
                        </option>
                        <option value="Bharti Realty Limited">
                          Bharti Realty Limited
                        </option>
                      </select>
                    </Grid>{" "}
                    {/* <InputLabel id="demo-simple-select-label">
                        Project Address
                      </InputLabel> */}
                    <Grid item xs={8}>
                      <FormLabel id="demo-radio-buttons-group-label">
                        Property Address
                      </FormLabel>
                    </Grid>
                    <Grid container spacing={2} rowSpacing={2} item xs={12}>
                      <Grid item xs={4}>
                        City
                        <select
                          style={{
                            height: "6vh",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            width: "100%",
                          }}
                          onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setLocations(getLocationsByCity(e.target.value));
                          }}
                          name="city"
                        // value={data.city}
                        >
                          {Array.from(
                            new Set(Localities.post.map(({ city }) => city))
                          ).map((city) => (
                            <option value={city}>{city}</option>
                          ))}
                        </select>
                      </Grid>

                      <Grid item xs={4}>
                        Location{" "}
                        <select
                          style={{
                            height: "6vh",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            width: "100%",
                          }}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          name="location"
                        // value={data.location}
                        >
                          {Array.from(
                            new Set(locations.map(({ location }) => location))
                          ).map((location) => (
                            <option value={location}>{location}</option>
                          ))}
                        </select>
                      </Grid>

                      <Grid item xs={4}>
                        Sub - Location{" "}
                        <select
                          style={{
                            height: "6vh",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            width: "100%",
                          }}
                          onChange={(e) =>
                            setSelectedSubLocation(e.target.value)
                          }
                          name="sub_location"
                        // value={data.sub_location}
                        >
                          {Array.isArray(subLocations) &&
                            subLocations.map((subLocation) => (
                              <option value={subLocation.sub_location}>
                                {subLocation.sub_location}
                              </option>
                            ))}
                        </select>{" "}
                      </Grid>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        placeholder="Lane Address"
                        label="Lane Address"
                        fullWidth
                        name="project_lane_address"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                  </Grid>
                  <br /> <br />
                  <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      style={{ padding: "0.6rem 1.5rem" }}
                      onClick={() => setTabIndex(tabIndex + 1)}
                    >
                      Next
                    </Button>
                  </Grid>
                </div>
              </Container>
            </TabPanel>
            <TabPanel>
              <div>
                <Container
                  component="main"
                  maxWidth="lg"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ marginTop: "2%", marginBottom: "1%" }}
                  >
                    <h3>
                      Tab Content (Explain All Specifications Of Project )
                    </h3>
                  </InputLabel>
                  <CKEditor
                    config={{
                      height: 600,
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "blockQuote",
                        "link",
                        "numberedList",
                        "bulletedList",
                        "imageUpload",
                        "insertTable",
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "mediaEmbed",
                        "|",
                        "undo",
                        "redo",
                      ],
                    }}
                    style={{
                      maxWidth: "100%",
                      height: "800px",
                      marginBottom: "1rem",
                    }}
                    editor={ClassicEditor}
                    onReady={(editor) => { }}
                    onBlur={(event, editor) => { }}
                    onFocus={(event, editor) => { }}
                    onChange={debouncedOnChange6}
                  />
                  <br />
                  <br />
                  <Grid item xs={5}>
                    <InputLabel id="demo-simple-select-label">
                      Tab Status
                    </InputLabel>

                    <select
                      style={{
                        height: "5vh",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        width: "10%",
                      }}
                      name="specificationStatus"
                      onChange={debouncedHandleInput}
                      value={data.specificationStatus}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Grid>
                  <br /> <br />
                  <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      style={{ padding: "0.6rem 1.5rem" }}
                      onClick={() => setTabIndex(tabIndex + 1)}
                    >
                      Next
                    </Button>
                  </Grid>
                </Container>
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <Container
                  component="main"
                  maxWidth="lg"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  {" "}
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ marginTop: "2%", marginBottom: "1%" }}
                  >
                    <h3>Tab Content</h3>
                  </InputLabel>
                  <CKEditor
                    config={{
                      height: 600,
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "blockQuote",
                        "link",
                        "numberedList",
                        "bulletedList",
                        "imageUpload",
                        "insertTable",
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "mediaEmbed",
                        "|",
                        "undo",
                        "redo",
                      ],
                    }}
                    style={{
                      maxWidth: "100%",
                      height: "800px",
                      marginBottom: "1rem",
                    }}
                    editor={ClassicEditor}
                    onReady={(editor) => {
                      editor.editing.view.document.on("change:data", () => { });
                    }}
                    onBlur={(event, editor) => { }}
                    onFocus={(event, editor) => { }}
                    onChange={debouncedOnChange}
                  />
                  <br />
                  <Grid item xs={8}>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Location Map Image
                      <input
                        type="file"
                        name="locationMapImage"
                        onChange={(e) => {
                          setImage8(e.target.files[0]);
                        }}
                      />
                    </Button>
                  </Grid>
                  <br />
                  <br />
                  <Grid item xs={5}>
                    <InputLabel id="demo-simple-select-label">
                      Tab Status
                    </InputLabel>

                    <select
                      style={{
                        height: "5vh",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        width: "10%",
                      }}
                      name="locationMapStatus"
                      onChange={debouncedHandleInput}
                      value={data.locationMapStatus}
                    >
                      <option value="Home Loan">Active</option>
                      <option value="Property Legal Service">Inactive</option>
                    </select>
                  </Grid>
                  <br /> <br />
                  <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      style={{ padding: "0.6rem 1.5rem" }}
                      onClick={() => setTabIndex(tabIndex + 1)}
                    >
                      Next
                    </Button>
                  </Grid>
                </Container>
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <Container
                  component="main"
                  maxWidth="lg"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ marginTop: "2%", marginBottom: "1%" }}
                  >
                    <h3>Tab Content</h3>
                  </InputLabel>
                  <CKEditor
                    config={{
                      height: 600,
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "blockQuote",
                        "link",
                        "numberedList",
                        "bulletedList",
                        "imageUpload",
                        "insertTable",
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "mediaEmbed",
                        "|",
                        "undo",
                        "redo",
                      ],
                    }}
                    style={{ maxWidth: "100%", height: "800px" }}
                    editor={ClassicEditor}
                    onReady={(editor) => {
                      editor.editing.view.document.on("change:data", () => { });
                      const data = editor.getData();
                    }}
                    onBlur={(event, editor) => { }}
                    onFocus={(event, editor) => { }}
                    onChange={debouncedOnChange1}
                  />
                  <br />
                  <br />
                  <Grid item xs={5}>
                    <InputLabel id="demo-simple-select-label">
                      Tab Status
                    </InputLabel>

                    <select
                      style={{
                        height: "5vh",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        width: "10%",
                      }}
                      name="masterPlanStatus"
                      onChange={debouncedHandleInput}
                      value={data.masterPlanStatus}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Grid>
                  <br /> <br />
                  <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      style={{ padding: "0.6rem 1.5rem" }}
                      onClick={() => setTabIndex(tabIndex + 1)}
                    >
                      Next
                    </Button>
                  </Grid>
                </Container>
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <Container
                  component="main"
                  maxWidth="lg"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  <br />
                  <Grid item xs={8}>
                    <TextField
                      placeholder="Total Amount"
                      label="Total Amount"
                      fullWidth
                      name="totalAmount"
                      onChange={debouncedHandleInput}
                    />
                  </Grid>
                  <br />
                  <Grid item xs={8}>
                    <TextField
                      placeholder="Area (Sq.Ft.)"
                      label="Area (Sq.Ft.)"
                      fullWidth
                      name="area"
                      onChange={debouncedHandleInput}
                    />
                  </Grid>
                  <br />
                  <Grid item xs={8}>
                    <TextField
                      placeholder="Price"
                      label="Price"
                      fullWidth
                      name="price"
                      onChange={debouncedHandleInput}
                    />
                  </Grid>
                  <br />
                  <Grid item xs={8}>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Floor Plan Image
                      <input
                        multiple="multiple"
                        type="file"
                        name="floorPlanImage"
                        onChange={(e) => {
                          setImage2((prevImages) => [
                            ...prevImages,
                            ...e.target.files,
                          ]);
                        }}
                      />
                    </Button>
                  </Grid>
                  <br />
                  <Grid item xs={5}>
                    <InputLabel id="demo-simple-select-label">
                      Tab Status
                    </InputLabel>

                    <select
                      style={{
                        height: "5vh",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        width: "10%",
                      }}
                      name="floorPlanStatus"
                      onChange={debouncedHandleInput}
                      value={data.floorPlanStatus}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Grid>
                  <br />
                  <br /> <br />
                  <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      style={{ padding: "0.6rem 1.5rem" }}
                      onClick={() => setTabIndex(tabIndex + 1)}
                    >
                      Next
                    </Button>
                  </Grid>
                </Container>
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <Container
                  component="main"
                  maxWidth="lg"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ marginTop: "2%", marginBottom: "1%" }}
                  >
                    <h3>Tab Content</h3>
                  </InputLabel>
                  <CKEditor
                    config={{
                      height: 600,
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "blockQuote",
                        "link",
                        "numberedList",
                        "bulletedList",
                        "imageUpload",
                        "insertTable",
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "mediaEmbed",
                        "|",
                        "undo",
                        "redo",
                      ],
                    }}
                    style={{
                      maxWidth: "100%",
                      height: "800px",
                      marginBottom: "1rem",
                    }}
                    editor={ClassicEditor}
                    onReady={(editor) => {
                      editor.editing.view.document.on("change:data", () => {
                        // debouncedHandleInput({
                        //   target: {
                        //     name: "project_specification",
                        //     value: editor.getData(),
                        //   },
                        // });
                      });
                    }}
                    onBlur={(event, editor) => { }}
                    onFocus={(event, editor) => { }}
                    onChange={debouncedOnChange2}
                  />
                  <br />
                  <br />
                  <Grid item xs={8}>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Price Plan Image
                      <input
                        type="file"
                        name="pricePlanImage"
                        onChange={(e) => {
                          setImage3(e.target.files[0]);
                        }}
                      />
                    </Button>
                  </Grid>
                  <br />
                  <Grid item xs={5}>
                    <InputLabel id="demo-simple-select-label">
                      Tab Status
                    </InputLabel>

                    <select
                      style={{
                        height: "5vh",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        width: "10%",
                      }}
                      name="pricePlanStatus"
                      value={data.pricePlanStatus}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Grid>
                  <br /> <br />
                  <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      style={{ padding: "0.6rem 1.5rem" }}
                      onClick={() => setTabIndex(tabIndex + 1)}
                    >
                      Next
                    </Button>
                  </Grid>
                </Container>
              </div>
            </TabPanel>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AddNewproject;
