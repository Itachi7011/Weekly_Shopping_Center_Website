import { useState } from "react";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Helmet } from "react-helmet";

import {
  Container,
  Grid,
  TextField,
  Button,
  InputLabel,
  TextareaAutosize,
  List,
  ListItem,
  ListItemText,

} from "@mui/material";

const AddAdvertisement = () => {
  const navigate = useNavigate();

  const tagsTextAreaRef = useRef(null);
  const subCategoriesTextAreaRef = useRef(null);


  const [content, setContent] = useState("");
  const [Data, setData] = useState("");
  const [image, setImage] = useState("");

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagsSuggestions, setShowTagsSuggestions] = useState(false);

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [showSubCategoriesSuggestions, setShowSubCategoriesSuggestions] = useState(false);



  let name, value;
  const [user, setUser] = useState({
    sponserName: "",
    phoneNo: "",
    email: "",
    position: "",
    categories: "",
    subCategories: "",
    tags: "",
    prepaymentCharges: "",
    foreclosureCharges: "",
    dateOfFormSubmission: "",
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
      .get("/api/tagsList")
      .then((response) => {
        const data = response.data;

        setTags(data);
      })
      .catch((err) => {
        console.log("Error during Data:", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/categoriesList")
      .then((response) => {
        const data = response.data;

        setSubCategories(data);
      })
      .catch((err) => {
        console.log("Error during Data:", err);
      });
  }, []);

  const inputHandler = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });

    // If the textarea is for tags, update showTagsSuggestions based on its value

    if (name === "tags") {

      // Show suggestions only if there's text

      setShowTagsSuggestions(value.trim().length > 0);

    }

  };

  if (name === "subCategories") {

    // Show suggestions only if there's text

    setShowSubCategoriesSuggestions(value.trim().length > 0);

  }

};

  const handleTagClick = (tag) => {


    setSelectedTags((prevTags) => [...prevTags, tag.tagName]);

    tagsTextAreaRef.current.focus(); // Focus on the textarea immediately after clicking the tag

    setShowTagsSuggestions(false); // Hide suggestions

  };

  const handleRemoveTag = (tagToRemove) => {

    setSelectedTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));

  };

  const handleSubCategoryClick = (subCategory) => {


    setSelectedSubCategoriesTags((prevTags) => [...prevTags, subCategory.tagName]);

    subCategoriesTextAreaRef.current.focus(); // Focus on the textarea immediately after clicking the tag

    setShowSubCategoriesSuggestions(false); // Hide suggestions

  };

  const handleRemoveSubCategory = (subCategoryToRemove) => {

    setSelectedSubCategories((prevTags) => prevTags.filter(tag => tag !== subCategoryToRemove));

  };
  

  const handleFocus = () => {

    setShowTagsSuggestions(true); // Show suggestions when focused

  };


  const handleBlur = () => {

    setTimeout(() => setShowTagsSuggestions(false), 100); // Delay to allow click event on suggestions

  };

  const currentTagsValue = user.tags || "";

  const filteredTags = tags.filter(tag =>

    tag.tagName.toLowerCase().includes(currentTagsValue.toLowerCase()) &&

    !selectedTags.includes(tag.tagName)

  );

  const currentSubCategoriessValue = user.subCategories || "";

  const filteredSubCategoriess = subCategories.filter(subCategories =>

    subCategories.subCategoryName.toLowerCase().includes(currentTagsValue.toLowerCase()) &&

    !selectedSubCategories.includes(subCategories.subCategoryName)

  );

  const handleSubmit = async (e) => {

    e.preventDefault();



    var bodyFormData = new FormData();

    bodyFormData.append("sponserName", user.sponserName);
    bodyFormData.append("phoneNo", user.phoneNo);
    bodyFormData.append("email", user.email);

    bodyFormData.append("position", user.position);

    bodyFormData.append("categories", user.categories);

    bodyFormData.append("subCategories", user.subCategories);

    bodyFormData.append("tags", user.tags);
    bodyFormData.append("content", content);

    bodyFormData.append("images", image);




    try {

      const response = await axios.post(

        "/api/AddAdvertisement",

        bodyFormData,


        {

          headers: {

            "Content-Type": "multipart/form-data",

          },

        }

      );
      alert("New Bank Offer added Successfully");


      window.location.reload();

    } catch (error) {

      //handle error

      console.log(error);

    }

  };

  if (Data.userType !== "Admin") {
    return <div></div>;
  }

  return (
    <>
      <div className="container" style={{ backgroundColor: "#808080", marginTop: "7rem" }}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Add Advertisement</title>
          {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
        <div className="row justify-content-center">
          <div
            className="col-lg-12"
            style={{
              paddingTop: "1rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              paddingBottom: "3rem",
              borderRadius: "5px",
            }}
          >
            <h3 className="text-center" style={{ marginBottom: "0.5rem", color: "white", fontSize: "1.5rem" }}>
              Add New Advertisement
            </h3>
            <div
              className="innerDiv container"
              style={{
                backgroundColor: "white",
                padding: "4rem 5rem 2rem 1rem",
                borderRadius: "5px",
              }}
            >

              <div className="row">
                <div className="col-12 col-lg-3 mt-2 ">
                  <h6 style={{ marginBottom: "2.7rem", fontSize: "1rem" }}>
                    Sponser Name :
                  </h6>
                  <h6 style={{ marginBottom: "2.5rem", fontSize: "1rem" }}>
                    Phone Number :
                  </h6>
                  <h6 style={{ marginBottom: "3rem", fontSize: "1rem" }}>
                    Email :
                  </h6>
                  <h6 style={{ marginBottom: "2.3rem", fontSize: "1rem" }}>
                    Position :
                  </h6>
                  <h6 style={{ marginBottom: "1.6rem", fontSize: "1rem" }}>
                    Sub-Categories:
                  </h6>
                  <h6 style={{ marginBottom: "2.8rem", fontSize: "1rem" }}>
                    Sub :
                  </h6>
                  <h6 style={{ marginBottom: "2.8rem", fontSize: "1rem" }}>
                    Tags :
                  </h6>
                  <h6 style={{ marginBottom: "2rem", fontSize: "1rem" }}>
                    Foreclosure Charges :
                  </h6>
                  <h6 style={{ marginBottom: "4.8rem", fontSize: "1rem" }}>
                    Image :
                  </h6>
                  <h6 style={{ marginBottom: "2.8rem", fontSize: "1rem" }}>
                    Other Information :
                  </h6>

                </div>
                <div className="col-lg-8">

                  <input
                    type="text"
                    name="sponserName"
                    style={{ fontWeight: "400" }}
                    onChange={inputHandler}
                    placeholder="Please Enter Sponser Name"
                    className="form-control mb-4"
                  />
                  <input
                    type="text"
                    name="phoneNo"
                    style={{ fontWeight: "400" }}
                    onChange={inputHandler}
                    placeholder="Please Enter Sponser's Phone No."
                    className="form-control mb-4"
                  />
                  <input
                    type="text"
                    name="email"
                    style={{ fontWeight: "400" }}
                    onChange={inputHandler}
                    placeholder="Please Enter Sponser's Email"
                    className="form-control mb-4"
                  />


                  <div className="checkbox-group">

                    <label className="checkbox-option">

                      <input type="checkbox" name="position" value="top" onChange={inputHandler} />

                      <span className="checkbox-label">Top</span>

                    </label>

                    <label className="checkbox-option">

                      <input type="checkbox" name="position" value="middle" onChange={inputHandler} />

                      <span className="checkbox-label">Middle</span>

                    </label>

                    <label className="checkbox-option">

                      <input type="checkbox" name="position" value="bottom" onChange={inputHandler} />

                      <span className="checkbox-label">Bottom</span>

                    </label>

                  </div>

                  <input
                    type="text"
                    name="rateOfInterest"
                    style={{ fontWeight: "400" }}
                    onChange={inputHandler}
                    placeholder=""
                    className="form-control mb-4"
                  />
                  <input
                    type="text"
                    name="loanAmount"
                    style={{ fontWeight: "400" }}
                    onChange={inputHandler}
                    placeholder=""
                    className="form-control mb-4"
                  />
                  <input
                    type="text"
                    name="prepaymentCharges"
                    style={{ fontWeight: "400" }}
                    onChange={inputHandler}
                    placeholder=""
                    className="form-control mb-4"
                  />
                  <input
                    type="text"
                    name="foreclosureCharges"
                    style={{ fontWeight: "400" }}
                    onChange={inputHandler}
                    placeholder=""
                    className="form-control mb-4"
                  />

                  <textarea
                    aria-label="minimum height"
                    rows={8}
                    style={{ width: "50%", marginRight:"40%" }}
                    onChange={inputHandler}
                    placeholder="Please Type Here To Search Tags"
                    // onFocus={handleFocus}
                    // onBlur={handleBlur}
                    name="tags"
                  />
                  {showTagsSuggestions && filteredTags.length > 0 && (

                    <li style={{ cursor: "pointer", position: "absolute", zIndex: 200, marginTop: "-11rem", marginLeft: "12rem" }}>

                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>

                        {filteredTags.map((tag) => (

                          <li key={tag._id} onMouseDown={() => handleTagClick(tag)} style={{ cursor: "pointer", color: "white", background: "blue", borderRadius: "5px", padding: "0.2rem", margin: "0.2rem 0" }}>

                            {tag.tagName}

                          </li>

                        ))}

                      </ul>

                    </li>

                  )}

                  <div style={{ marginLeft: "55%",marginTop:"-12rem", marginBottom:"15rem" , zIndex:"99999"}} >

                    <h4 style={{fontSize:"1rem", color: "white", background: "#4E4B51", padding:"0.5rem"}}>Selected Tags:</h4>

                    <ul>

                      {selectedTags.length === 0 ? "No Tags Selected Yet ! " : selectedTags.map((tag, index) => (

                        <li key={index} style={{ color: "white", background: "blue", borderRadius: "5px", padding: "0.2rem", marginTop: "0.5rem" }}>{tag}
                          <span

                            onClick={() => handleRemoveTag(tag)}

                            style={{

                              color: "white",
                              marginLeft: "0.4rem",
                              paddingRight: "0.3rem",
                              paddingLeft: "0.3rem",

                              cursor: "pointer",
                              float: "right",

                              fontWeight: "bold",

                              fontSize: "1rem",
                              background: "red"

                            }}

                          >

                            &times; {/* This is the close (X) character */}

                          </span>

                        </li>

                      ))}

                    </ul>

                  </div>










                  <textarea
                    aria-label="minimum height"
                    rows={8}
                    style={{ width: "50%", marginRight:"40%" }}
                    onChange={inputHandler}
                    placeholder="Please Type Here To Search Tags"
                    // onFocus={handleFocus}
                    // onBlur={handleBlur}
                    name="subCategories"
                  />
                  {showSubCategoriesSuggestions && filteredSubCategoriess.length > 0 && (

                    <li style={{ cursor: "pointer", position: "absolute", zIndex: 200, marginTop: "-11rem", marginLeft: "12rem" }}>

                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>

                        {filteredSubCategoriess.map((subCategory) => (

                          <li key={subCategory._id} onMouseDown={() => handleSubCategoryClick(subCategory)} style={{ cursor: "pointer", color: "white", background: "blue", borderRadius: "5px", padding: "0.2rem", margin: "0.2rem 0" }}>

                            {subCategory.tagName}

                          </li>

                        ))}

                      </ul>

                    </li>

                  )}

                  <div style={{ marginLeft: "55%",marginTop:"-12rem", marginBottom:"15rem" , zIndex:"99999"}} >

                    <h4 style={{fontSize:"1rem", color: "white", background: "#4E4B51", padding:"0.5rem"}}>Selected Sub-Categories:</h4>

                    <ul>

                      {selectedTags.length === 0 ? "No Tags Selected Yet ! " : selectedTags.map((tag, index) => (

                        <li key={index} style={{ color: "white", background: "blue", borderRadius: "5px", padding: "0.2rem", marginTop: "0.5rem" }}>{subCategory}
                          <span

                            onClick={() => handleRemoveSubCategory(subCategory)}

                            style={{

                              color: "white",
                              marginLeft: "0.4rem",
                              paddingRight: "0.3rem",
                              paddingLeft: "0.3rem",

                              cursor: "pointer",
                              float: "right",

                              fontWeight: "bold",

                              fontSize: "1rem",
                              background: "red"

                            }}

                          >

                            &times; {/* This is the close (X) character */}

                          </span>

                        </li>

                      ))}

                    </ul>

                  </div>




























                  

                  <input
                    type="file"
                    name="logo"
                    style={{ fontWeight: "400" }}
                    onChange={(e) => {
                      setImage(e.target.files[0]);

                      console.log(image);
                    }}
                    placeholder=""
                    className="form-control mb-4"
                  />

                  <br />

                  <CKEditor
                    config={{
                      height: 800,
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
                      height: "800px !important",
                      maxHeight: "800px !important",
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
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      console.log(data);
                      setContent(data);
                    }}
                    name="content"
                  />


                  <br />
                  <br />
                  <button className="btn btn-primary me-4" onClick={handleSubmit}>
                    {" "}
                    Submit
                  </button>
                  <button className="btn btn-primary" type="reset">
                    {" "}
                    Reset
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdvertisement;
