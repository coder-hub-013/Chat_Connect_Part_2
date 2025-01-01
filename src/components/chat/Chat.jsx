import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getSocket } from "../socket/SocketConnection";
import MobileChatScreen from "../screens/Mobile_chat_screen";
import Chatlist from "./Chat_list";
import './Chat.css'


export default function Chat({isMobile,showChatMessage,hideMobileBar,showMobileBar,webChatScreenShow}) {
    let [chats, setChats] = useState([]);
    let navigate = useNavigate();
    let url = "https://chat-connect-part-1.onrender.com";
//    let url = "http://localhost:8080";


    let [showChatList,setShowChatList] = useState(null);

    useEffect(() => {
        const users = localStorage.getItem('frontData');
        if(!users) {
            navigate("/",{state:{errorMessage:"You are not login"}})
            return
        }
        const parseData = JSON.parse(users);
        const userId = parseData.user.id
    },[]);

    const users = localStorage.getItem('frontData');
    console.log(users)
        if(!users) {
            navigate("/",{state:{errorMessage:"You are not login"}})
            return
        }
        const parseData = JSON.parse(users);
        if(!parseData) {
            navigate("/",{state:{errorMessage:"You are not login"}})
            return

        }
        const userId = parseData?.user?.id
        if(!userId) {
            navigate("/",{state:{errorMessage:"You are not login"}})
            return
        }



    useEffect(() => {

        const socket = getSocket();
        if(!socket) {
            return;
        }
        let fetchChatHistory = async () => {
            const response = await fetch(`${url}/router/chats`, {
                method : "POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body : JSON.stringify({data:parseData.user.id}),
                credentials : 'include'
            })
            const result = await response.json();
            if(response.status == 200) {
                const sortedChats = [...result].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setChats(sortedChats);
            } else {
                navigate('/',{state:{errorMessage:result.message}})
            }
        }
    
        fetchChatHistory();                 
        
        if(socket) {
            socket.on('updateChatList',(receiverDetails) => {
                setChats((prevChats) => {
                    const index = prevChats.findIndex((chat) => chat._id === receiverDetails._id);
                    if(index !== -1) {
                        prevChats[index] = {...prevChats[index], ...receiverDetails};
                    } else {
                        prevChats.push(receiverDetails);
                    }
                    return [...prevChats].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                });

                // setChats((prevChat) =>  [...prevChat,...receiverDetails]);
            });
            return () => {
                socket.off('updateChatList');
            }
        }

    },[parseData.user.id])

    // let handleViewChat = (chat_id) => {
    //     getChatId(chat_id)
    // }
 
    const checkUserIdInNestedData = (data, targetId) => {
        return data.every(subArray => 
           subArray.some(item => item.user === targetId)
        );
 
        // return data.some(subArray => 
        //     subArray.some(item => item.user === targetId)
        //   );
    }


    useEffect(() => {
        console.log('i ma')
        setShowChatList(showChatMessage)

    },[showChatMessage])

    let showChatScreen = (id) => {
        console.log(id);
        setShowChatList(id)
    }
    let closeShowChatScreen = () => {
        setShowChatList(null);
    }
    let showWebChatScreen = (id) => {
        webChatScreenShow(id)
    }

    if(isMobile && showChatList) {
        return(
            <div>
                <Chatlist id={showChatList} closeChatBox={closeShowChatScreen} />
            {/* <MobileChatScreen mobileChatScreenShow={mobileChatScreenShow} closeMobileScreeen={closeMobileScreeen} /> */}
            </div>
        )
    };

    return(
            <div>
                {chats.length > 0 ? chats.map(chat => {
                    const sender = chat.participants?.find(p => p.user._id !== userId);
                        let data = chat.messages?.map((b) => {
                            return b.readBy.map((c) => {
                                return c;
                            });
                        })
                    const result = checkUserIdInNestedData(data, userId);
                    console.log(result,'-');

                    return(
                        <div key={chat._id} className="contact-list-container">
                            {/* <img alt="image"></img> */}
                            <div className="contact-list-title">
                                <div className="contact-list-leading">
                                    <h4 className="username">{chat.isGroupChat?chat.groupName:sender?.user.username || "Unknown"}</h4>
                                </div>

                            </div>     

                            {isMobile ? <button className={`${!result ? 'view-chat-btn-unread' : 'view-chat-btn'}`} onClick={() => showChatScreen((chat._id))}>Click</button> :  
                            <button className={`${!result ? 'view-chat-btn-unread' : 'view-chat-btn'}`} onClick={() => showWebChatScreen((chat._id))}>View Chat</button> }

                        </div>
                    )   
                }):<div className="no-chats">No USERS are there Firstly start the chat</div>}
            </div>
    )
}