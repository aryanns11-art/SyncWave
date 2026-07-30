import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

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

                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {user?.role === "admin" && (
                    <Link to="/upload">Upload</Link>
                )}

                {user && (
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}

                <Link to="/rooms">Rooms</Link>

            </div>

        </nav>

    );

}

export default Navbar;