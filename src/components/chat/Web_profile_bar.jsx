import { useEffect, useState } from 'react'
import './Web_profile_bar.css'
import SearchUser from './addUser/SearchUser';
import CreateGroup from './addUser/CreateGroup';
import { useNavigate } from 'react-router-dom';


export default function WebProfileBar({showChatWebMessage}) {
    let navigate = useNavigate();
    const [dimensions,setDimensions] = useState({
        height:window.innerHeight * 0.077,
        width: window.innerWidth * 0.25,
    });
    let [createGroup,setCreateGroup] = useState(false);
    let [createNewUser,setCreateNewUser] = useState(false);
    // let [showChatMessage,setShowChatMessage] = useState(null);

    const users = localStorage.getItem('frontData');
    if(!users) {
        return navigate("/",{state:{errorMessage:"You are not login"}})
    }
    let parseData = JSON.parse(users);
    let userId = parseData.user.id;


    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height:window.innerHeight * 0.077,
                width: window.innerWidth * 0.25,
            });
        };

        window.addEventListener('resize',handleResize);
        return () => window.removeEventListener('resize',handleResize);
    },[])

    let handleCreateGroup = (e) => {
        e.preventDefault();
        setCreateGroup(true);
    };
    let CancleGroupCreated = () => {
        setCreateGroup(false);
    };
    let GroupCreated = (result) => {
        setCreateGroup(false);
        showChatWebMessage(result.newGroupChat._id)
        // setShowChatMessage(result.newGroupChat._id);
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
        // setShowChatMessage(chatId)
        showChatWebMessage(chatId)
        setCreateNewUser(false);
    }


    return(
        <div style={{width:`${dimensions.width}px`,height:`${dimensions.height}px`,}} className="web-profile-bar-container">
            <div className='web-profile-bar-photo contact-list-appbars'>
                {/* <h3>Circle</h3> */}
                <div className='web-profile-bar-icon'>
                    <p><button onClick={handleCreateGroup}>Create Group</button></p>
                    <p><button onClick={handleCreateNewUser}>Create new chat</button> </p>
                </div>
            </div>

            {createNewUser && <SearchUser onSelectUser={onSelectUser} CancleSearch={CancleSearch} />}
            {createGroup && <CreateGroup GroupCreated={GroupCreated} CancleGroupCreated={CancleGroupCreated} userId={userId} />}
            

        </div>

    )
}