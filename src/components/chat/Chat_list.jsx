import { useNavigate } from 'react-router-dom';
import './Chat_list.css'
import { useCallback, useEffect, useState } from 'react';
import { getSocket } from '../socket/SocketConnection';
import AddNewUserInGroup from './addUser/AddNewUserInGroup';

export default function Chatlist({id,closeChatBox}) {
    const socket = getSocket();
    let navigate = useNavigate();
    let url = "https://chat-connect-part-1.onrender.com";
    // let url = "http://localhost:8080";


    let [isMobile, setIsMobile] = useState(false);

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 850);
    },[]);

    useEffect(() => {
        if(typeof window !== 'undefined') {//window.innerWidth <= 850
            handleResize();
            window.addEventListener('resize',handleResize);
            return ()=> window.removeEventListener('resize',handleResize)
        }

    },[]);



    if(!socket) {
        return;
    }
    let [chat, setChat] = useState([]);
    let [message,setMessage] = useState('');//input message
    let [selectMessages,setSelectMessages] = useState(false);
    let [selectedMessages,setSelectedMessages] = useState([]);
    let [selectedMessagesReceiver,setSelectedMessagesReceiver] = useState(true);
    let [addUserInGroup,setAddUserInGroup] = useState(null);

    let [istyping,setIsTyping] = useState(false);

    const users = localStorage.getItem('frontData');
    if(!users) {
        navigate("/",{state:{errorMessage:"Something went wrong"}})
    } 
    const parseData = users?JSON.parse(users):null;
    let userId = parseData.user.id;

        const fetchChatHistory = useCallback(async() => {
            try {
                const users = localStorage.getItem('frontData');
                if(!users) {
                    navigate("/",{state:{errorMessage:"Something went wrong"}})
                } 
                const response = await fetch(`${url}/router/chat/${id}/messages`, {
                    method : "POST",
                    headers : {
                        'Content-type' : "application/json",
                    },
                    body : JSON.stringify({data:parseData.user.id}),
                    credentials : 'include'
                })
    
                const result = await response.json();

                if(response.status === 200) {
                    setChat(result);
                }else {
                    throw new Error("Something went wrong")
                }
            } catch (error) {
                navigate("/",{state:{errorMessage:"Something went wrong"}})
                console.error(error,"error");
            }
        },[parseData.user.id,id])


    useEffect(() => {
        console.log(parseData.user.id,id)
        socket.emit('activeChatId',{usersId:parseData.user.id,chatsId:id});
        fetchChatHistory();

        if(socket) {
            socket.on('newMessage',(messageData) => {
                if(messageData._id === id) {
                    setChat(messageData);
                }
            });

            socket.on('deleteNewMessage',(messageData) => {
                if(messageData._id === id) {
                    setChat(messageData);
                }
            });

            //userTyping
            socket.on('userTyping',({chatId,userId1}) => {
                if(chatId === id) {
                    if(userId1 !== parseData.user.id) {
                        setIsTyping(true);
                    }
                }
            });

            socket.on('userStopTyping',({chatId,userId1}) => {
                if(chatId === id) {
                    if(userId1 !== parseData.user.id) {
                        setIsTyping(false);
                    }
                }
            });

            socket.on('addNewUserInGroupFront',(messageData) => {
                if(messageData._id === id) {
                    setChat(messageData);
                }
            });

            socket.emit('markAsRead',{userId:parseData.user.id,chatId:id});
            socket.on('markAsReadByReceiver',(chat) => {
                if(chat._id === id) {
                    setChat(chat);
                }
            });//markAsReadByReceiver

        }
        return () => {
            if(socket) {
                socket.off('newMessage')
                socket.off('deleteNewMessage')
                socket.off('userTyping')
                socket.off('addNewUserInGroupFront')
                socket.off('markAsReadByReceiver')
            }
        };
    },[id,parseData.user.id,fetchChatHistory]);

    const sendMessage = (e) => {
        e.preventDefault();
        if(message.trim()) {
            socket.emit('sendMessage',{chatId:id,content:message,senderId:parseData.user.id});
            setMessage('');
            socket.emit('stopTyping',{chatId:id,userId1:parseData.user.id});

        }

    };
    if(chat.length == 0) {
        return <div>Loading...</div>
    }

    let handleSelectMessage = () => {
        if(selectMessages) {
            setSelectMessages(false)
        }else {
            setSelectMessages(true)
            setSelectedMessages([])
            setSelectedMessagesReceiver(true);
        }
    };

    let toggleMessageSelection = (messageId,senderId,deleted) => {

        if(selectedMessages.includes(messageId)) {
            setSelectedMessages(selectedMessages.filter(id => id !== messageId));
            setSelectedMessagesReceiver(true);

        } else {
            setSelectedMessages([...selectedMessages,messageId])
            if(senderId !== userId || deleted) {
                setSelectedMessagesReceiver(false);
            }
        }
    };

    let handleDeleteFromMe = async(e) => {
        e.preventDefault();
        if(selectedMessages.length > 0) {
            setSelectMessages(false);

            let response = await fetch(`${url}/router/deleteForMe`,{
                method:"POST",
                headers : {
                    'Content-type' : "application/json",
                },
                body:JSON.stringify({messagesIds:selectedMessages,chatId:id}),
                credentials : 'include'
            });

            let result = await response.json();
            // console.log(result);
            if(response.status === 200) {
                setSelectedMessages([])
                setChat(result);
            } else {
                navigate("/",{state:{errorMessage:result.message}})
            }

        } else {
            setSelectedMessages([])
            alert("Select at least one message")
        }

    };

    let handleDeleteFromEveryOne = async(e)=> {
        e.preventDefault();
        if(selectedMessages.length > 0) {
            setSelectMessages(false);
            socket.emit('deleteMessage',{chatId:id,messagesIds:selectedMessages,senderId:parseData.user.id});

        } else {
            setSelectedMessages([])
            alert("Select at least one message")
        }
    };

    let timeout = null;
    let handleTyping = () => {

        if(!timeout) {
            socket.emit('typing',{chatId:id,userId:parseData.user.id});
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            socket.emit('stopTyping',{chatId:id,userId:parseData.user.id});
            timeout = null;
        },3000);
    };

    let addNewUserInGroup = (id) => {
        setAddUserInGroup(id);
    };

    let handleCancleAddNewUserINGrop = () => {
        setAddUserInGroup(null)
    }

    // let handleCloseChat = (e) => {
    //     e.preventDefault();
    //     closeChatBox();
    //     socket.emit('activeChatIdClose',{usersId:parseData.user.id,chatsId:id});
    // }

    let handleCloseMobileChatScreen = (e) => {
        e.preventDefault();
        closeChatBox()
        socket.emit('activeChatIdClose',{usersId:parseData.user.id,chatsId:id});

    }

    const sender = chat.participants?.find(p => p.user._id !== userId);


    return(

        <div className="chat-list">
            {addUserInGroup && <AddNewUserInGroup handleCancleAddNewUserINGrop={handleCancleAddNewUserINGrop} id={id} userId={userId}></AddNewUserInGroup>}

            {console.log(chat)}
            <div className="chat-list-appBar">
                <div className="chat-list-leftIcons">
                    <button onClick={handleCloseMobileChatScreen} className="iconButton">
                    <span className="icon">back</span>
                    </button>
                </div>
                <div className="chat-list-title">
                    <span className="titleText">{chat.isGroupChat?chat.groupName:sender.user.username}</span>
                </div>
                <div className="chat-list-rightIcons">
                    <button className="iconButton" onClick={handleSelectMessage}>
                    <span className="icon">{!selectMessages?"Select":"Dont select"}</span>    
                    </button>
                    {chat.isGroupChat && <button 
                    onClick={() =>addNewUserInGroup(id)} className='iconButton'
                    >
                    <span className="icon">Add new user</span>  
                    </button>}
                </div>
            </div>

            <div className="chat-list-appBar">

                <div className='participant-name-span'>
                    Participants:
                        {chat.participants.map((participant) => (
                                <span className='participant-name' key={participant._id}>{participant.user.username}</span> 
                        ))}
                    </div>                    

            </div>

            {selectMessages&&<div className="chat-list-appBar">
                <div className="chat-list-rightIcons">
                    {selectMessages && <button className="iconButton" onClick={handleDeleteFromMe}>
                    <span className="icon">Delete From Me</span>    
                    </button>}
                    {selectMessages&& selectedMessagesReceiver && <button 
                    onClick={handleDeleteFromEveryOne} className='iconButton'
                    >
                    <span className="icon">Delete from everyone</span>  
                    </button>}
                </div>
            </div>}

            <div>   


                <div className="chat-list-container">
                    {chat?.messages?.length > 0?
                        (chat.messages.filter(message => new Date(message.createdAt) >= new Date(chat.participants.find(p => p.user._id === userId)?.joinedAt))
                        .map((message) => (
                            !message.deletedBy.includes(userId) && (
                                <div className={`chat-list-card ${message.sender._id === userId ? 'sent':'received'}`} key={message._id}>
                                    <div className='message-content'>
                                            {chat.isGroupChat &&<div><p>Sender:{message.sender.username}</p></div>}
                                            
                                            <div className='chat-list-messageText'>
                                                <p>{message.content}</p> 
                                                {message.deleted && 
                                                    <div className='chat-list-dateRow'>
                                                        <p className='chat-list-deleted-icon'>deleted</p>
                                                    </div>
                                                }                   
                                            </div>

                                            <div className="chat-list-dateRow">
                                                {selectMessages?<input className='chat-list-dateText' type="checkbox" onChange={() => toggleMessageSelection(message._id,message.sender._id,message.deleted)}></input>:""}
                                                {message.allUserRead && message.sender._id === userId &&<span className='chat-list-icon'>check</span>}
                                            </div>
                                    </div>          
                                </div>
                            )
                        )))
                    :(<div className='no-messages'>No message yet:</div>)}
                    {/* className={`${!result ? 'view-chat-btn-unread' : 'view-chat-btn'}`} */}
                    {console.log(isMobile)}
                    <div className={`${isMobile?'chat-list-textInput' :'web'} `}>
                        <input type='text'
                                value={message} 
                                placeholder="Type a message"
                                onChange={(e) => {setMessage(e.target.value); handleTyping();}}
                        >
                        </input>
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div> 
            </div>
        </div>
        
    )
}


                // {/* <Chatlist id={mobileChatScreenShow}></Chatlist> */}






        // <div className="chat-list-container">
        //             {chat?.messages?.length > 0?
        //                 (chat.messages.filter(message => new Date(message.createdAt) >= new Date(chat.participants.find(p => p.user._id === userId)?.joinedAt))
        //                 .map((message) => (
        //                     !message.deletedBy.includes(userId) && (
        //                         <div className={`chat-list-card ${message.sender._id === userId ? 'sent':'received'}`} key={message._id}>
        //                             <div className='message-content'>
        //                                     {chat.isGroupChat &&<div><p>Sender:{message.sender.username}</p></div>}
                                            
        //                                     <div className='chat-list-messageText'>
        //                                         <p>{message.content}</p> 
        //                                         {message.deleted && 
        //                                             <div className='chat-list-dateRow'>
        //                                                 <p className='chat-list-deleted-icon'>deleted</p>
        //                                             </div>
        //                                         }                   
        //                                     </div>

        //                                     <div className="chat-list-dateRow">
        //                                         {selectMessages?<input className='chat-list-dateText' type="checkbox" onChange={() => toggleMessageSelection(message._id,message.sender._id,message.deleted)}></input>:""}
        //                                         {message.allUserRead && message.sender._id === userId &&<span className='chat-list-icon'>check</span>}
        //                                     </div>
        //                             </div>          
        //                         </div>
        //                     )
        //                 )))
        //             :(<div className='no-messages'>No message yet:</div>)}
        //     <div className="chat-list-textInput">
        //         <input type='text'
        //                 value={message} 
        //                 placeholder="Type a message"
        //                 onChange={(e) => {setMessage(e.target.value); handleTyping();}}
        //         >
        //         </input>
                       
        //         <button onClick={sendMessage}>Send</button>
        //     </div>
        // </div>





            // {/* {info.map((a,index) => {
            //     return(
            //         <div key={index} className="chat-list-card chat-list-true">
            //             <div className="chat-list-messageText">
            //                 <p className="">{a.message}</p>
            //             </div>

            //             <div className="chat-list-dateRow">
            //                 <span className="chat-list-dateText">Date</span>
            //                 <span className="chat-list-icon">check</span>
            //             </div>
                        
            //         </div>
            //     )
            // })} */}