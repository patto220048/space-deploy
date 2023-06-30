import './chat.scss'
import { format } from 'timeago.js'; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import axiosInstance from "../../instance/instance"

function Chat({message,owner, friendId}) {
    const [user,setUser] = useState([])
    const  {currentUser} = useSelector((state) => state.user)
    const noAvatar = process.env.REACT_APP_PUBLIC_FOLDER || process.env.REACT_APP_PUBLIC_FOLDER_SSL + "no_avatar1.jpg" 
    useEffect(()=>{
        const fetchUser = async() =>{
            try {
                const res = await axiosInstance.get(`/user/find/${friendId}`)
                setUser(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchUser()
    },[friendId])
    return ( 
            <div className={owner ? "contents owner" :"contents" }>
                <div className= "item">
                    <img src={owner ? (currentUser.userImg || noAvatar ):(user.userImg || noAvatar )  }/>
                    <div className="message">
                        <p className="msg">{message.text}</p>
                        <span className="time">{format(message.createdAt)}</span>
                    </div>
                </div>
            </div>
     );
}

export default Chat;    