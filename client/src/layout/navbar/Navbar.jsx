import './navbar.scss';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import Search from '../../components/search/Search';
import { async } from '@firebase/util';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
function Navbar({setOpenSideBarMb, openSideBarMb, openRightbar, setOpenRightbar }) {
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        withCredentials: true,
        headers: {
            'Content-type': 'application/json',
        },
    });
    const { currentPost } = useSelector((state) => state.post);
    const [openNotifi, setOpenNotifi] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const noAvatar = process.env.REACT_APP_PUBLIC_FOLDER + 'no_avatar1.jpg';
    const logo = process.env.REACT_APP_PUBLIC_FOLDER + 'logo.png';
    useEffect(() => {
        const fectchNotifi = async () => {
            try {
                const res = await axiosInstance.get(`/notification/get`);
                setNotifications(res.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fectchNotifi();
    }, []);

    const handleCloseNot = async () => {
        setOpenNotifi(false);
        try {
            await axiosInstance.delete(`/notification/delAll`);
        } catch (err) {
            console.log(err.message);
        }
        setNotifications([]);
    };
    const displayNotifications = (type) => {
        let action;
        if (type === 1) {
            action = 'liked your post';
        } else if (type === 2) {
            action = 'commented your post';
        } else if (type === 3) {
            action = 'followed you';
        }

        return action;
    };

    const handleOpenNotifications = () => {
        setOpenNotifi(!openNotifi);
    };
    const isSideBarMb = () =>{
        setOpenSideBarMb(!openSideBarMb)
    }

    return (
        <div className="nav-container">
            <div className="navbar">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 className="logo">
                        <img src={logo} alt="" />
                        SPACE
                    </h1>
                </Link>
                <div className="mobile-menu">
                    <span onClick={isSideBarMb}>
                        <DensityMediumIcon />
                    </span>
                </div>
                <Search />
                <div className="mobile-menu">
                    <span onClick={() => setOpenRightbar(!openRightbar)}>
                        <PeopleAltIcon />
                    </span>
                </div>

                <div className="nav-items">
                    <div className="nav-user">
                        <div className="nav-link">
                            <span className="nav-link-btn">
                                <MessageRoundedIcon />
                            </span>
                            <span className="count-left">1</span>
                            <span className="nav-link-btn" onClick={handleOpenNotifications}>
                                <NotificationsIcon />
                            </span>
                            <span className="count-right">{notifications?.length}</span>
                        </div>
                        {notifications.length === 0 ? (
                            ''
                        ) : (
                            <div className="notifi-options">
                                {openNotifi && (
                                    <>
                                        <div className="notifi-items">
                                            {notifications?.map((notification, index) => (
                                                <div key={index}>
                                                    <div className="items">
                                                        <Link
                                                            to={`/profile/${notification.senderId}`}
                                                            onClick={() => setOpenNotifi(false)}
                                                        >
                                                            <img src={notification.senderImg || noAvatar} alt="" />
                                                        </Link>
                                                        <p>
                                                            <Link
                                                                to={`/profile/${notification.senderId}`}
                                                                style={{ textDecoration: 'none' }}
                                                                onClick={() => setOpenNotifi(false)}
                                                            >
                                                                <span>{notification.senderName}</span>
                                                            </Link>
                                                            {displayNotifications(notification.type)}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        to={`/post/${notification.postId}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <div className="mini-post">
                                                            {notification.postImg ? (
                                                                <>
                                                                    <img src={notification.postImg} alt="" />
                                                                    <span>{notification.decs}</span>
                                                                </>
                                                            ) : (
                                                                <span>{notification.decs}</span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="btn">
                                            <button className="close-btn" onClick={handleCloseNot}>
                                                Delete all
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
