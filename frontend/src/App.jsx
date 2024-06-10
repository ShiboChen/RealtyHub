import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import ListingsPage from "./pages/ListingsPage";
import CreateListingPage from "./pages/CreateListingPage";
import UpdateListingPage from "./pages/UpdateListingPage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import SearchResultsPage from './pages/SearchResultsPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" autoClose={3000} />
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/listings/:id" element={<ListingDetailsPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/mylisting" element={<ListingsPage />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
              <Route
                path="/update-listing/:id"
                element={<UpdateListingPage />}
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
