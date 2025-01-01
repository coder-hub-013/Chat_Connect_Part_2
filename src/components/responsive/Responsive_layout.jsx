import { useEffect, useState } from "react"
import MobileScreenLayout from "../screens/Mobile_screen_layout";
import WebScreenLayout from "../screens/Web_screen_layout";

export default function ResponsiveLayout() {
    let [isMobile, setIsMobile] = useState(window.innerWidth <= 850);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 900);
        };
        window.addEventListener('resize',handleResize);

        return ()=> window.removeEventListener('resize',handleResize)
    },[]);
    return(
        <div>
            {isMobile ? <MobileScreenLayout />: <WebScreenLayout />}
        </div>
    )

}