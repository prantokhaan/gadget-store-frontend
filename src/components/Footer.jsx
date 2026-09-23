import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4 justify-content-between align-items-start">
          {/* Store Name & Brief Branding */}
          <div className="col-12 col-md-4">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-cpu-fill fs-3 text-warning"></i>
              <span className="h4 fw-bold text-warning mb-0">GadgetStore</span>
            </Link>
            <p className="text-secondary small mb-0">
              Your premier destination for authentic tech gadgets, computer accessories, and mobile peripherals in Bangladesh.
            </p>
          </div>

          {/* Contact Information (Address, Phone, Email) */}
          <div className="col-12 col-md-7 col-lg-6">
            <h6 className="text-uppercase text-warning fw-bold small mb-3">Contact & Store Location</h6>
            <ul className="list-unstyled text-secondary small mb-0 d-flex flex-column gap-2">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt-fill text-danger fs-6 mt-1 flex-shrink-0"></i>
                <span>
                  <strong>Address:</strong> Level 4, Concord Tower, Road 11, Banani, Dhaka-1213, Bangladesh
                </span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-success fs-6 flex-shrink-0"></i>
                <span>
                  <strong>Phone:</strong> <a href="tel:+8801711223344" className="text-decoration-none text-light">+880 1711-223344</a>, <a href="tel:+8801811223344" className="text-decoration-none text-light">+880 1811-223344</a>
                </span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill text-primary fs-6 flex-shrink-0"></i>
                <span>
                  <strong>Email:</strong> <a href="mailto:support@gadgetstore.com" className="text-decoration-none text-light">support@gadgetstore.com</a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <hr className="border-secondary my-4" />
        <div className="row align-items-center">
          <div className="col-12 text-center text-secondary small">
            &copy; {currentYear} <strong>GadgetStore</strong>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
