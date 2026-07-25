    import { useState } from "react";
    import { useNavigate, Link } from "react-router-dom";
    import "./Login.css";

    import { useContext } from "react";
    import { AuthContext } from "../context/AuthContext";

    function Login() {

        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const { login } = useContext(AuthContext);  

        const navigate = useNavigate();

        const handleLogin = async (e) => {

            e.preventDefault();

            try {

                const response = await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    alert(data.message);

                    return;

                }

                login(data.token, data.user);

                alert("Login Successful!");

                navigate("/");

            }

            catch (err) {

                console.error(err);

                alert("Server Error");

            }

        };

        return (

            <div className="login-container">

                <form className="login-form" onSubmit={handleLogin}>

                    <h2>Login</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                    <p>
                        Don't have an account?
                        {" "}
                        <Link to="/register">
                            Register
                        </Link>
                    </p>

                </form>

            </div>

        );

    }

    export default Login;