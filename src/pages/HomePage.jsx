import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <section className="hero-gradient text-white py-5 mb-4">
        <div className="container py-5 text-center">
          <h1 className="display-4 fw-bold mb-3">Essential Gadgets & Gear</h1>
          <p
            className="lead text-white-50 mx-auto mb-4"
            style={{ maxWidth: "650px" }}
          >
            Explore premium wireless peripherals, fast chargers, studio audio,
            and smart electronic accessories across Bangladesh.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link
              to="/products"
              className="btn btn-primary btn-lg px-4 shadow-sm"
            >
              <i className="bi bi-grid-fill me-2"></i>
              Browse Catalog
            </Link>
            <Link to="/cart" className="btn btn-outline-light btn-lg px-4">
              <i className="bi bi-cart3 me-2"></i>
              View Cart
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
