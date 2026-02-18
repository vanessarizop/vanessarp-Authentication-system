import { Link, useNavigate} from "react-router-dom";
import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "logout" });
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isAuthenticated = !!store.token;

	return (
		<div className="container">
			<nav className="navbar navbar-light ">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>

				<div className="d-flex gap-2">
					{isAuthenticated ? (
                      
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Log Out</button>) : (
                       
                        <>
                            <Link to="/signup">
                                <button className="btn btn-outline-secondary">Signup</button>
                            </Link>
                            <Link to="/login">
                                <button className="btn btn-primary">Login</button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};