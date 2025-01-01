import { useCallback, useEffect, useState } from "react";
import './Contacts_list.css'
import MobileChatScreen from "../screens/Mobile_chat_screen";
import { useLocation, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import SearchUser from "./addUser/SearchUser";
import CreateGroup from "./addUser/CreateGroup";
import NotificationContainer, { triggeredNotification } from "../../Notification/NotificationContainer";


export default function Contacts_list() {
    let navigate = useNavigate();
    const location = useLocation();
    // let url = "http://localhost:8080";
    let url = "https://chat-connect-part-1.onrender.com";

    let [isMobile, setIsMobile] = useState(false);
    let [createGroup,setCreateGroup] = useState(false);
    let [createNewUser,setCreateNewUser] = useState(false);
    let [showChatMessage,setShowChatMessage] = useState(null);

    const users = localStorage.getItem('frontData');
    if(!users) {
        return navigate("/",{state:{errorMessage:"You are not login"}})
    }
    let parseData = JSON.parse(users);
    let userId = parseData.user.id;


    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 900);
    },[]);

    useEffect(() => {
        if(typeof window !== 'undefined') {//window.innerWidth <= 850
            handleResize();
            window.addEventListener('resize',handleResize);
            return ()=> window.removeEventListener('resize',handleResize)
        }

    },[]);

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

    let handleCreateGroup = (e) => {
        e.preventDefault();
        setCreateGroup(true);
    };
    let CancleGroupCreated = () => {
        setCreateGroup(false);
    };
    let GroupCreated = (result) => {
        setCreateGroup(false);
        setShowChatMessage(result.newGroupChat._id);
    };
    let handleCreateNewUser = (e) => {
        e.preventDefault();
        setCreateNewUser(true);
    };
    let CancleSearch = () => {
        setCreateNewUser(false);
    };
    const onSelectUser = (result) => {
        // console.log(result);
        const chatId = result.chat._id;
        setShowChatMessage(chatId)
        setCreateNewUser(false);
    }

    let hideMobileBar = () => {
        setIsMobile(false);
    }
    let showMobileBar = () => {
        setIsMobile(true);
    }


    return(
        <div className="contact-list">
            <NotificationContainer />

           { isMobile && <div className="contact-list-appbars">
                <p>Chat-Connect</p>
                <div>
                    <button onClick={handleCreateGroup}>Create Group</button>
                    <button onClick={handleCreateNewUser}>Create new chat</button>
                </div>
            </div>}
            {createNewUser && <SearchUser onSelectUser={onSelectUser} CancleSearch={CancleSearch} />}
            {createGroup && <CreateGroup GroupCreated={GroupCreated} CancleGroupCreated={CancleGroupCreated} userId={userId} />}
            <Chat showMobileBar={showMobileBar} hideMobileBar={hideMobileBar} showChatMessage={showChatMessage} isMobile={isMobile}></Chat>

        </div>
    )
}

