import { useContext, useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { UserContext } from "./context/userContext";

import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Complain from "./pages/Complain";
import Profile from "./pages/Profile";
import ComplainAdmin from "./pages/ComplainAdmin";
import CategoryAdmin from "./pages/CategoryAdmin";
import ProductAdmin from "./pages/ProductAdmin";
import EditCategoryAdmin from "./pages/EditCategoryAdmin";
import AddCategoryAdmin from "./pages/AddCategoryAdmin";
import AddProductAdmin from "./pages/AddProductAdmin";
import EditProductAdmin from "./pages/EditProductAdmin";

// Get API config & setAuthToken here ...
import { API, setAuthToken } from "./config/api";

// Init token on axios every time the app is refreshed here ...
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let history = useHistory();
  
  // Init user context here ...
  const [state, dispatch] = useContext(UserContext);
  // Redirect Auth here ...
  useEffect(() => {
    // Redirect Auth
    if (state.isLogin == false) {
      history.push("/auth");
    } else {
      if (state.user.status == "admin") {
        history.push("/complain-admin");
      } else if (state.user.status == "customer") {
        history.push("/");
      }
    }
  }, [state]);

  // Create function for check user token here ...
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
  
      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }
  
      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;
      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    checkUser();
  }, []);
  // Call function check user with useEffect didMount here ...

  return (
    <Switch>
      <Route exact path="/" component={Shop} />
      <Route path="/auth" component={Auth} />
      <Route path="/product/:id" component={Product} />
      <Route path="/complain" component={Complain} />
      <Route path="/profile" component={Profile} />
      <Route path="/complain-admin" component={ComplainAdmin} />
      <Route path="/category-admin" component={CategoryAdmin} />
      <Route path="/edit-category/:id" component={EditCategoryAdmin} />
      <Route path="/add-category" component={AddCategoryAdmin} />
      <Route path="/product-admin" component={ProductAdmin} />
      <Route path="/add-product" component={AddProductAdmin} />
      <Route path="/edit-product/:id" component={EditProductAdmin} />
    </Switch>
  );
}

export default App;
