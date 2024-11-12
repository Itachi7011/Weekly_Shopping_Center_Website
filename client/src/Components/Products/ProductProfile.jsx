import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import debounce from "lodash/debounce";

import axios from "axios";

const ProductProfile = () => {

    const location = useLocation();
    const previousData = location.state._id;
    const previousId = location.state.id;

    const bankOffersRef = useRef(null);
    const specificationRef = useRef(null);
    const technicalDetailsRef = useRef(null);
    const otherDetailsRef = useRef(null);
    const warrantyDetailsRef = useRef(null);

    const navigate = useNavigate();


    // const ansRef = useRef(null);
    // const previousData = location.state.id;

    const [Data, setData] = useState({ post: [] });




    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const [selectedStars, setSelectedStars] = useState({});
    const [clickedIcons, setClickedIcons] = useState({});

    const [title, setTitle] = useState("");
    const [answer, setAnswer] = useState("");

    const [likedComments, setLikedComments] = useState({});
    const [dislikedComments, setDislikedComments] = useState({});

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const [visibleOffers, setVisibleOffers] = useState(2);

    const [user1, setUser1] = useState("");

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [bankOffers, setBankOffers] = useState({ post: [] });


    const Profile = async () => {
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

            setUser1(data);

            if (!res === 200) {
                throw new Error(`Error during retreive data - ${Error}`);
            }
        } catch (err) {
            console.log(`Error during catch of CustomerSavingAccountsProfile -  ${err}`);
        }
    };

    useEffect(() => {
        Profile();
    }, []);


    useEffect(() => {
        axios
            .get("/api/productsList")
            .then((response) => {
                const data = response.data;

                setData({ post: data });

                console.log("data fetch successfully");
            })
            .catch((err) => {
                console.log("Error during Data:", err);
            });
    }, []);

    const printImage = (content) => {
        const printWindow = window.open("", "", "width=800,height=600");

        const imgTag = `<img src="${content}" />`; // assume content is the image URL

        printWindow.document.write(imgTag);

        printWindow.document.close();

        printWindow.print();
    };

    const debouncedOnChange1 = debounce((event, editor) => {
        const data = editor.getData();

        setAnswer(data);
    }, 1);

    useEffect(() => {
        axios
            .get("/api/bankOfferList")
            .then((response) => {
                const data = response.data;

                setBankOffers({ post: data });

                setSearchResults(data);
            })
            .catch((err) => {
                console.log("Error during Data:", err);
            });
    }, []);

    const useScrollIntoView = (ref, options = {}) => {
        const {
            behavior = "smooth",
            block = "center",
            inline = "nearest",
        } = options;

        const handleClick = () => {
            ref.current.scrollIntoView({ behavior, block, inline });
        };

        useEffect(() => {
            if (ref.current) {
                ref.current.scrollIntoView({ behavior, block, inline });
            }
        }, [ref]);

        return handleClick;
    };

    const handleImageClick = (index) => {

        setCurrentImageIndex(index); // Update the current image index

    };

    const openModal = (product) => {

        if (user1) {

            // User is logged in, open the rating modal

            setIsModalOpen(true);
            setCurrentProduct(product);

            setTimeout(() => {

                const modalElement = document.querySelector('.modal');

                if (modalElement) {

                    modalElement.style.display = 'block';

                    modalElement.offsetHeight; // Trigger reflow

                }

            }, 0);


        } else {

            // User is not logged in, show a message or redirect

            const userConfirmed = window.confirm("You must be logged in to add a rating. Would you like to go to the login page?");

            if (userConfirmed) {

                // User clicked "OK", redirect to login page

                navigate("/Login");

            }

        }


    };


    const closeModal = () => {

        setIsModalOpen(false);

        setSelectedStars({});

    };

    const saveRating = () => {

        if (currentProduct) {

            const { _id, name } = currentProduct;

            const rating = selectedStars[_id]?.length || 0; // Get the rating from the state

            const comment = answer;

            console.log("Sending data to backend:", {

                id: _id,

                name: name,

                rating: rating,

                comment: comment,

            });

            const bodyFormData = new FormData();

            bodyFormData.append("id", _id);


            bodyFormData.append("userName", user1.name);
            bodyFormData.append("userEmail", user1.email);

            bodyFormData.append("title", title);
            bodyFormData.append("rating", rating);
            bodyFormData.append("comment", answer);


            axios.post("/api/productRating", bodyFormData,

                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                .then(response => {

                    console.log(response);

                    closeModal(); // Close modal after saving

                })

                .catch(err => console.error("Error saving rating:", err));

        }

    };

    const handleIconClick = (e, id, name, rating) => {
        e.preventDefault();

        // Update the selected stars state without sending data to the backend
        const newSelectedStars = Array.from({ length: rating }, (_, i) => i + 1);

        setSelectedStars({
            ...selectedStars,
            [id]: newSelectedStars,
        });
    };

    const handleLikeCommentClick = (commentId) => {

        // Prevent liking if already disliked

        if (dislikedComments[commentId]) {

            setDislikedComments((prev) => ({ ...prev, [commentId]: false }));

        }


        setLikedComments((prev) => ({

            ...prev,

            [commentId]: !prev[commentId], // Toggle like state

        }));

        const bodyFormData = new FormData();

        bodyFormData.append("userName", user1.name);
        bodyFormData.append("userEmail", user1.email);

        axios.post("/api/likedComment", bodyFormData,

            {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            .then(response => {

                console.log(response);

              

            })

            .catch(err => console.error("Error saving liked comment:", err));

    };


    const handleDislikeCommentClick = (commentId) => {

        // Prevent disliking if already liked

        if (likedComments[commentId]) {

            setLikedComments((prev) => ({ ...prev, [commentId]: false }));

        }


        setDislikedComments((prev) => ({

            ...prev,

            [commentId]: !prev[commentId], // Toggle dislike state

        }));

        const bodyFormData = new FormData();

        bodyFormData.append("userName", user1.name);
        bodyFormData.append("userEmail", user1.email);

        axios.post("/api/dislikedComment", bodyFormData,

            {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            .then(response => {

                console.log(response);

             

            })

            .catch(err => console.error("Error saving disliked comment:", err));

    };

    const handleBankOffersClick = useScrollIntoView(bankOffersRef);
    const handleSpecificationClick = useScrollIntoView(specificationRef);
    const handleAadharClick = useScrollIntoView(technicalDetailsRef);
    const handlePancardClick = useScrollIntoView(otherDetailsRef);
    const handlevoteridcardClick = useScrollIntoView(warrantyDetailsRef);


    const handleSearch = (e) => {
        const searchTerm = e.target.value;

        setSearchTerm(searchTerm);

        if (!searchTerm) {
            setSearchResults(bankOffers.post)
        } else {
            const searchResults = bankOffers.post.filter((item) => {
                return (
                    item.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.rateOfInterest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.otherInformation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.loanAmount.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });

            setSearchResults(searchResults);
        }


    };

    const buttonStyle = {

        backgroundColor: '#4CAF50', // Green background

        color: 'white', // White text

        border: 'none', // No border

        borderRadius: '25px', // Rounded corners

        padding: '15px 30px', // Padding

        fontSize: '16px', // Font size

        fontWeight: 'bold', // Bold text

        textTransform: 'uppercase', // Uppercase text

        cursor: 'pointer', // Pointer cursor on hover

        transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease', // Transition effects

        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Shadow effect

        outline: 'none', // Remove outline

    };


    const hoverStyle = {

        backgroundColor: '#45a049', // Darker green on hover

        transform: 'translateY(-3px)', // Lift effect

        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)', // Deeper shadow on hover

    };


    const activeStyle = {

        transform: 'translateY(1px)', // Pressed effect

        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Shadow returns to normal

    };

    const getStarColor = (index, rating) => {

        if (index < rating) {
    
            // If the index is less than the rating, color the star based on the rating
    
            switch (rating) {
    
                case 1:
    
                    return 'darkred'; // 1 star
    
                case 2:
    
                    return '#FF6347'; // Light red for 2 stars
    
                case 3:
    
                    return '#FFD700'; // Yellow for 3 stars
    
                case 4:
    
                    return '#3CB371'; // Light green for 4 stars
    
                case 5:
    
                    return 'green'; // Dark green for 5 stars
    
                default:
    
                    return 'gray'; // Default color for no stars
    
            }
    
        } else {
    
            // If the index is greater than or equal to the rating, return light gray
    
            return 'lightgray';
    
        }
    
    };


    return (
        <>
            {Data.post
                .filter((field) => {
                    if (field._id.includes(previousData)) {
                        return field;
                    }
                })
                .map(
                    ({
                        _id,
                        name,
                        category,
                        subCategory,
                        marketName,
                        newOrRefurbished,
                        isPopular,
                        reviews,
                        isNewProduct,
                        isPremium,
                        isLimitedTimeDeal,
                        price,
                        effectivePrice,
                        brand,
                        model,
                        color,
                        weight,
                        dimensions,
                        stockNextRefillDate,
                        sellerDiscount,
                        adminDiscount,
                        stock_available,
                        tags,
                        images,
                        youtubeUrl,
                        productDetails,
                        warrantyDetails,
                        technicalDetails,
                        rating,
                        comments,
                        freqAskedQuest,
                        totalSold,
                        totalCart,
                        createdByName,
                        createdByType,
                        dateOfFormSubmission,



                    }) => {
                        return (
                            <>
                                {


                                    isModalOpen && (

                                        <div className={`modal ${isModalOpen ? 'show' : ''}`} tabIndex="1" role="dialog" style={{ display: 'block', zIndex: 1050 }}>

                                            <div className="modal-dialog modal-dialog-centered" role="document">

                                                <div className="modal-content">

                                                    <div className="modal-header">

                                                        <h5 className="modal-title">Enter Rating For {currentProduct?.name}</h5>

                                                        <button type="button" className="close" onClick={closeModal}>

                                                            <span aria-hidden="true">&times;</span>

                                                        </button>

                                                    </div>

                                                    <div className="modal-body">

                                                        <h6>Rating</h6>

                                                        <div className="rating-stars" style={{ paddingLeft: "30%" }}>

                                                            {Array.from({ length: 5 }, (_, i) => (

                                                                <i

                                                                    key={i}

                                                                    className={`fas fa-star rating-icon ${selectedStars[currentProduct?._id]?.includes(i + 1) ? "yellow" : "gray"}`}

                                                                    onClick={(e) => handleIconClick(e, currentProduct._id, currentProduct.name, i + 1)}

                                                                    style={{ marginLeft: "2rem", fontSize: 'larger', paddingTop: "1rem", paddingBottom: "1rem" }}
                                                                />

                                                            ))}

                                                        </div>
                                                        <div
                                                            className="innerDiv container"
                                                            style={{
                                                                backgroundColor: "white",
                                                                // padding: "4rem 5rem 2rem 1rem",
                                                                borderRadius: "5px",
                                                            }}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12 col-lg-2  ">

                                                                    <h6
                                                                        style={{
                                                                            marginBottom: "2.2rem",
                                                                            fontSize: "1rem",
                                                                        }}
                                                                    >
                                                                        Title
                                                                    </h6>

                                                                    <h6
                                                                        style={{
                                                                            marginBottom: "1.3rem",
                                                                            fontSize: "1rem",
                                                                        }}
                                                                    >
                                                                        Comment
                                                                    </h6>
                                                                </div>
                                                                <div className="col-lg-10">
                                                                    <h6 className="ps-1">
                                                                        <input
                                                                            type="text"
                                                                            name="quetion"
                                                                            onChange={(e) => {
                                                                                setTitle(e.target.value);
                                                                            }}
                                                                            style={{
                                                                                height: "4vh",
                                                                                width: "100%",
                                                                            }}
                                                                        />
                                                                    </h6>
                                                                    <h6 className="ps-1">
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
                                                                            onChange={debouncedOnChange1}
                                                                        />
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="modal-footer">

                                                        <button type="button" className="btn btn-danger me-4" onClick={closeModal} style={{ fontSize: "1rem" }}>

                                                            Close

                                                        </button>

                                                        <button type="button" className="btn btn-primary" onClick={saveRating} style={{ fontSize: "1rem" }}>

                                                            Save

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    )}
                                <div style={{ marginTop: "3rem" }}>

                                    {/* All Images Main Div */}

                                    <div className="small-images-section mt-3 ms-5">



                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: "-3rem" }}>

                                            {images.map((image, index) => (

                                                <img

                                                    key={index}

                                                    src={image.data}

                                                    className="img-thumbnail"

                                                    alt={`Thumbnail ${index + 1}`}

                                                    onClick={() => handleImageClick(index)} // Update the carousel when clicked

                                                    style={{ cursor: "pointer", width: "7rem", height: "auto", marginBottom: "0.5rem" }} // Make images clickable and set small width

                                                />

                                            ))}

                                        </div>

                                    </div>


                                    <section className="left-side-section" style={{ marginTop: "-16rem", }}>
                                        <div className="container">
                                            <div className="row">
                                                <div
                                                    className="col-lg-8 col-md-8 col-12"
                                                //  style={{ height: "1000px !important" }}
                                                >
                                                    <div
                                                        //  style={{ height: "1200px !important" }}
                                                        id="carouselExampleIndicators"
                                                        className="carousel slide"
                                                        data-bs-ride="carousel"
                                                    >
                                                        <div
                                                            className="carousel-indicators"
                                                        // style={{ height: "1000px !important" }}
                                                        >
                                                            {images.map((image, index) => (

                                                                <button

                                                                    key={index}

                                                                    type="button"

                                                                    data-bs-target="#carouselExampleIndicators"

                                                                    data-bs-slide-to={index}

                                                                    className={index === 0 ? "active" : ""}

                                                                    aria-label={`Slide ${index + 1}`}

                                                                ></button>

                                                            ))}
                                                        </div>

                                                        <div
                                                            className="carousel-inner"
                                                            style={{ marginTop: "0rem" }}
                                                        >
                                                            {images.map((image, index) => (

                                                                <div

                                                                    key={index}

                                                                    className={`carousel-item ${index === currentImageIndex ? "active" : ""}`}

                                                                >

                                                                    <img

                                                                        src={image.data}

                                                                        className="d-block w-100"

                                                                        alt={`Slide ${index + 1}`}
                                                                        style={{ height: "80vh" }}


                                                                    />

                                                                </div>

                                                            ))}
                                                        </div>
                                                        <button
                                                            className="carousel-control-prev"
                                                            type="button"
                                                            data-bs-target="#carouselExampleIndicators"
                                                            data-bs-slide="prev"
                                                        >
                                                            <span
                                                                className="carousel-control-prev-icon"
                                                                aria-hidden="true"
                                                            ></span>

                                                            <span className="visually-hidden">Previous</span>
                                                        </button>

                                                        <button
                                                            className="carousel-control-next"
                                                            type="button"
                                                            data-bs-target="#carouselExampleIndicators"
                                                            data-bs-slide="next"
                                                        >
                                                            <span
                                                                className="carousel-control-next-icon"
                                                                aria-hidden="true"
                                                            ></span>

                                                            <span className="visually-hidden">Next</span>
                                                        </button>
                                                    </div>


                                                </div>

                                                <div className="col-lg-4 col-md-4 col-12">




                                                    <div className="side-bar-contant">
                                                        <div className="card" style={{ padding: "1rem", marginRight: "-6em", marginTop: "2rem" }}>
                                                            <h1 className="heading-side">
                                                                {name}
                                                                <br />
                                                            </h1>

                                                            <div className="rating-stars" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', padding: "0.5rem" }}>

                                                                <div className="rating-stars" style={{ display: 'flex', alignItems: 'center' }}>

                                                                    {[...Array(5)].map((_, index) => (

                                                                        <i key={index} className="fas fa-star" style={{ fontSize: "x-large", color: "green" }}></i>

                                                                    ))}

                                                                </div>



                                                                <button

                                                                    onClick={() => openModal({ _id, name })}

                                                                    style={{

                                                                        marginLeft: '1rem',

                                                                        padding: '0.5rem 1rem',

                                                                        backgroundColor: '#007bff',

                                                                        color: 'white',

                                                                        border: 'none',

                                                                        borderRadius: '0.25rem',

                                                                        textDecoration: 'none',

                                                                        display: 'inline-block',

                                                                        textAlign: 'center',

                                                                        transition: 'background-color 0.3s',

                                                                    }}

                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}

                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}

                                                                >

                                                                    Add Rating

                                                                </button>

                                                            </div>




                                                            <h6 className="">
                                                                Brand : {brand} (Official <a href="www.google.com">{brand} </a> Website)
                                                                <br />
                                                            </h6>
                                                            <h6 className="">
                                                                Model : {model}
                                                                <br />
                                                            </h6>
                                                            <h6 className="">
                                                                Category : {category} ( {subCategory} )
                                                                <br />
                                                            </h6>

                                                            <h6 className="">
                                                                Market Name : {marketName}
                                                                <br />
                                                            </h6>
                                                            <h6 className="">
                                                                About : {color} - Color , &nbsp;{weight} ,&nbsp;{dimensions}
                                                                <br />
                                                            </h6>
                                                            <h6 className="d-flex align-items-center">

                                                                {isPremium && (

                                                                    <span className="badge bg-warning text-dark me-2">

                                                                        Premium

                                                                    </span>

                                                                )}


                                                                {isPopular && (

                                                                    <span className="badge" style={{ background: "#00A86B", marginRight: '0.5rem' }}>

                                                                        New

                                                                    </span>

                                                                )}


                                                                {isNewProduct && (

                                                                    <span className="badge" style={{ background: "#00A86B", marginRight: '0.5rem' }}>

                                                                        Popular

                                                                    </span>

                                                                )}


                                                                {isLimitedTimeDeal && (

                                                                    <span style={{ display: "inline-flex", alignItems: "center", marginRight: '0.5rem' }}>

                                                                        <i

                                                                            className="fa-solid fa-hourglass-half"

                                                                            style={{ color: "white", background: "#2142AB", padding: "0.2rem 0.4rem", cursor: "pointer" }}

                                                                        ></i>

                                                                        {/* Tooltip */}

                                                                        <span className="tooltip-text">It is a time-limited offer, price will rise soon</span>

                                                                    </span>

                                                                )}

                                                            </h6>
                                                            <h6>
                                                                { }
                                                            </h6>

                                                            <hr />
                                                            <h1 className="price-text">
                                                                <del>₹ {price}</del> <span className="text-danger">(-{sellerDiscount + "%" + (adminDiscount === 0 ? (" & " + adminDiscount + "%") : "")} Off)</span> <br /> <strong className="text-success"> ₹ {effectivePrice}</strong> <span className="text-danger"> (Save ₹ {price - (effectivePrice - (adminDiscount || 0))}) </span>

                                                            </h1>
                                                            <span>
                                                                Stock Available:{" "}
                                                                <strong style={{ marginLeft: "1rem" }}>
                                                                    {" "}
                                                                    {stock_available}{" "}
                                                                </strong>
                                                            </span>

                                                            <div className="project-size d-flex mt-4">
                                                                <div className="box-1"></div>
                                                                <div className="box-2">
                                                                    <span className="ms-2 me-5">

                                                                        Date Of Listing:{" "}
                                                                        <strong style={{ marginLeft: "1rem" }}>    {new Date(new Date(dateOfFormSubmission).getTime() - (5 * 60 + 30) * 60 * 1000).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')}</strong>

                                                                    </span>


                                                                </div>
                                                            </div>
                                                            <div>
                                                                <hr />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="contant-navigation contant-nav">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12 col-12">
                                                    <nav className="navbar navbar-expand-lg">
                                                        <div
                                                            className="collapse navbar-collapse"
                                                            id="navbarSupportedContent"
                                                        >
                                                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                                                                <li
                                                                    className="nav-item"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <a
                                                                        className="nav-link"
                                                                        onClick={handleBankOffersClick}
                                                                    >
                                                                        Bank Offers
                                                                    </a>
                                                                </li>
                                                                <li
                                                                    className="nav-item"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <a
                                                                        className="nav-link"
                                                                        onClick={handleSpecificationClick}
                                                                    >
                                                                        Details
                                                                    </a>
                                                                </li>

                                                                <li
                                                                    className="nav-item"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <a
                                                                        className="nav-link"
                                                                        onClick={handleAadharClick}
                                                                    >
                                                                        Technical Details
                                                                    </a>
                                                                </li>
                                                                <li
                                                                    className="nav-item"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <a
                                                                        onClick={handlevoteridcardClick}
                                                                        className="nav-link"
                                                                    >
                                                                        Warranty Details
                                                                    </a>
                                                                </li>
                                                                <li
                                                                    className="nav-item"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <a
                                                                        onClick={handlePancardClick}
                                                                        className="nav-link"
                                                                    >
                                                                        Other Details
                                                                    </a>
                                                                </li>


                                                            </ul>
                                                        </div>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section
                                        className="specification-section"
                                        ref={bankOffersRef}
                                    >
                                        <div className="container">
                                            <h2>Bank Offers
                                                <input
                                                    placeholder="Search Bank Offers"
                                                    style={{

                                                        width: "20rem",
                                                        height: "3rem",
                                                        borderRadius: "10px",
                                                        marginLeft: "10rem",
                                                        marginRight: "-30rem",
                                                        fontSize: "1.3rem",

                                                    }}
                                                    value={searchTerm}
                                                    onChange={handleSearch}

                                                />
                                            </h2>
                                            {searchResults.slice(0, visibleOffers).map(
                                                ({
                                                    bankName,
                                                    logo,
                                                    rateOfInterest,
                                                    tenure,
                                                    otherInformation,
                                                    processingFees,
                                                    prepaymentCharges,
                                                    loanAmount,
                                                    foreclosureCharges,
                                                }) => {
                                                    return (
                                                        <>
                                                            <div
                                                                className="row justify-content-center"
                                                            //  style={{cursor:"pointer"}}
                                                            >
                                                                <div className="col-lg-2 col-12">
                                                                    <div className="bank-details-check d-flex">
                                                                        {/* <input type="checkbox" className="form-check" /> */}
                                                                        <img
                                                                            height={80}
                                                                            width={100}
                                                                            src={logo.data}
                                                                            className="img-fluid ms-2 mb-3"
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                    <h6> {bankName} </h6>
                                                                </div>

                                                                <div className="col-lg-2 col-12">
                                                                    <h3>Loan Amount</h3>
                                                                    <h6 className="loan-amount">
                                                                        ₹ {loanAmount}
                                                                    </h6>
                                                                </div>

                                                                <div className="col-lg-2 col-12">
                                                                    <h3>Interest Rate</h3>
                                                                    <h6 className="interest-rate">
                                                                        Starts {rateOfInterest}
                                                                    </h6>
                                                                </div>

                                                                <div className="col-lg-2 col-12">
                                                                    <h3>Processing Fees</h3>
                                                                    <h6 className="emi"> {processingFees} </h6>
                                                                </div>

                                                                <div className="col-lg-2 col-12">
                                                                    <h3>Total Tenure</h3>
                                                                    <h6 className=" "> {tenure} </h6>
                                                                </div>
                                                                <div className="col-lg-2 col-12">

                                                                    <button
                                                                        className=""
                                                                        data-label="CONTACT"
                                                                        id="Contact"
                                                                        style={{

                                                                            ...buttonStyle,

                                                                            ...(isHovered ? hoverStyle : {}),

                                                                            ...(isActive ? activeStyle : {}),

                                                                        }}

                                                                        onMouseEnter={() => setIsHovered(true)}

                                                                        onMouseLeave={() => setIsHovered(false)}

                                                                        onMouseDown={() => setIsActive(true)}

                                                                        onMouseUp={() => setIsActive(false)}

                                                                        onFocus={(e) => {

                                                                            e.target.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.5)'; // Green glow on focus

                                                                        }}

                                                                        onBlur={(e) => {

                                                                            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Reset shadow on blur

                                                                        }}
                                                                        onClick={function () {
                                                                            navigate("/home-loan", {
                                                                                state: {
                                                                                    logo: logo,
                                                                                    bankName: bankName,
                                                                                    loanAmount: loanAmount,
                                                                                    rateOfInterest: rateOfInterest,
                                                                                    processingFees: processingFees,
                                                                                    tenure: tenure,
                                                                                    prepaymentCharges: prepaymentCharges,
                                                                                    otherInformation: otherInformation,
                                                                                    foreclosureCharges: foreclosureCharges,
                                                                                },
                                                                            });
                                                                        }}
                                                                    >

                                                                        View Offer
                                                                    </button>
                                                                </div>

                                                            </div>
                                                            <hr />
                                                        </>
                                                    );
                                                }
                                            )}
                                            <button

                                                onClick={() => setVisibleOffers(visibleOffers + 2)} // Increase the number of visible offers by 2

                                                style={{
                                                    marginLeft: "45%",

                                                    padding: "1rem",

                                                    backgroundColor: "transparent",

                                                    border: "none",

                                                    cursor: "pointer",

                                                    color: "#007bff",

                                                }}

                                            >

                                                <i className="fas fa-chevron-down"></i> {/* Downward arrow icon */}

                                                Load 2 More

                                            </button>
                                        </div>
                                    </section>

                                    <section
                                        className="specification-section"
                                        ref={specificationRef}
                                    >
                                        <div className="container">
                                            <h2>Details</h2>
                                            <hr />
                                            <div className="row justify-content-center">
                                                <div className="col-lg-3 col-md-3 col-3 mt-4">
                                                    <h6>Name</h6>
                                                    <h6>Brand</h6>
                                                    <h6>Model</h6>
                                                    <h6>Effective Price</h6>
                                                    <h6>Price Without Discount</h6>
                                                    <h6>Discount</h6>
                                                    <h6>Category</h6>
                                                    <h6>New / Refurb.</h6>
                                                    {isPopular === true ? (<h6>Popular</h6>) : ""}
                                                    <h6> Color </h6>
                                                    <h6> Weight </h6>
                                                    <h6> Dimensions </h6>
                                                    <h6> Stock Available </h6>
                                                    <h6> Stock Next Refill Date </h6>
                                                    <h6>Video URL</h6>

                                                    {Data.userType !== "Admin" ? "" : <>
                                                        <h6>Total Sold</h6>
                                                        <h6>Total Cart</h6>
                                                        <h6>Created By</h6>
                                                    </>}



                                                    <h6>Date Of Listing</h6>

                                                    <h6>Tags</h6>
                                                </div>

                                                <div
                                                    className="col-lg-5 col-md-5 col-9 mt-4"
                                                    id="specifications"
                                                >
                                                    <div className="specification-content">


                                                        <h6 className="" > {name} </h6>
                                                        <h6 className="" > {brand} </h6>
                                                        <h6 className="" > {model} </h6>
                                                        <h6> <span className="text-success"><strong>  ₹ {effectivePrice} </strong></span>  </h6>
                                                        <h6 className="" > <del> ₹ {price}  </del></h6>
                                                        <h6 className="" > <span className="text-danger">-{sellerDiscount + "%" + (adminDiscount === 0 ? (" & " + adminDiscount + "%") : "")} (Save ₹ {price - (effectivePrice - (adminDiscount || 0))}) </span> </h6>

                                                        <h6 className="" > {category} ({subCategory}) </h6>

                                                        <h6 className="" > {isNewProduct === true ? "New" : "Refurbished"} </h6>

                                                        {isPopular === true ? (<h6> Yes </h6>) : ""}
                                                        <h6 className="" > {color} </h6>

                                                        <h6 className="" >  {weight}  </h6>

                                                        <h6 className="" > {dimensions} </h6>
                                                        <h6 className="" > {stock_available} </h6>
                                                        <h6 className="" > {stockNextRefillDate} </h6>

                                                        <h6 className="" > {youtubeUrl} </h6>

                                                        {Data.userType !== "Admin" ? "" : <>
                                                            <h6 className="" > {((totalSold === 0) || (!totalSold)) ? <span className="text-danger">Sorry! No Sold Yet</span> : <span className="text-success" > {totalSold} People Bought This Product </span>} </h6>
                                                            <h6 className="" > {((totalCart === 0) || (!totalCart)) ? <span className="text-danger">Sorry! No Cart Yet</span> : <span className="text-success" > {totalCart} People Add This Product To Cart </span>}  </h6>

                                                            <h6 className="" > {createdByName
                                                            } ({createdByType}) </h6>

                                                        </>}





                                                        <h6 className="" > {dateOfFormSubmission} </h6>
                                                        <h6 className="">

                                                            {tags.map((tag, index) => (

                                                                <span key={tag}>

                                                                    ({index + 1}). {tag} , &nbsp; &nbsp;

                                                                </span>

                                                            ))}

                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>



                                    <section className="location-section" ref={technicalDetailsRef}>
                                        <div className="container">
                                            <h2> Technical Details</h2>
                                            <div className="row justify-content-center">
                                                <div className="col-lg-12 col-12 mb-4">

                                                    <div dangerouslySetInnerHTML={{ __html: technicalDetails }} />

                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {
                                        !warrantyDetails ? "" : (
                                            <section
                                                className="location-section"
                                                id="voteridcard"
                                                ref={warrantyDetailsRef}
                                            >
                                                <div className="container">
                                                    <h2> Warranty Details</h2>
                                                    <div className="row justify-content-center">
                                                        <div className="col-lg-12 col-12 mb-4">

                                                            <div dangerouslySetInnerHTML={{ __html: warrantyDetails }} />

                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )
                                    }


                                    <section className="location-section" ref={otherDetailsRef}>
                                        <div className="container">
                                            <h2> Other Details</h2>
                                            <div className="row justify-content-center">
                                                <div className="col-lg-12 col-12 mb-4">

                                                    <div dangerouslySetInnerHTML={{ __html: productDetails }} />

                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="location-section" ref={otherDetailsRef} style={{
                                        width: "60%",
                                        margin: "1rem auto"
                                    }}>
                                        <div className="container">
                                            <h2> Top Reviews </h2>
                                            <button className="btn btn-primary" style={{ fontSize: "medium" }} onClick={() => openModal({ _id, name })}>
                                                Add Review
                                            </button>
                                            <div className="row justify-content-center">
                                                <div className="col-lg-12 col-12 mb-4">
                                                    {
                                                        reviews.map(({ rating, userName, comment, title }, index) => {
                                                            const commentId = `${_id}-${index}`;
                                                            return (<>
                                                                <div key={commentId}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>

                                                                        <h5 style={{ display: 'flex', alignItems: 'center', margin: 0 }}>

                                                                            <strong style={{ display: 'flex', alignItems: 'center' }}>

                                                                                <i className="fas fa-user-circle" style={{ fontSize: "2rem", marginRight: "0.5rem" }}></i>

                                                                                <span style={{ fontSize: "1rem" }}>

                                                                                    {userName}

                                                                                </span>

                                                                            </strong>

                                                                        </h5>

                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', height: '100px', marginTop: "-2rem" }}>

                                                                        <h5 style={{ display: 'flex', alignItems: 'center', margin: 0 }}>

                                                                            <strong style={{ display: 'flex', alignItems: 'center' }}>

                                                                                {/* Replace user icon with stars based on rating */}

                                                                                <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>

                                                                                    {Array.from({ length: 5 }, (_, index) => {

                                                                                        const starColor = index < rating ? getStarColor(index + 1) : 'lightgray'; // Light gray for unfilled stars

                                                                                        return (

                                                                                            <i

                                                                                            key={index}
                                                                    
                                                                                            className="fas fa-star"
                                                                    
                                                                                            style={{ color: getStarColor(index , rating), fontSize: "1rem", marginRight: "0.2rem" }}
                                                                    
                                                                                        ></i> 

                                                                                        );

                                                                                    })}

                                                                                </div>

                                                                                <span style={{ fontSize: "1rem", fontWeight: "bolder" }}>

                                                                                    {title}

                                                                                </span>

                                                                            </strong>

                                                                        </h5>

                                                                    </div>

                                                                    <h5>
                                                                        <span
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: comment,
                                                                            }}
                                                                        ></span>
                                                                    </h5>
                                                                </div>
                                                                <div>

                                                                    <i

                                                                        className={`fa-regular fa-thumbs-up ${likedComments[commentId] ? 'liked' : ''}`}

                                                                        style={{

                                                                            color: likedComments[commentId] ? 'green' : 'black',

                                                                            cursor: 'pointer',

                                                                        }}

                                                                        onClick={() => handleLikeCommentClick(commentId)}

                                                                    ></i>

                                                                    <i

                                                                        className={`fa-regular fa-thumbs-down ${dislikedComments[commentId] ? 'disliked' : ''}`}

                                                                        style={{

                                                                            color: dislikedComments[commentId] ? 'red' : 'black',

                                                                            cursor: 'pointer',

                                                                        }}

                                                                        onClick={() => handleDislikeCommentClick(commentId)}

                                                                    ></i>

                                                                </div>
                                                            </>)
                                                        })
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </section>



                                </div>
                            </>
                        );
                    }
                )}

            <></>
        </>
    );
};

export default ProductProfile;
