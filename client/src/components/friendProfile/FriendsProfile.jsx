import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './friendsProfile.scss'
import axiosInstance from "../../instance/instance"
import { noAvatar, noBg} from "../../instance/imgAvatar"


function FriendsProfile({friendId}) {
    const [user, setUser] = useState({})
    
    useEffect(()=>{
        const fecthUser = async()=>{
            
            try{
                const res = await axiosInstance.get(`/user/find/${friendId}`)
                setUser(res.data)
            }
            catch(err){
                console.log(err.message);
            }
        }
        fecthUser()

    },[friendId])

    return ( 
        <>
            <div className="friends-items">
                <Link to = {`/profile/${user._id}`} style={{textDecoration:'none'}}>                     
                    <div className="items">
                        <img src={user.userImg || noAvatar} alt="" />  
                        <h1>{user.username}</h1>
                    </div>
                </Link> 
            </div>  
            {user.friend?.length > 6 && <span className='more'>. . . More</span>}
        </>
     );
}

export default FriendsProfile;