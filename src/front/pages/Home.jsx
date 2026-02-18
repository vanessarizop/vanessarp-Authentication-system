import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4 text-primary p-2"><strong>Bienvenidos a su Portal Digital</strong></h1>
			<p className="lead">
				<img src="https://play-lh.googleusercontent.com/ZKBe2CM1kv0M4WnfQDQuVB9r6NAZHd5wMZHuxanHTQKZi5je0O-pXvn2ZlFlNdOLhg=w240-h480-rw" id="foto" className="img-fluid rounded-circle mb-3"  />
			</p>
			<p className="lead">Su acceso seguro y confiable a servicios exclusivos en línea.</p>
		</div>
	);
}; 