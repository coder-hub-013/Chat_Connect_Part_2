import './Web_search_bar.css'
import { useEffect, useState } from "react";

export default function WebSearchBar() {
    const [dimensions,setDimensions] = useState({
            height:window.innerHeight * 0.06,
            width: window.innerWidth * 0.25,
        });
    
        useEffect(() => {
            const handleResize = () => {
                setDimensions({
                    height:window.innerHeight * 0.007,
                    width: window.innerWidth * 0.25,
                });
            };
    
            window.addEventListener('resize',handleResize);
            return () => window.removeEventListener('resize',handleResize);
        },[])
    return(
        <div className="web-search-bar" style={{width:`${dimensions.width}px`,height:`${dimensions.height}px`,}}>
            <input placeholder='Search or start new chat'></input>
        </div>
    )
}