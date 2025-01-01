import { useEffect, useState } from "react";
import Contacts_list from "../chat/Contacts_list";
import WebProfileBar from "../chat/Web_profile_bar";
import WebSearchBar from "../chat/Web_search_bar";
import './Web_screen_layout.css'
import WebChatAppBar from "../chat/Web_chat_appbar";
import Chatlist from "../chat/Chat_list";
import Chat from "../chat/Chat";
import NotificationContainer, { triggeredNotification } from "../../Notification/NotificationContainer";
import { useLocation, useNavigate } from "react-router-dom";

export default function WebScreenLayout() {
    let navigate = useNavigate();
    let location = useLocation();

        const [dimensions,setDimensions] = useState({
            width: window.innerWidth * 0.75,
        });

        let [showChatMessages,setShowChatMessage] = useState(false);
        let [webChatId,setWebChatId] = useState(null);
    
        useEffect(() => {
            const handleResize = () => {
                setDimensions({
                    width: window.innerWidth * 0.75,
                });
            };
    
            window.addEventListener('resize',handleResize);
            return () => window.removeEventListener('resize',handleResize);
        },[])

        let handleShowMessage = () => {
            setShowChatMessage(true)
        }
        let closeChatBox = () => {
            setShowChatMessage(false)
        }

        let webChatScreenShow = (id) => {
            console.log(id)
            setWebChatId(id);
            setShowChatMessage(true)
        }
        let showChatWebMessage = (id) => {
            setWebChatId(id);
            setShowChatMessage(true)
        }

            useEffect(() => {
        
                if(location.state && location.state.errorMessage) {
                    triggeredNotification(location.state.errorMessage,"error");
                    navigate("/chat", {state:{}})
                }
        
                if(location.state && location.state.successMessage) {
                    triggeredNotification(location.state.successMessage,"success");  
                    navigate("/chat", {state:{}})
                }
        
                if(location.state && location.state.loginMessage) {
                    triggeredNotification(location.state.loginMessage,"login");  
                    navigate("/chat", {state:{}})  
                }
            }, [location.state])
    return(
        <div className="web-screen-layout-container">
            <NotificationContainer />
            <div className="web-screen-layout-container-list">
                    <WebProfileBar showChatWebMessage={showChatWebMessage} />
                    <WebSearchBar /> 
                    <Chat webChatScreenShow={webChatScreenShow} />
                    {/* <div onClick={handleShowMessage}> </div> */}
            </div>
            {showChatMessages && <div className="web-screen-layout-messages" style={{width:`${dimensions.width}px`}}>
                <div className="web-screen-layout-message-webbar">
                    {/* <WebChatAppBar />  */}
                    <Chatlist id={webChatId} closeChatBox={closeChatBox} />
                    {/* <div className="web-screen-layout-input-container">
                        <div className="mobile-chat-screen-textInput">
                            <input placeholder="Type a message"></input>
                        <button>Send</button>
                        </div>
                    </div> */}
                </div>
            </div>}
        </div>
    )
}