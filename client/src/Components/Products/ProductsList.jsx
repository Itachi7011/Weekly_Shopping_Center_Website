import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";




const ProductListing = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

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

        <div className="container productListPage">

            <h2 className="text-center mb-4">Products List</h2>

            <div className="row">

                {products.map((product) => (

                    <div className="col-md-4 mb-4" key={product.id}>

                        <div className="card shadow-sm" style={{height:"650px"}}>

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
                                navigate("/ProductProfile", {
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

                            <div className="card-body">

                                <h5 className="card-title">
                                    <div className="" style={{marginBottom:"-1rem"}}> {product.name} <span style={{ fontSize: "smaller" }}>  </span>
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

    );

};


export default ProductListing;