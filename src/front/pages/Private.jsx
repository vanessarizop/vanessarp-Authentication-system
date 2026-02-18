import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Private = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

   useEffect(() => {
    const fetchPrivateData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
               `${import.meta.env.VITE_BACKEND_URL}/private`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            const data = await response.json();
            console.log(data); 
            if (data) {
                setEmail(data.email || data.user?.email || "Email no encontrado");
                setName(data.name || data.user?.name || "Usuario");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    };

    fetchPrivateData();
}, [navigate]);


const handleLogout = () => {
    dispatch({ type: "logout" });
    localStorage.removeItem("token");
    navigate("/login");
};


return (
        <div className="vip-background2"> 
            <div className="container">
                <div className="row mb-3">
                 <h1>Bienvenido a nuestra página VIP</h1>
                 <div>
                <div className="mt-3 text-justify">
                    <p>Hola <strong>{name}</strong>  gracias por visitarnos.</p>
                    <p> Disfruta de tus beneficios exclusivos como usuario registrado.</p>
                                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
    </div>

    <div className="carousel-inner">
        <div className="carousel-item active">
            <img className="d-block mx-auto" src="./src/front/assets/img/slide.jpg" alt="First slide" style={{ width: "600px", height: "400px", objectFit: "cover" }}/>
         <div className="carousel-caption d-none d-md-block text-dark">
        <h5><strong>Registro personalizado</strong></h5>
       
    </div>
        </div>
        <div className="carousel-item">
            <img className="d-block mx-auto" src="./src/front/assets/img/slide2.jpg" alt="Second slide" style={{ width: "600px", height: "400px", objectFit: "cover" }}/>
         <div className="carousel-caption d-none d-md-block text-dark">
        <h5><strong>Asesoramiento personalizado </strong> </h5>
    
    </div></div>
        <div className="carousel-item">
            <img className="d-block mx-auto" src="./src/front/assets/img/slide3.jpg" alt="Third slide" style={{ width: "600px", height: "400px", objectFit: "cover" }}/>
         <div className="carousel-caption d-none d-md-block text-dark">
        <h5><strong>Acceso 24/7</strong></h5>
      
    </div></div>
    </div>

    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
    </button>
</div>
 <div className="row m-3 ">
                    <p style={{ textAlign: "justify" }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>

                </div>
 
            </div>
            
        </div>
   
</div>
  
            </div> </div>


);

}
