import { useState } from "react";
import './SearchUser.css'
import { useNavigate } from "react-router-dom";

export default function SearchUser({CancleSearch,onSelectUser}) {
    let [email,setEmail] = useState('');
    let [searchResult,setSearchResult] = useState(null);

    let navigate = useNavigate();
    let url = "https://chat-connect-part-1.onrender.com";
    // let url = "http://localhost:8080";

    let handleCancleSearch = () => {
        CancleSearch()
    }

    let searchUserByEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/router/chats/serchEmail` ,{
                method:"POST"
                ,headers : {
                    'Content-type' : "application/json",
                },
                body : JSON.stringify({email:email}),
                credentials : 'include'
            })
            const result = await response.json();
            // console.log(result);
            if(response.status == 200) {
                setSearchResult(result)
                navigate("/chat",{state:{successMessage:result.message+" Start the chat"}})
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            navigate("/chat",{state:{errorMessage:error.message}})
            console.error(error)
        }
    };

    
    let startChat = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/router/chats/create` ,{
                method:"POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body : JSON.stringify({recipientEmail:email}),
                credentials : 'include'
            })
    
            const result = await response.json();
            console.log(result);
            if(response.status == 200) {
                onSelectUser(result)
                navigate("/chat",{state:{successMessage:result.message}})
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            navigate("/chat",{state:{errorMessage:error.message}})
        }
    };

    let changeEmail = () => {
        setSearchResult(null)
    }
    return(
        <div className="search-user-container">
                <div className="search-content">
                    <h5>SearchUser for start the chat</h5>
                    <button className="close-btn" onClick={handleCancleSearch}>X</button>
                    <div className="search-email">
                        <label htmlFor="email">Enter Email:</label>
                        <input id="email" value={email} onChange={(e) => {changeEmail();setEmail(e.target.value)}}></input>
                        <button onClick={searchUserByEmail}>Search</button>
                    </div>

                    <br></br>

                    {searchResult && (<div>
                        <p>User Found: {searchResult.otherUser}</p>            
                        <button onClick={startChat}>Start Chat</button>
                    </div>)}

                </div>
        </div>
    )
}