import { useEffect, useState } from "react";
import { Navigate,Outlet, useNavigate } from "react-router-dom";

let PrivateRoute = () => {
    let [login,setLogin] = useState(false);
    let navigate = useNavigate();
    let url = "https://chat-connect-part-1.onrender.com";
useEffect(() => {
    console.log("I am Triggered",login)
    let auth = async() =>{
        try {
            let response = await fetch(`${url}/router/authcontext`,{
                method: "GET",
                headers : {
                    'Content-type' : "application/json",
                },
                credentials:'include'
            });
            console.log("I am Triggered 2",response)
            let result = await response.json();
            console.log(result)
            if(response.status == 200) {
                setLogin(true)
            } else {
                navigate('/login',{state:{errorMessage:"You are not login"}})
            }
        } catch (error) {
            navigate('/',{state:{errorMessage:"Something went wrong"}})
        }
    }
    auth();
},[])
    let isAuthenticated = login.toString();
    return isAuthenticated ? <Outlet /> :  <Navigate state={{errorMessage : "You are not login"}} to="/signup" />
}

export default PrivateRoute;