import { useState, useEffect } from "react";

import axios from "axios";





// const products = [

//     {
//         id: 1,
//         name: "Product 1",
//         price: 29.99,
//         brand: "Brand A",
//         discount: 10,
//         rating: 4.5,
//         imageUrl: "https://via.placeholder.com/150",
//     },

// ];


const ProductListing = () => {

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

    return (

        <div className="container productListPage">

            <h2 className="text-center mb-4">Products List</h2>

            <div className="row">

                {products.map((product) => (

                    <div className="col-md-3 mb-4" key={product.id}>

                        <div className="card shadow-sm">

                            <img src={product.images[0].data} className="card-img-top" alt={product.name} />

                            <div className="card-body">

                                <h5 className="card-title">{product.name}</h5>


                                <p className="card-text">

                                    <del>₹ {product.price}</del> <span className="text-danger">(-{product.sellerDiscount}%)</span> <br/> <strong className="text-success"> ₹ {product.effectivePrice}</strong> <span className="text-danger"> Save ₹ {product.price-product.effectivePrice} </span>

                                </p>

                                <div className="rating" style={{marginTop:"-1rem"}} >

                                    {[...Array(5)].map((_, index) => (

                                        <span key={index} className={index < Math.floor(product.rating) ? "text-warning" : "text-muted"}>★</span>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};


export default ProductListing;