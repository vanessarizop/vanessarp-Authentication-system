import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Signup = () => {

    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

 const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert(data.msg); // "Usuario creado exitosamente"
                navigate("/login");
            } else {
                alert(data.msg || "Error en el registro");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        
        }
    };

    return (
    <div className="fondo-background"> 
        <div className="fondo-form">
        <div className="container mt-5 d-flex justify-content-center">
         <div className="row g-3">
             <div className="col-12 text-center text-primary text-success">
                <h1>Registro de usuario</h1>
            </div>
            <div className="col-12">
            <form onSubmit={handleSubmit}>
                 <div className="mb-3">
                     <label htmlFor="name" className="form-label">
                     <strong><i className="fa-regular fa-user"></i> Name</strong>
                    </label>
                     <input type="text" className="form-control" id="name" name="name" onChange={handleChange}/>
                    </div>
                <div className="mb-3">
                     <label htmlFor="email" className="form-label">
                     <strong><i className="fa-regular fa-envelope"></i> Email</strong>
                    </label>
                     <input type="email" className="form-control" id="email" name="email" onChange={handleChange}/>
                    </div>
                 <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                     <strong><i className="fa-solid fa-key"></i> Password</strong>
                    </label>
                 <input type="password" className="form-control" id="password" name="password" onChange={handleChange}/>
                </div>
                <div className="d-flex justify-content-center p-2">
                <button type="submit" className="btn btn-success  ">Registrarse</button>
            </div>
        </form>
             </div>
        </div> 
        </div>
        </div>
    </div>
    );
}
export default Signup;