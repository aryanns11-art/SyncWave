import "./Navbar.css";

import { Link } from "react-router-dom";

function Navbar() {

    return (

        <nav className="navbar">

            <div className="nav-logo">

                <img
                    src="/logo.jpeg"
                    alt="SyncWave Logo"
                    className="nav-logo-image"
                />

                <h2>SyncWave</h2>

            </div>

            <div className="nav-links">

                <Link to="/">Home</Link>

                <Link to="/upload">Upload</Link>

            </div>

        </nav>

    );

}

export default Navbar;