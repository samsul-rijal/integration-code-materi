import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import rupiahFormat from "rupiah-format";

import NavbarAdmin from "../components/NavbarAdmin";
import DeleteData from "../components/modal/DeleteData";

import imgEmpty from "../assets/empty.svg";

import dataProduct from "../fakeData/product";

// Get API config here ...
import { API } from "../config/api";

export default function ProductAdmin() {
  let history = useHistory();

  // Create Variabel for store product data here ...
  const [products, setProducts] = useState([]);

  // Create function get products data from database here ...
  const getProducts = async () => {
    try {
      const response = await API.get("/products");
      // Store product data to useState variabel
      console.log(response.data)
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const [product, setProduct] = useState(dataProduct);
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const title = "Product admin";
  document.title = "DumbMerch | " + title;

  const addProduct = () => {
    history.push("/add-product");
  };

  const handleEdit = (id) => {
    history.push("/edit-product/" + id);
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      console.log(idDelete);

      setProduct(product.filter((item) => item.id != idDelete));

      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      <NavbarAdmin title={title} />

      <Container className="py-5">
        <Row>
          <Col xs="6">
            <div className="text-header-category mb-4">List Product</div>
          </Col>
          <Col xs="6" className="text-end">
            <Button onClick={addProduct} className="btn-dark" style={{ width: "100px" }}>
              Add
            </Button>
          </Col>
          <Col xs="12">
            {products.length !== 0 ? (
              <Table striped hover size="lg" variant="dark">
                <thead>
                  <tr>
                    <th width="1%" className="text-center">
                      No
                    </th>
                    <th>Photo</th>
                    <th>Product Name</th>
                    <th>Product Desc</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle">
                        <img
                          src={item.image}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                          alt={item.name}
                        />
                      </td>
                      <td className="align-middle">{item.name}</td>
                      <td className="align-middle">
                        <ShowMoreText
                          /* Default options */
                          lines={1}
                          more="show"
                          less="hide"
                          className="content-css"
                          anchorClass="my-anchor-css-class"
                          expanded={false}
                          width={280}
                        >
                          {item.desc}
                        </ShowMoreText>
                      </td>
                      <td className="align-middle">{rupiahFormat.convert(item.price)}</td>
                      <td className="align-middle">{item.qty}</td>
                      <td className="align-middle">
                        <Button
                          onClick={() => {
                            handleEdit(item.id);
                          }}
                          className="btn-sm btn-success me-2"
                          style={{ width: "135px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                          className="btn-sm btn-danger"
                          style={{ width: "135px" }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center pt-5">
                <img src={imgEmpty} className="img-fluid" style={{ width: "40%" }} alt="empty" />
                <div className="mt-3">No data product</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <DeleteData setConfirmDelete={setConfirmDelete} show={show} handleClose={handleClose} />
    </>
  );
}
