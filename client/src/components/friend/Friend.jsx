import './friend.scss'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from 'react';
import FriendsProfile from '../friendProfile/FriendsProfile';
import axios from 'axios';
import FriendPage from '../friendPage/FriendPage';
import { Link } from 'react-router-dom';
import axiosInstance from "../../instance/instance"
import { noAvatar, noBg} from "../../instance/imgAvatar"

function Friend({friendId}) {
    const [user, setUser] = useState({})
    useEffect(()=>{

        const fetchUser = async() =>{
            try {
                const res = await axiosInstance.get(`/user/find/${friendId}`)
                setUser(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchUser()

    },[friendId])

    return (
        <div className="friend-wapper">
        <div className="friend-items">
            <img src={user.userCoverImg || noBg } alt="" className="bg" />
            <Link to={`/profile/${friendId}`} style={{textDecoration:'none'}}>
                <img src={user.userImg || noAvatar} alt="" className="avatar" />
                <h1>{user.username}</h1>
            </Link>
            <div className="info">
                <span className='info-items'>follower {user.follower?.length}</span>
                <span className='info-items'>post {user.postCount} </span>
                <span className='info-items'>following {user.flowing?.length}  </span>
            </div>
            <div className="friend">
                {user.friend?.map((friendId,i)=>(
                    <FriendPage friendId={friendId} key={i}/>
                ))}
            </div>
        </div>   
       
    </div>         
    );
}

export default Friend;