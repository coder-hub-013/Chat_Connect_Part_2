import { useEffect, useState } from 'react';
import './Web_chat_appbar.css'


export default function WebChatAppBar() {
    const [dimensions,setDimensions] = useState({
                width: window.innerWidth * 0.69,
                height: window.innerHeight * 0.07,
            });
        
    useEffect(() => {
                const handleResize = () => {
                    setDimensions({
                        width: window.innerWidth * 0.69,
                        height: window.innerHeight * 0.07,
                    });
                };
        
                window.addEventListener('resize',handleResize);
                return () => window.removeEventListener('resize',handleResize);
    },[])
    return(
        <div style={{width:`${dimensions.width}px`,height:`${dimensions.height}px`,}} className='web-chat-appbar web-profile-bar-container'>
            <div className='web-profile-bar-photo'>
                {/* <img alt="image"></img> */}
                <p>Name:</p>

                <div className=' mobile-chat-screen-rightIcons web-profile-bar-icon'>
                    <button className='iconButton web-chat-appbar-button'>
                        <span className="icon">Select</span>
                    </button>
                </div>
            </div>

            
        </div>
    )
}