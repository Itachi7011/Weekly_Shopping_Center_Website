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

  const [category, setCategory] = useState([]);


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

        setCategory(data);
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
                  <Grid container spacing={2} rowSpacing={2}>
                    {/* email address */}

                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Product Name"
                        label="Product Name"
                        fullWidth
                        name="posession_date"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>


                    <Grid item xs={10}>

                      <TextField
                        placeholder="Please Enter Market Name"
                        label="Market Name"
                        fullWidth
                        name="metaKeyword"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                    <br />
                    <Grid item xs={8}>
                      Product Type{" "}
                      <select
                        style={{
                          height: "6vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        name="projectFor"
                        onChange={handleDropdownChange}
                        value={data.projectFor}
                      >
                        <option value="">- - - - Please Choose - - - </option>
                        <option value="New">New</option>
                        <option value="Refurbished">Refurbished</option>
                      </select>
                    </Grid>

                    <Grid item xs={8}>
                      Product Category{" "}
                      <select
                        style={{
                          height: "6vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        name="projectFor"
                        onChange={handleDropdownChange}
                        value={data.projectFor}
                      >
                        <option value="">- - - - Please Choose - - - </option>

                        {
                          category.map((item) => {
                            return (<>
                              <option value={item.categoryName}> {item.categoryName} </option>
                            </>)
                          })
                        }

                      </select>
                    </Grid>
                    <Grid item xs={8}>
                      Product Sub - Category{" "}
                      <select
                        style={{
                          height: "6vh",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                        name="projectFor"
                        onChange={handleDropdownChange}
                        value={data.projectFor}
                      >
                        <option value="">- - - - Please Choose - - - </option>

                        {
                          category.map((item) => {
                            return (<>
                              <option value={item.categoryName}> {item.categoryName} </option>
                            </>)
                          })
                        }

                      </select>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Brand Name"
                        label="Brand Name"
                        fullWidth
                        name="metaKeyword"
                        onChange={debouncedHandleInput}
                      /> </Grid>
                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Model Name"
                        label="Model Name"
                        fullWidth
                        name="metaKeyword"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>






                  </Grid>
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
                  rowspacing={2}
                  maxWidth="xl"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  <Grid container spacing={2} rowSpacing={2}>

                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Product Dimensions"
                        label="Product Dimensions"
                        fullWidth
                        name="metaKeyword"
                        onChange={debouncedHandleInput}
                      /> </Grid>
                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Product Weight"
                        label="Product Weight"
                        fullWidth
                        name="metaKeyword"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Product Color"
                        label="Product Color"
                        fullWidth
                        name="metaKeyword"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>


                  </Grid>
                  {" "}
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ marginTop: "2%", marginBottom: "1%" }}
                  >
                    <h3>Detailed Specifications</h3>
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

                  <br />
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
                  rowspacing={2}
                  maxWidth="xl"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  <Grid container spacing={2} rowSpacing={2}>
                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Product Price (Without Discount)"
                        label="Product Price (Without Discount)"
                        fullWidth
                        name="posession_date"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>

                    <Grid item xs={10}>
                      <TextField
                        placeholder="Please Enter Discount (Only In Numbers, without %)"
                        label="Discount (Only In Numbers, without %)"
                        fullWidth
                        name="posession_date"
                        onChange={debouncedHandleInput}
                      />
                    </Grid>
                  </Grid>
                  <br />
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
                  rowspacing={2}
                  maxWidth="xl"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >
                  <br />
                  <Grid item xs={8}>
                    <TextField
                      placeholder="Please Enter Total Stock Available"
                      label="Total Stock Available"
                      fullWidth
                      name="totalAmount"
                      onChange={debouncedHandleInput}
                    />
                  </Grid>
                  <br />

                  <br />

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
                  rowspacing={2}
                  maxWidth="xl"
                  style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                    display: "block",
                  }}
                >

                  <br />
                  <Grid item xs={8}>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Product Images
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
                    ( You can select upto 5 Product Images)
                  </Grid>
                  <br />
                  <Grid item xs={10}>
                    <TextField
                      placeholder="Please Enter Product Youtube Video URL"
                      label="Youtube Video URL"
                      fullWidth
                      name="metaKeyword"
                      onChange={debouncedHandleInput}
                    /> </Grid>
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
