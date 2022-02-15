import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import convertRupiah from "rupiah-format";

import Navbar from "../components/Navbar";

import dataProduct from "../fakeData/product";

// Get API config here ...
import { API } from "../config/api";


export default function DetailProduct() {
  let history = useHistory();
  let { id } = useParams();

  // Create Variabel for store product data here ...
  const [product, setProduct] = useState({})

  // Create function get product data by id from database here ...
  const getProduct = async (id) => {
    try {

        const response = await API.get('/product/' + id)

        console.log(response.data.data);
        setProduct(response.data.data)

    } catch (error) {
      console.log(error);      
    }
  }

  // Call function get product with useEffect didMount here ...
  useEffect(() => {
    getProduct(id)
  }, [])

  
  // This step after fetching product detail data
  // Create handle buy process & insert transaction data to database here ...
  const handleBuy = async (e) => {
    try {
      e.preventDefault();
  
      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      // Get data from product
      const data = {
        idProduct: product.id,
        idSeller: product.user.id,
        price: product.price,
      };
  
      // Data body
      const body = JSON.stringify(data);
  
      // Insert transaction data
      await API.post("/transaction", body, config);
  
      history.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <Container className="py-5">
        <Row>
          <Col md="2"></Col>
          <Col md="3">
            <img src={product.image} className="img-fluid" />
          </Col>
          <Col md="5">
            <div className="text-header-product-detail">{product.name}</div>
            <div className="text-content-product-detail">
              Stock : {product.qty}
            </div>
            <p className="text-content-product-detail mt-4">{product.desc}</p>
            <div className="text-price-product-detail text-end mt-4">
              {convertRupiah.convert(product.price)}
            </div>
            <div className="d-grid gap-2 mt-5">
              <button onClick={handleBuy} className="btn btn-buy">
                Buy
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
