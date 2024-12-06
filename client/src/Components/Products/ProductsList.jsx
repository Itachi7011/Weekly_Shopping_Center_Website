import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";




const ProductListing = () => {


    const navigate = useNavigate();

    const [Profile, setProfile] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const [atBottom, setAtBottom] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bankOffers, setBankOffers] = useState({ post: [] });
    const [products, setProducts] = useState([]);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [filters, setFilters] = useState({

        isNewProduct: false,

        isPremium: false,

        isLimitedTimeDeal: false,

        isPopular: false,

    });


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

    const indexOfLastItem = currentPage * itemsPerPage;

    const indexOfFirstItem = indexOfLastItem - itemsPerPage;



    const toggleSidebar = () => {

        setIsSidebarVisible(!isSidebarVisible);

    };


    const handleFilterChange = (event) => {

        const { name, checked } = event.target;

        setFilters((prevFilters) => ({

            ...prevFilters,

            [name]: checked,

        }));

        // Reset current page to 1 whenever a filter is changed

        setCurrentPage(1);

    };


    // Filter products based on selected filters

    const filteredProducts = products.filter((product) => {

        // If no filters are selected, return all products

        if (!filters.isNewProduct && !filters.refurbished && !filters.isPremium && !filters.isLimitedTimeDeal && !filters.isPopular) {

            return true; // Show all products

        }


        const matchesNewProduct = filters.isNewProduct ? product.newOrRefurbished === "New" : false;

        const matchesRefurbished = filters.refurbished ? product.newOrRefurbished === "Refurbished" : false;


        const matchesPremium = filters.isPremium ? product.isPremium : true;

        const matchesLimitedTimeDeal = filters.isLimitedTimeDeal ? product.isLimitedTimeDeal : true;

        const matchesPopular = filters.isPopular ? product.isPopular : true;


        // Check if either new or refurbished matches

        const matchesNewOrRefurbished = matchesNewProduct || matchesRefurbished;


        return (matchesNewOrRefurbished || !filters.isNewProduct && !filters.refurbished) && matchesPremium && matchesLimitedTimeDeal && matchesPopular;

    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);


    if (currentPage > totalPages && totalPages > 0) {

        setCurrentPage(1); // Reset to page 1 if current page exceeds total pages

    }

    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {

        setCurrentPage((prevPage) => pageNumber);

        window.scrollTo(0, 0);
    };


    // Function to limit the text to 20 words

    const limitWords = (text, wordLimit) => {

        const words = text.split(/\s+/); // Split by whitespace

        if (words.length <= wordLimit) {

            return text; // Return original text if it's within the limit

        }

        return words.slice(0, wordLimit).join(' ') + '...'; // Join first 20 words and add ellipsis

    };

    const handleScrollToggle = () => {

        if (atBottom) {

            // Scroll to the top of the page

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } else {

            // Scroll to the bottom of the page

            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        }

    };


    const checkScrollPosition = () => {

        const scrollPosition = window.scrollY + window.innerHeight;

        const documentHeight = document.body.scrollHeight;


        // Check if the user is at the bottom of the page

        setAtBottom(scrollPosition >= documentHeight - 100);

    };

    useEffect(() => {

        window.addEventListener('scroll', checkScrollPosition);

        return () => {

            window.removeEventListener('scroll', checkScrollPosition);

        };

    }, []);

    const handleDelete = (event, id) => {

        if (event && typeof event.preventDefault === 'function') {

            event.preventDefault();

        }
        console.log("id is: ", id)

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

    const handleAddToCart = (event, id, name) => {

        if (event && typeof event.preventDefault === 'function') {

            event.preventDefault();

        }


        const bodyFormData = new FormData();

        bodyFormData.append("productId", id);
        bodyFormData.append("productName", name);

        bodyFormData.append("userName", Profile.name);

        bodyFormData.append("userEmail", Profile.email);



        axios

            .post("/api/addToCartProduct", bodyFormData, {

                headers: {

                    "Content-Type": "application/json",

                },

            })

            .then((response) => {

                alert(response.data.data);


            })

            .catch((err) => {

                console.log("Error during delete selected:", err);

            });


    };

    console.log("Current Page:", currentPage);

    console.log("Index of First Item:", indexOfFirstItem);

    console.log("Index of Last Item:", indexOfLastItem);

    console.log("Current Items:", currentItems);



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

        <button

            style={{

                position: 'fixed',

                left: '20px',

                top: '5rem',

                backgroundColor: '#007bff',

                color: 'white',

                border: 'none',

                borderRadius: '5px',

                padding: '10px',

                cursor: 'pointer',

                zIndex: 9999999,

            }}

            onClick={toggleSidebar}

        >
            {isSidebarVisible ? "Hide " : "Show "}
            Filters

        </button>


        {isSidebarVisible && (

            <div className={`product-list-sidebar ${isSidebarVisible ? 'visible' : ''}`}>

                <div>

                    <label>

                        <input

                            type="checkbox"

                            name="isNewProduct"

                            checked={filters.isNewProduct}

                            onChange={handleFilterChange}

                        />

                        New Product

                    </label>

                </div>

                <div>

                    <label>

                        <input

                            type="checkbox"

                            name="refurbished"

                            checked={filters.refurbished}

                            onChange={handleFilterChange}

                        />

                        Refurbished

                    </label>

                </div>

                <div>

                    <label>

                        <input

                            type="checkbox"

                            name="isPremium"

                            checked={filters.isPremium}

                            onChange={handleFilterChange}

                        />

                        Premium

                    </label>

                </div>

                <div>

                    <label>

                        <input

                            type="checkbox"

                            name="isLimitedTimeDeal"

                            checked={filters.isLimitedTimeDeal}

                            onChange={handleFilterChange}

                        />

                        Limited Time Deal

                    </label>

                </div>

                <div>

                    <label>

                        <input

                            type="checkbox"

                            name="isPopular"

                            checked={filters.isPopular}

                            onChange={handleFilterChange}

                        />

                        Popular

                    </label>

                </div>

            </div>

        )}

        <button

            style={{

                position: 'fixed',

                right: '20px',

                bottom: '12rem',

                backgroundColor: '#007bff',

                color: 'white',

                border: 'none',

                borderRadius: '5px',

                padding: '20px',

                cursor: 'pointer',

                zIndex: 9999999,

            }}

            onClick={handleScrollToggle}

        >

            <i className={atBottom ? "fas fa-arrow-up" : "fas fa-arrow-down"} />

        </button>





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



                {currentItems.length > 0 ? (

                    currentItems.map((product, index) => (

                        <div className="col-md-4 mb-4" key={`${product.id}-${currentPage}`}>

                            <div className="card shadow-sm" style={{ height: "750px" }}>

                                {product.isPremium === true ? (<span className="badge bg-warning text-dark position-absolute" style={{ top: "10px", left: "10px", zIndex: 1 }}>

                                    Premium

                                </span>) : ""}




                                {product.isPopular === true ? (<span className="badge  position-absolute" style={{ top: "50px", left: "10px", zIndex: 1, background: "#00A86B" }}>

                                    Latest

                                </span>) : ""}





                                <span className="rating-stars position-absolute" style={{ top: "10px", right: "10px", zIndex: 1 }}>

                                    {[...Array(5)].map((_, index) => (

                                        <i key={index} className="fas fa-star" style={{ color: getStarColor(index, parseInt(product.averageRating)), fontSize: "large", }}></i>

                                    ))}
                                </span>



                                <img src={product.images[0].data}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        height: "450px",
                                        objectFit: "cover",
                                        position: "relative",
                                        cursor: "pointer",
                                        padding: "0.2rem",
                                        background: "#F0F8FB"
                                    }}
                                    onClick={function () {
                                        navigate(`/ProductProfile/${product.name}`, {
                                            state: {
                                                _id: product._id,
                                                id: product.id,
                                                name: product.name,
                                            },
                                        });
                                    }}

                                />
                                {product.isPopular === true ? (<span className="badge bg-primary text-white position-absolute" style={{ top: "50px", right: "10px", zIndex: 1 }}>

                                    Sponsored

                                </span>) : ""}

                                <span
                                    className={product.addToCart.some(item =>

                                        item.userEmail === Profile.email && item.productId === product._id

                                    ) ? "profileListCartIcon2" : "profileListCartIcon1"}
                                    onClick={(event) => handleAddToCart(event, product._id, product.name)}
                                    style={{
                                        position: "absolute",
                                        bottom: "14.5rem"
                                    }}
                                > {Profile.userType === "Admin" ?
                                    (<span>  {product.addToCart.length} </span>) :
                                    ""}   <i className="fas fa-cart-plus"></i> </span>


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

                                    <h5 className="card-title ">
                                        <div className="product-title"
                                            style={{
                                                marginBottom: "-0.5rem"
                                            }}

                                            onClick={function () {
                                                navigate(`/ProductProfile/${product.name}`, {
                                                    state: {
                                                        _id: product._id,
                                                        id: product.id,
                                                        name: product.name,
                                                    },
                                                });
                                            }}
                                        > {product.name}


                                        </div>



                                        <br /> <span
                                            style={{
                                                fontSize: "small",
                                                color: "white",
                                                background: product.newOrRefurbished === "New" ? "#1866E1" : "#FF7518",
                                                borderRadius: "5px",
                                                padding: "5px 10px",
                                                marginBottom: "0.5rem"
                                            }}
                                        > {product.newOrRefurbished}
                                        </span> {product.isLimitedTimeDeal === true ? (

                                            <span style={{ position: "relative", display: "inline-block" }}>

                                                <span

                                                    className="ms-1"

                                                    style={{ color: "white", fontSize: "small", background: "#BE1F35 ", padding: "0.2rem 0.4rem", borderRadius: "5px", }}

                                                > Limited Time Deal </span>

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


                                    <p className="card-text" style={{ marginTop: "1.5rem", cursor: "pointer" }}
                                        onClick={function () {
                                            navigate(`/ProductProfile/${product.name}`, {
                                                state: {
                                                    _id: product._id,
                                                    id: product.id,
                                                    name: product.name,
                                                },
                                            });
                                        }}
                                    >

                                        <strong className="text-success " style={{ fontSize: "xx-large" }}> ₹ {product.effectivePrice}</strong>

                                        <strong> <del>₹ {product.price}</del> </strong>  <span className="text-danger">(-{product.sellerDiscount + "%" + (product.adminDiscount === 0 ? (" & " + product.adminDiscount + "%") : "")} Off)</span> <br />

                                    </p>

                                    <p className="text-success" style={{ fontSize: "large", marginTop: "-0.5rem", cursor: "pointer" }}
                                        onClick={function () {
                                            navigate(`/ProductProfile/${product.name}`, {
                                                state: {
                                                    _id: product._id,
                                                    id: product.id,
                                                    name: product.name,
                                                },
                                            });
                                        }}
                                    ><i className="fa-solid fa-check"></i> Save ₹ {product.price - (product.effectivePrice - (product.adminDiscount || 0))} </p>

                                    <p className="card-text">

                                        <span>
                                            {Number(product.effectivePrice) >= 500
                                                ?
                                                <span style={{
                                                    color: "black",
                                                    background: "yellow",
                                                    padding: "5px 10px"
                                                }}>
                                                    Free Delivery
                                                </span>

                                                :

                                                <span style={{
                                                    color: "white",
                                                    background: "red",
                                                    padding: "5px 10px"
                                                }}>
                                                    + Delivery Charges
                                                </span>
                                            }
                                        </span>

                                    </p>


                                </div>

                            </div>


                        </div>


                    ))
                ) : (

                    <p>No products available.</p>

                )
                }

            </div>







            <div className="pagination">

                <ul>

                    <li>

                        <button onClick={() => paginate(1)}>First</button>

                    </li>

                    <li>

                        {currentPage > 1 ? (

                            <button onClick={() => paginate(currentPage - 1)}>Prev</button>

                        ) : (

                            <button disabled>Prev</button>

                        )}

                    </li>

                    {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, index) => (

                        <li key={index}>

                            <button

                                onClick={() => paginate(index + 1)}

                                className={index + 1 === currentPage ? "active" : ""}

                            >

                                {index + 1}

                            </button>

                        </li>

                    ))}

                    <li>

                        {currentPage < Math.ceil(products.length / itemsPerPage) ? (

                            <button onClick={() => paginate(currentPage + 1)}>Next</button>

                        ) : (

                            <button disabled>Next</button>

                        )}

                    </li>

                    <li>

                        <button onClick={() => paginate(Math.ceil(products.length / itemsPerPage))}>

                            Last

                        </button>

                    </li>

                </ul>

            </div>

        </div>


    </>

    );

};


export default ProductListing;