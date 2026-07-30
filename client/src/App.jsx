import "./App.css";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Room from "./pages/Room";

function App() {

    return (

        <>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route
                    path="/upload"
                    element={
                        <AdminRoute>
                            <Upload />
                        </AdminRoute>
                    }
                />

                <Route path="/login" element={<Login />} />
                
                <Route path="/register" element={<Register />} />

                <Route path="/rooms" element={<Room />} />
                
            </Routes>

        </>
        
    );

}

export default App;