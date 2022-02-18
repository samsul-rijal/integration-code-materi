import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";

import NavbarAdmin from "../components/NavbarAdmin";

import dataCategory from "../fakeData/category";

import { API } from "../config/api";

export default function UpdateCategoryAdmin() {
  const title = "Category admin";
  document.title = "DumbMerch | " + title;

  let navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState({ name: "" });

  // Fetching category data by id from database
  const getCategory = async (id) => {
    try {
      const response = await API.get("/category/" + id);
      // Store product data to useState variabel
      setCategory({ name: response.data.data.name });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setCategory({
      ...category,
      name: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(category);

      // Insert category data
      const response = await API.patch("/category/" + id, body, config);

      console.log(response.data);

      navigate("/category-admin");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory(id);
  }, []);

  return (
    <>
      <NavbarAdmin title={title} />
      <Container className="py-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4">Edit Category</div>
          </Col>
          <Col xs="12">
            <form onSubmit={handleSubmit}>
              <input
                onChange={handleChange}
                value={category.name}
                placeholder="category"
                className="input-edit-category mt-4"
              />
              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="success" size="md">
                  Save
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
