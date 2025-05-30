import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
import './LoginPage.css'
import NotificationContainer, { triggeredNotification } from "../../../Notification/NotificationContainer";
import { initializeSocket } from "../../socket/SocketConnection";

export default function LoginPage() {

    let navigate = useNavigate();
    const location = useLocation();
    let url = "https://chat-connect-part-1.onrender.com";
    // let url = "http://localhost:8080";

    let [data,setData] = useState({email:"",password:""});
    let [loading,setLoading] = useState(false)
    let handleInput = (e) => {
        setData((curr) => {
            return{
                ...curr,[e.target.name]:e.target.value
            }
        })
    };

    let handleForm = async (e) => {
        e.preventDefault();
        setData({email:'',password:''})
        setLoading(true)
        try {
            let response = await fetch(`${url}/router/login`,{
                method : "POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body : JSON.stringify({data:data}),
                credentials : 'include'
            })

            let result = await response.json();
            console.log(result.message);
            if(response.status == 200) {
                localStorage.setItem('frontData',JSON.stringify(result));
                const users = localStorage.getItem('frontData');
                let parseData = JSON.parse(users)
                const socket = initializeSocket();
                socket.emit("addNewUser",parseData.user.id)
                setLoading(false)
                navigate('/chat',{state:{loginMessage : result.message}})
            }else {
                setLoading(false)
                throw new Error(result.message);
            }

        } catch (error) {
            navigate('/login',{state:{errorMessage : error.message}})
        }
    };

    useEffect(() => {

        if(location.state && location.state.errorMessage) {
            triggeredNotification(location.state.errorMessage,"error");
            navigate("/login", {state:{}})
        }
    }, [location.state])
    return(
        <div className="auth-page">
            <NotificationContainer></NotificationContainer>
            <div className="auth-container">
                <h3>Login page</h3>
                <form onSubmit={handleForm}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" required onChange={handleInput} value={data.email} name="email" id="email" placeholder="Enter your email"></input><br></br>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" required onChange={handleInput} value={data.password} name="password" placeholder="Enter the password" id="password"></input><br></br>
                    </div>
                    <button className="btn btn-primary" disabled={loading}>{loading?'loading':'submit'}</button>
                </form>
                <p>Don't have an account? <Link className="link" to={"/signup"}>Sign Up</Link></p>
{/*                 <p>Forgot Password? <Link className="link" to={"/signup"}>Forgot Password</Link></p> */}

            </div>
        </div>
    )
}
