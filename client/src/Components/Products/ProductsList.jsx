import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";




const ProductListing = () => {


    const navigate = useNavigate();

    const [Profile, setProfile] = useState("");

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bankOffers, setBankOffers] = useState({ post: [] });
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("/api/userProfile")
            .then(async (response) => {
                const data = await response.data;

                setProfile(data);

                console.log("data fetched successfully");
            })
            .catch((err) => {
                console.log(`Error during catch of setProfile -  ${err}`);
            });
    }, []);


    useEffect(() => {
        axios
            .get("/api/productsList")
            .then((response) => {

                const data = response.data;
                setProducts(data);
            })
            .catch((err) => {
                console.log("Error during Data:", err);
            });
    }, []);

    useEffect(() => {
        axios
            .get("/api/bankOfferList")
            .then((response) => {
                const data = response.data;

                setBankOffers({ post: data });

            })
            .catch((err) => {
                console.log("Error during Data:", err);
            });
    }, []);

    const handleImageClick = (index) => {

        setCurrentImageIndex(index); // Update the current image index

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


    const handleDelete = (event, id) => {
        event.preventDefault();
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");


        if (confirmDelete) {

            axios

                .post("/api/deleteProduct", { id: id })

                .then((response) => {

                    alert("Product Deleted Successfully");
                    // window.location.reload();


                })

                .catch((err) => {

                    console.log("Error during delete selected:", err);

                });

        } else {

            // User canceled the delete action

            console.log("Delete action canceled.");

        }
    };

    const BankOffers = () => {
        return (<>
            <section className="left-side-section"
                style={{
                    marginTop: "2rem",
                    marginBottom: "2rem",
                    background: "#E7E9EA",
                    marginLeft: "0%",
                    marginRight: "0%",
                }}>
                <div className="container">

                    <div className="row">

                        <div className="col-lg-12 col-md-12 col-12">

                            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">

                                <div className="carousel-indicators">

                                    {bankOffers.post.map((offer, index) => (

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


                                <div className="carousel-inner" style={{ marginTop: "0rem" }}>

                                    {bankOffers.post.map((offer, index) => (

                                        <div key={index} className={`carousel-item ${index === currentImageIndex ? "active" : ""}`}>

                                            <div className="row justify-content-center" style={{
                                            }} >

                                                <h6
                                                    style={{
                                                        fontSize: "32px",
                                                        fontWeight: "bolder",
                                                        color: "white",
                                                        background: "#367588",
                                                        width: "100%",
                                                        marginLeft: "20%",
                                                        marginRight: "20%",
                                                        marginTop: "0rem",
                                                        textAlign: "center",
                                                        padding: "1rem",
                                                    }}
                                                >{offer.bankName}</h6>

                                                <div className="col-lg-2 col-12">

                                                    <div className="bank-details-check d-flex">

                                                        <img



                                                            src={offer.logo.data}

                                                            className="img-fluid ms-2 mb-3"

                                                            alt={offer.bankName}
                                                            style={{
                                                                width: "8rem",
                                                                height: "8rem",

                                                            }}

                                                        />

                                                    </div>



                                                </div>

                                                <div className="col-lg-2 col-12 mt-4">

                                                    <h3 style={{ fontSize: "32px" }}>Loan Amount</h3>

                                                    <h6 style={{ fontSize: "24px", lineHeight: "1.5" }} className="loan-amount">₹ {offer.loanAmount}</h6>

                                                </div>

                                                <div className="col-lg-2 col-12 mt-4">

                                                    <h3 style={{ fontSize: "32px" }}>Interest Rate</h3>

                                                    <h6 style={{ fontSize: "24px", lineHeight: "1.5" }} className="">Starts {offer.rateOfInterest}</h6>

                                                </div>

                                                <div className="col-lg-2 col-12 mt-4">

                                                    <h3 style={{ fontSize: "32px" }}>Processing Fees</h3>

                                                    <h6 style={{ fontSize: "24px", lineHeight: "1.5" }} className="">{offer.processingFees}</h6>

                                                </div>

                                                <div className="col-lg-2 col-12 mt-4">

                                                    <h3 style={{ fontSize: "32px" }}>Total Tenure</h3>

                                                    <h6 style={{ fontSize: "24px", lineHeight: "1.5" }}>{offer.tenure}</h6>

                                                </div>

                                                <div className="col-lg-2 col-12 mt-4">

                                                    <button

                                                        className=""

                                                        data-label="CONTACT"

                                                        id="Contact"

                                                        onClick={() => navigate("/home-loan", { state: offer })}
                                                        style={{
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            background: "#355BF5",
                                                            padding: "0.6rem",
                                                            borderRadius: "7px"
                                                        }}

                                                    >

                                                        View Offer

                                                    </button>

                                                </div>

                                            </div>

                                            <hr />

                                        </div>

                                    ))}

                                </div>

                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" style={{ marginTop: "5rem", marginLeft: "-5.5rem" }}>

                                    <span className="carousel-control-prev-icon" aria-hidden="true" ></span>

                                    <span className="visually-hidden">Previous</span>

                                </button>

                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" style={{ marginTop: "5rem", marginRight: "-5.5rem" }}>

                                    <span className="carousel-control-next-icon" aria-hidden="true" ></span>

                                    <span className="visually-hidden">Next</span>

                                </button>

                            </div>

                        </div>



                    </div>

                </div>
            </section>
        </>)
    }

    return (<>





        <div className="container productListPage">

            <h2 className="text-center mb-4"
                style={{
                    fontSize: "2rem",
                    fontWeight: "bolder",
                    color: "white",
                    background: "#828382",
                    padding: "1rem 5rem",
                    margin: "1rem 30%",
                    borderRadius: "15px"
                }}
            >Products List</h2>


            <div className="row">


                {products.slice(0, 3).map((product, index) => (

                    <div className="col-md-4 mb-4" key={product.id}>

                        <div className="card shadow-sm" style={{ height: "650px" }}>

                            {product.isPremium === true ? (<span className="badge bg-warning text-dark position-absolute" style={{ top: "10px", left: "10px", zIndex: 1 }}>

                                Premium

                            </span>) : ""}




                            {product.isPopular === true ? (<span className="badge  position-absolute" style={{ top: "50px", left: "10px", zIndex: 1, background: "#00A86B" }}>

                                New

                            </span>) : ""}





                            <span className="rating-stars position-absolute" style={{ top: "10px", right: "10px", zIndex: 1 }}>

                                {[...Array(5)].map((_, index) => (

                                    <i key={index} className="fas fa-star" style={{ color: getStarColor(index, parseInt(product.averageRating)), fontSize: "large", }}></i>

                                ))}
                            </span>



                            <img src={product.images[0].data} className="card-img-top" alt={product.name} style={{ width: "100%", height: "450px", objectFit: "cover", position: "relative", cursor: "pointer" }} onClick={function () {
                                const formattedName = encodeURIComponent(product.name);
                                console.log("Navigating to ProductProfile with name:", formattedName);
                                navigate(`/ProductProfile/${product.name}`, {
                                    state: {
                                        _id: product._id,
                                        id: product.id,
                                        name: product.name,
                                    },
                                });
                            }} />
                            {product.isPopular === true ? (<span className="badge bg-primary text-white position-absolute" style={{ top: "50px", right: "10px", zIndex: 1 }}>

                                Sponsored

                            </span>) : ""}


                            {Profile.userType === "Admin" ? (

                                <button
                                    className=" btn btn-danger px-3"
                                    onClick={(event) => handleDelete(event, product._id)}
                                    style={{ bottom: "140px", right: "10px", position: "absolute", zIndex: 1 }}>
                                    <i className="fas fa-trash-alt text-white mx-auto"
                                        style={{
                                            fontSize: "1.2rem"
                                        }}
                                    ></i>
                                </button>

                            ) : ""}

                            <div className="card-body">

                                <h5 className="card-title">
                                    <div className="" style={{ marginBottom: "-1rem" }}> {product.name}  <span style={{ fontSize: "smaller" }}>  </span>
                                    </div>


                                    <br />({product.newOrRefurbished}) {product.isLimitedTimeDeal === true ? (

                                        <span style={{ position: "relative", display: "inline-block" }}>

                                            <i

                                                className="fa-solid fa-hourglass-half ms-2"

                                                style={{ color: "white", background: "#2142AB", padding: "0.2rem 0.4rem", cursor: "pointer" }}

                                            ></i>

                                            {/* Tooltip */}

                                            <span className="tooltip-text">It is a time-limited offer, price will rise soon</span>

                                        </span>

                                    ) : ""}

                                    <span className="rating-stars position-absolute ms-2"
                                        style={{
                                            // top: "50px",
                                            // right: "10px",
                                            zIndex: 1,
                                            background: "#00A86B"
                                        }}>
                                        {product.isNewProduct === true ? (<span className="badge "
                                        >
                                            Popular
                                        </span>) : ""}

                                    </span>

                                </h5>


                                <p className="card-text">

                                    <strong> <del>₹ {product.price}</del> </strong>  <span className="text-danger">(-{product.sellerDiscount + "%" + (product.adminDiscount === 0 ? (" & " + product.adminDiscount + "%") : "")} Off)</span> <br /> <strong className="text-success"> ₹ {product.effectivePrice}</strong> <span className="text-danger"> Save ₹ {product.price - (product.effectivePrice - (product.adminDiscount || 0))} </span>

                                </p>



                            </div>

                        </div>

                    </div>

                ))}

            </div>

            <div className="row">
                {products.length > 3 && (
                    <BankOffers />
                )}
            </div>


            <div className="row">


                {products.slice(3).map((product, index) => (

                    <div className="col-md-4 mb-4" key={product.id}>

                        <div className="card shadow-sm" style={{ height: "650px" }}>

                            {product.isPremium === true ? (<span className="badge bg-warning text-dark position-absolute" style={{ top: "10px", left: "10px", zIndex: 1 }}>

                                Premium

                            </span>) : ""}




                            {product.isPopular === true ? (<span className="badge  position-absolute" style={{ top: "50px", left: "10px", zIndex: 1, background: "#00A86B" }}>

                                New

                            </span>) : ""}





                            <span className="rating-stars position-absolute" style={{ top: "10px", right: "10px", zIndex: 1 }}>

                                {[...Array(5)].map((_, index) => (

                                    <i key={index} className="fas fa-star" style={{ color: getStarColor(index, parseInt(product.averageRating)), fontSize: "large", }}></i>

                                ))}
                            </span>



                            <img src={product.images[0].data} className="card-img-top" alt={product.name} style={{ width: "100%", height: "450px", objectFit: "cover", position: "relative", cursor: "pointer" }} onClick={function () {
                                const formattedName = encodeURIComponent(product.name);
                                console.log("Navigating to ProductProfile with name:", formattedName);
                                navigate(`/ProductProfile/${product.name}`, {
                                    state: {
                                        _id: product._id,
                                        id: product.id,
                                        name: product.name,
                                    },
                                });
                            }} />
                            {product.isPopular === true ? (<span className="badge bg-primary text-white position-absolute" style={{ top: "50px", right: "10px", zIndex: 1 }}>

                                Sponsored

                            </span>) : ""}
                            {Profile.userType === "Admin" ? (

                                <button
                                    className=" btn btn-danger px-3"
                                    onClick={() => handleDelete(product._id)}
                                    style={{ bottom: "140px", right: "10px", position: "absolute", zIndex: 1 }}>
                                    <i className="fas fa-trash-alt text-white mx-auto"
                                        style={{
                                            fontSize: "1.2rem"
                                        }}
                                    ></i>
                                </button>

                            ) : ""}

                            <div className="card-body">

                                <h5 className="card-title">
                                    <div className="" style={{ marginBottom: "-1rem" }}> {product.name} <span style={{ fontSize: "smaller" }}>  </span>
                                    </div>


                                    <br />({product.newOrRefurbished}) {product.isLimitedTimeDeal === true ? (

                                        <span style={{ position: "relative", display: "inline-block" }}>

                                            <i

                                                className="fa-solid fa-hourglass-half ms-2"

                                                style={{ color: "white", background: "#2142AB", padding: "0.2rem 0.4rem", cursor: "pointer" }}

                                            ></i>

                                            {/* Tooltip */}

                                            <span className="tooltip-text">It is a time-limited offer, price will rise soon</span>

                                        </span>

                                    ) : ""}

                                    <span className="rating-stars position-absolute ms-2"
                                        style={{
                                            // top: "50px",
                                            // right: "10px",
                                            zIndex: 1,
                                            background: "#00A86B"
                                        }}>
                                        {product.isNewProduct === true ? (<span className="badge "
                                        >
                                            Popular
                                        </span>) : ""}

                                    </span>

                                </h5>


                                <p className="card-text">

                                    <strong> <del>₹ {product.price}</del> </strong>  <span className="text-danger">(-{product.sellerDiscount + "%" + (product.adminDiscount === 0 ? (" & " + product.adminDiscount + "%") : "")} Off)</span> <br /> <strong className="text-success"> ₹ {product.effectivePrice}</strong> <span className="text-danger"> Save ₹ {product.price - (product.effectivePrice - (product.adminDiscount || 0))} </span>

                                </p>



                            </div>

                        </div>

                    </div>

                ))}

            </div>
        </div>
    </>

    );

};


export default ProductListing;