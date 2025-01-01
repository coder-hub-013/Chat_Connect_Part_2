import { useNavigate } from "react-router-dom";
import Chatlist from "../chat/Chat_list";
import './Mobile_chat_screen.css'
import { useCallback, useEffect, useState } from "react";

export default function MobileChatScreen({closeMobileScreeen,mobileChatScreenShow}) {
     
    let handleCloseMobileChatScreen = () => {
        closeMobileScreeen()
    }
    return(
        <div className="mobile-chat-screen">
            <div className="mobile-chat-screen-appBar">
            <div className="mobile-chat-screen-leftIcons">
                <button className="iconButton">
                    <span className="icon" onClick={handleCloseMobileChatScreen}>back</span>
                </button>
            </div>
            <div className="mobile-chat-screen-title">
                <span className="titleText">Title</span>
            </div>
            <div className="mobile-chat-screen-rightIcons">
                <button className="iconButton">
                    <span className="icon">Select</span>
                </button>
            </div>
            </div>
            <div>            
                <Chatlist id={mobileChatScreenShow}></Chatlist>
            </div>
        </div>
    )
}