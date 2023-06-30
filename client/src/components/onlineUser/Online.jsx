import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './online.scss'
import axiosInstance from "../../instance/instance"
import { noAvatar, noBg} from "../../instance/imgAvatar"

function Online({users}) {
    const [friend, setFriend] = useState({})
    const  {currentUser} = useSelector((state) => state.user)
 
    useEffect(()=>{
        const fecthUser = async()=>{
            try{
                const res = await axiosInstance.get(`/user/find/${users}`)
                setFriend(res.data)
          

            }
            catch(err){
                console.log(err.message);
            }
        }
        fecthUser()
    },[users])

    
    return ( 
        <>
            { currentUser.friend.includes(friend?._id) &&
            <Link to = {`/profile/${friend._id}`} style={{textDecoration:'none'}}>
            <div className="online-items">
                <img className="online-img" src={friend.userImg || noAvatar} alt="" />
                <span className="online-name">{friend.username}</span>
                <span className="status"></span>
            </div>
            </Link>
            }
        </>
     );
}

export default Online;