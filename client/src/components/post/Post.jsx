import './post.scss';
import { format } from 'timeago.js';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { postFail, postStart, postSuccess, likes, deletePost, delImg, postUpdate } from '../../redux/postSlice';
import { io } from 'socket.io-client';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Comments from '../comments/Comments';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReplyIcon from '@mui/icons-material/Reply';
import WarningPost from '../warningPost/WarningPost';
import IsLoading from '../loading/IsLoading';
import EditPost from '../editPost/EditPost';

function Post({ post, socket , postDetail}) {
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        withCredentials: true,
        headers: {
            'Content-type': 'application/json',
        },
    });
    const { currentUser } = useSelector((state) => state.user);
    const { currentPost } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    ////// user ///////////
    const noAvatar = process.env.REACT_APP_PUBLIC_FOLDER + 'no_avatar1.jpg';
    const [user, setUser] = useState([]);

    const [onePost, setOnePost] = useState({});
    const [like, setLike] = useState(0);
    const [openMenuPost, setOpenMenuPost] = useState(false);
    //warning
    const [openWarningPost, setOpenWarningPost] = useState(false);
    // edit post
    const [openEditPost, setOpenEditPost] = useState(false);
    const [text, setText] = useState('');
    const [img, setImg] = useState(undefined);
    const [inputs, setIputs] = useState({});
    ///cmt
    const [focusCmt, setFocusCmt] = useState(false);
    useEffect(() => {
        //fecth user
        const fecthUser = async () => {
            try {
                const res = await axiosInstance.get(`/user/find/${post?.userId}`);
                const onePost = await axiosInstance.get(`/post/find/v1/${post?._id}`);
                setUser(res.data);
                setOnePost(onePost.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fecthUser();
    }, [post?.userId, post?._id]);
    ////////////////////////
    /////////Post///////////

    //detele post
    const handleDelete = () => {
        const fectchDelete = async () => {
            try {
                await axiosInstance.delete(`/post/delete/${post?._id}`);
                dispatch(deletePost(post?._id));
                alert('Post deleted successfully!!');
                handleDeleteImgFormFirebase(post?.imgPost);
                setOpenMenuPost(false);
                setOpenWarningPost(false);
                navigate('/newpost');
            } catch (error) {
                setOpenMenuPost(false);
                setOpenMenuPost(false);
                setOpenWarningPost(false);
            }
        };
        fectchDelete();
    };
    const handleDeleteImgFormFirebase = (img) => {
        ///imgfile
        const storage = getStorage();
        const httpsReference = ref(storage, img);
        const desertRef = ref(storage, httpsReference);
        deleteObject(desertRef)
            .then(() => {
                console.log('Img deleted successfully');
                dispatch(
                    delImg({
                        postId: post._id,
                        imgPost: '',
                    }),
                );
            })
            .catch((error) => {
                console.log('Error', error);
            });
    };

    //like post
    const handleLike = (type) => {
        socket?.emit('sendNotification', {
            senderId: currentUser._id,
            receiverId: post.userId,
            senderName: currentUser.username,
            senderImg: currentUser.userImg,
            type: type,
        });
        const fetchLikePost = async () => {
            try {
                currentPost?.map(async (post, index) => {
                    //socket handle like

                    if (post?._id === onePost._id) {
                        if (post?.like.includes(currentUser._id)) {
                            await axiosInstance.put(`/post/dislike?q=${onePost._id}`);

                            await axiosInstance.delete(`/notification/del/${post.userId}/${post._id}/1`);

                            setLike(like - 1);
                        } else {
                            await axiosInstance.put(`/post/like?q=${onePost._id}`);
                            if (currentUser._id != post.userId) {
                                await axiosInstance.post(`/notification/create`, {
                                    senderId: currentUser._id,
                                    receiverId: post.userId,
                                    senderName: currentUser.username,
                                    senderImg: currentUser.userImg,
                                    type: type,
                                    postImg: post.imgPost,
                                    decs: post.desc,
                                    postId: post._id,
                                });
                            }
                            setLike(like + 1);
                        }
                    }
                });
                dispatch(likes({ userId: currentUser._id, postId: onePost._id }));
            } catch (err) {
                console.log('Error', err);
            }
        };

        fetchLikePost();
    };
    const handleOpenWarning = () => {
        setOpenWarningPost(true);
        setOpenMenuPost(false);
    };

    const handleEditPost = () => {
        const fetchEdit = async () => {
            try {
                const res = await axiosInstance.put(`/post/update/${post?._id}`, {
                    desc: text,
                    imgPost: inputs.imgPost,
                });
                dispatch(
                    postUpdate({
                        postId: post._id,
                        desc: text,
                        imgPost: inputs.imgPost,
                    }),
                );
                setOpenMenuPost(false);
                setOpenEditPost(false);
                window.location.reload();
            } catch (error) {
                console.log(error.message);
                alert('You can just update your post!');
            }
        };
        fetchEdit();
    };
    const handleDelImg = () => {
        handleDeleteImgFormFirebase(post.imgPost || inputs.imgPost);
        const fetchEdit = async () => {
            try {
                const res = await axiosInstance.put(`/post/update/${post?._id}`, {
                    imgPost: '',
                });
                dispatch(
                    delImg({
                        postId: post._id,
                        postData: res.data,
                        postImg: '',
                    }),
                );
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchEdit();
    };

    return (
        <>
            <div className="post-container">
                <div className="post-wapper">
                    {openWarningPost && (
                        <WarningPost
                            openWarningPost={openWarningPost}
                            setOpenWarningPost={setOpenWarningPost}
                            handleDelete={handleDelete}
                        />
                    )}
                    {openEditPost && (
                        <EditPost
                            img={img}
                            setImg={setImg}
                            setText={setText}
                            text={text}
                            setOpenEditPost={setOpenEditPost}
                            openEditPost={openEditPost}
                            handleEditPost={handleEditPost}
                            setIputs={setIputs}
                            inputs={inputs}
                            postImg={post.imgPost}
                            handleDelImg={handleDelImg}
                            post={post}
                            postDesc={post.desc}
                            setOpenMenuPost={setOpenMenuPost}
                        />
                    )}

                    <div className="post-items">
                        <div className="user-info">
                            <div className="user">
                                <Link to={`/profile/${user._id}`}>
                                    {' '}
                                    <img className="user-img" src={user.userImg || noAvatar} alt="" />
                                </Link>
                                <div className="name">
                                    <Link to={`/profile/${user._id}`} style={{ textDecoration: 'none' }}>
                                        <span>{user.username}</span>
                                    </Link>
                                    <div className="time">{format(post?.createdAt)}</div>
                                </div>
                            </div>
                            <div className="option">
                                <button
                                    onClick={() => setOpenMenuPost(!openMenuPost)}
                                    // onBlur ={()=>setOpenMenuPost(false)}
                                >
                                    {openMenuPost ? <CloseIcon /> : <DragIndicatorIcon fontSize="large" />}
                                </button>
                                {openMenuPost && (
                                    <div className="option-menu">
                                        {currentPost?.some(
                                            (post) => post._id === onePost?._id && post.userId === currentUser._id,
                                        ) || currentUser.admin ? (
                                            <>
                                                <span onClick={handleOpenWarning}>Delete </span>
                                                <span onClick={() => setOpenEditPost(true)}>Edit</span>
                                                <span>Report</span>
                                            </>
                                        ) : (
                                            <span>Report</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="line"></div>
                        <span className="desc">{post?.desc}</span>
                        <div className="post-img">
                            {post?.imgPost ? (
                                <>
                                    <img className="img" src={post.imgPost} alt={post.imgPost} />
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="post-info">
                            {!currentPost?.some(
                                (postId) => postId?._id === onePost?._id && postId?.like?.includes(currentUser._id),
                            ) ? (
                                <span className="like-count">{post?.likes + like} like </span>
                            ) : (
                                <span className="like-count">{post?.likes + like} like and you </span>
                            )}
                            <span className="comment-count">{post?.commentCount} comment</span>
                            <span className="share-count">3 share</span>
                        </div>
                        <div className="line"></div>
                        <div className="post-action">
                            <div className="action-btn">
                                <button className="likeBtn" onClick={() => handleLike(1)}>
                                    {currentPost?.some(
                                        (post) => post?._id === onePost?._id && post?.like?.includes(currentUser._id),
                                    ) ? (
                                        <span style={{ backgroundColor: 'rgb(238, 78, 142', color: 'white' }}>
                                            <FavoriteIcon />
                                            Liked
                                        </span>
                                    ) : (
                                        <span>
                                            <FavoriteBorderIcon />
                                            Like
                                        </span>
                                    )}
                                </button>

                                <button className="likeBtn" onClick={() => setFocusCmt(true)}>
                                    <span>
                                        <ChatBubbleOutlineIcon />
                                        Comment
                                    </span>
                                </button>
                                <button className="likeBtn">
                                    <span>
                                        <ReplyIcon />
                                        Share
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="line"></div>

                        <Comments postDetail={postDetail} post={post} socket={socket} focusCmt={focusCmt} setFocusCmt={setFocusCmt} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Post;
