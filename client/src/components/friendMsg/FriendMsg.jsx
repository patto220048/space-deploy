import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './friendMsg.scss'
import axiosInstance from "../../instance/instance"
import { noAvatar, noBg} from "../../instance/imgAvatar"

function FriendMsg({conversation}) {
    const  {currentUser} = useSelector((state) => state.user)
   
    const [user, setUser] = useState(null)


    useEffect(()=>{
        const friendId = conversation.members.find(m => m !== currentUser._id)
        const getUser = async () =>{
            try {
                const res = await axiosInstance.get(`/user/find/${friendId}`)
                setUser(res.data)             
            } catch (err) {
                console.log(err.message)
            }
        }
        getUser()
    },[currentUser, conversation])

    return ( 
        <div className="friendMsg-container">
            <div className="items">
                
                <img src={user?.userImg || noAvatar } alt="" />
               <div className="last-msg">
                    <span>{user?.username }</span>
           
               </div>
                
            </div>
        </div>
     );
}

export default FriendMsg;