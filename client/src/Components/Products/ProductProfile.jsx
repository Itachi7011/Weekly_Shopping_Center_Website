import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const ProductProfile = () => {

    const location = useLocation();
    const previousData = location.state._id;
    const previousId = location.state.id;

    const specificationRef = useRef(null);
    const aadharcardRef = useRef(null);
    const pancardRef = useRef(null);
    const voteridcarRef = useRef(null);

    const navigate = useNavigate();


    // const ansRef = useRef(null);
    // const previousData = location.state.id;

    const [Data, setData] = useState({ post: [] });

    const [user1, setUser1] = useState("");

    const [currentImageIndex, setCurrentImageIndex] = useState(0);


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



    const handleSpecificationClick = useScrollIntoView(specificationRef);
    const handleAadharClick = useScrollIntoView(aadharcardRef);
    const handlePancardClick = useScrollIntoView(pancardRef);
    const handlevoteridcardClick = useScrollIntoView(voteridcarRef);

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
                        isNew,
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
                                <div style={{ marginTop: "3rem" }}>

                                    {/* All Images Main Div */}

                                    <div className="small-images-section mt-3 ms-5">



                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: "1rem" }}>

                                            {images.map((image, index) => (

                                                <img

                                                    key={index}

                                                    src={image.data}

                                                    className="img-thumbnail"

                                                    alt={`Thumbnail ${index + 1}`}

                                                    onClick={() => handleImageClick(index)} // Update the carousel when clicked

                                                    style={{ cursor: "pointer", width: "10rem", height: "auto", marginBottom: "0.5rem" }} // Make images clickable and set small width

                                                />

                                            ))}

                                        </div>

                                    </div>


                                    <section className="left-side-section" style={{ marginTop: "-20rem", }}>
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
                                                            style={{ marginTop: "-2rem" }}
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
                                                        <div className="card" style={{ padding: "2rem", marginRight: "-10rem", marginTop:"-1.5rem" }}>
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


                                                                {/* Simple button to go to the Review section */}

                                                                <a

                                                                    href="#reviews" // Link to the reviews section

                                                                    style={{

                                                                        marginLeft: '1rem', // Space between stars and button

                                                                        padding: '0.5rem 1rem', // Padding for the button

                                                                        backgroundColor: '#007bff', // Bootstrap primary color

                                                                        color: 'white', // Text color

                                                                        border: 'none', // No border

                                                                        borderRadius: '0.25rem', // Rounded corners

                                                                        textDecoration: 'none', // Remove underline

                                                                        display: 'inline-block', // Align as block for padding

                                                                        textAlign: 'center', // Center text

                                                                        transition: 'background-color 0.3s', // Smooth transition for hover effect

                                                                    }}

                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'} // Darker blue on hover

                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'} // Original blue on mouse leave

                                                                >

                                                                    Reviews

                                                                </a>

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
                                                                Market Name : { marketName}
                                                                <br />
                                                            </h6>
                                                            <h6 className="">
                                                                Basic Specs : { color} , &nbsp;{ weight} ,&nbsp;{ dimensions}
                                                                <br />
                                                            </h6>
                                                            <h6 className="">
                                                                Occupation : { }
                                                                <br />
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
                                                                        Aadhar Card Image
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
                                                                        PAN Card Image
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
                                                                        Voter ID Image
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
                                        ref={voteridcarRef}
                                    >
                                        <div className="container">
                                            <h2>Details</h2>
                                            <hr />
                                            <div className="row justify-content-center">
                                                <div className="col-lg-3 col-md-3 col-3 mt-4">
                                                    <h6>Name</h6>
                                                    <h6>Account No.</h6>
                                                    <h6>Phone No.</h6>
                                                    <h6>Email</h6>
                                                    <h6>Address</h6>
                                                    <h6>Father&apos;s Name</h6>
                                                    <h6>Qualifications</h6>
                                                    <h6>Date Of Birth</h6>
                                                    <h6>Age</h6>
                                                    <h6>Aadhar Card No.</h6>
                                                    <h6>Voter Id Card No.</h6>
                                                    <h6>PAN Card No.</h6>
                                                    <h6>Account Opening Date</h6>
                                                </div>

                                                <div
                                                    className="col-lg-5 col-md-5 col-9 mt-4"
                                                    id="specifications"
                                                >
                                                    <div className="specification-content">


                                                        <h6 className="" > {name} </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > { }1 </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" >  { },  </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > { } </h6>

                                                        <h6 className="" > {dateOfFormSubmission} </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section
                                        className="about-project-section Project-Info"
                                        id="aboutProject"
                                    >
                                        <div className="container mt-4">
                                            <div className="row align-items-center">
                                                <div className="col-lg-12 col-md-12 col-12">
                                                    <h2>Occupation Description</h2>
                                                    <hr />
                                                    {/* <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: occupationDescription,
                                                        }}
                                                    /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="location-section" ref={aadharcardRef}>
                                        <div className="container">
                                            <h2> Aadhar Card</h2>
                                            <div className="row justify-content-center">
                                                <div className="col-lg-12 col-12 mb-4">
                                                    {/* <div className="location-map">
                            <img
                              src={
                                new URL(
                                  `../Uploads/Customers/SavingAccounts/${aadharImage.data}`,
                                  import.meta.url
                                ).href
                              }
                              // src={aadharImage.data}
                              className="img-fluid mx-auto"
                              alt="map"
                            />
                            <button
                              className="btn btn-success btn-lg "
                              style={{
                                marginTop: "1rem",
                                marginLeft: "2rem",
                                marginBottom: "-5rem",
                                border: "3px solid green",
                              }}
                              onClick={() =>
                                printImage(
                                  new URL(
                                    `../Uploads/Customers/SavingAccounts/${aadharImage.data}`,
                                    import.meta.url
                                  ).href
                                )
                              }
                            >
                              Print
                            </button>
                          </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section
                                        className="location-section"
                                        id="voteridcard"
                                        ref={voteridcarRef}
                                    >
                                        <div className="container">
                                            <h2> Voter ID Card</h2>
                                            <div className="row justify-content-center">
                                                <div className="col-lg-12 col-12 mb-4">
                                                    {/* <div className="location-map">
                            <img
                              src={
                                new URL(
                                  `../Uploads/Customers/SavingAccounts/${voterIdImage.data}`,
                                  import.meta.url
                                ).href
                              }
                              // src={aadharImage.data}
                              className="img-fluid mx-auto"
                              alt="map"
                            />
                            <button
                              className="btn btn-success btn-lg "
                              style={{
                                marginTop: "1rem",
                                marginLeft: "2rem",
                                marginBottom: "-5rem",
                                border: "3px solid green",
                              }}
                              onClick={() =>
                                printImage(
                                  new URL(
                                    `../Uploads/Customers/SavingAccounts/${voterIdImage.data}`,
                                    import.meta.url
                                  ).href
                                )
                              }
                            >
                              Print
                            </button>
                          </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section
                                        className="location-section"
                                        id="pancard"
                                        ref={pancardRef}
                                    >
                                        <div className="container">
                                            <h2> PAN Card</h2>
                                            <div className="row justify-content-center">
                                                <div className="col-lg-12 col-12 mb-4">
                                                    {/* <div className="location-map">
                            <img
                              src={
                                new URL(
                                  `../Uploads/Customers/SavingAccounts/${panImage.data}`,
                                  import.meta.url
                                ).href
                              }
                              // src={aadharImage.data}
                              className="img-fluid mx-auto"
                              alt="map"
                            />
                            <button
                              className="btn btn-success btn-lg "
                              style={{
                                marginTop: "1rem",
                                marginLeft: "2rem",
                                marginBottom: "-5rem",
                                border: "3px solid green",
                              }}
                              onClick={() =>
                                printImage(
                                  new URL(
                                    `../Uploads/Customers/SavingAccounts/${panImage.data}`,
                                    import.meta.url
                                  ).href
                                )
                              }
                            >
                              Print
                            </button>
                          </div> */}
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
