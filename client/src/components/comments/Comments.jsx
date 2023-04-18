import './comments.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Comment from '../comment/Comment';
import ReactLoading from 'react-loading';
import SendIcon from '@mui/icons-material/Send';
import Other from '../other/Other';
import Wapper from '../wapper/Wapper';
import { Link } from 'react-router-dom';
import { cmtFail, cmtStart, cmtSuccess, newCmt } from '../../redux/cmtSlice';

function Comments({ post, socket, focusCmt, setFocusCmt, postDetail }) {
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        withCredentials: true,
        headers: {
            'Content-type': 'application/json',
        },
    });
    const { currentCmt } = useSelector((state) => state.cmt);
    const { currentUser } = useSelector((state) => state.user);
    const noAvatar = process.env.REACT_APP_PUBLIC_FOLDER + 'no_avatar1.jpg';
    const [comments, setComments] = useState([]);
    const [desc, setDesc] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [decsSocket, setDecsSocket] = useState(null); //
    const dispatch = useDispatch();
    //focus cmt
    const focus = useRef(null);
    useEffect(() => {
        focusCmt && focus.current.focus();
        setFocusCmt(false);
        focusCmt && focus.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, [focusCmt, focus]);

    useEffect(() => {
        // take data from sever
        socket?.on('getDecs', (data) => {
            console.log(data);
            setDecsSocket({
                userId: data.user.userId,
                comment: data.decs,
                postId: data?.postId,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        decsSocket?.postId && setComments((prev) => [...prev, decsSocket]);
    }, [decsSocket?.postId]);

    useEffect(() => {
        const fectchComment = async () => {
            setIsLoading(true);
            dispatch(cmtStart());
            try {
                const res = postDetail
                    ? await axiosInstance.get(`/comment/${postDetail}/find/allComent`)
                    : await axiosInstance.get(`/comment/${post._id}/find`);
                dispatch(cmtSuccess(res.data));
                setIsLoading(false);
            } catch (err) {
                dispatch(cmtFail());
                console.log(err.message);
            }
        };
        fectchComment();
    }, [post?._id]);

    const handleCreateComment = (type) => {
        const createComment = async () => {
            //soket io send data to server
            socket?.emit('getCmt', {
                userId: currentUser._id,
                decs: desc,
                postId: post._id,
            });

            // socketio.current.emit("test1", {uid : currentUser._id, ssid :ssId, decs : 'hello world' } )
            try {
                const res = await axiosInstance.post(`/comment/create`, {
                    postId: post?._id,
                    comment: desc,
                });
                setDesc('');
                dispatch(newCmt(res.data));
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
            } catch (error) {
                console.log(error.message);
            }
        };
        createComment();
    };

    const handleClose = () => {
        focus.current.value = '';
    };

    return (
        <>
            <div className="comments-container">
                <div className="comments-wapper">
                    <div className="comments-item">
                        <img className="comments-img" src={currentUser.userImg || noAvatar} alt={currentUser.userImg} />
                        <textarea
                            className="comments-input"
                            type="text"
                            placeholder="Enter your comment here..."
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            ref={focus}
                            onBlur={handleClose}
                        />

                        {!desc ? (
                            <button
                                type="submit"
                                disabled
                                className="comments-button1 active"
                                onClick={handleCreateComment}
                            >
                                Enter
                                <SendIcon />
                            </button>
                        ) : (
                            <button type="submit" className="comments-button" onClick={(e) => handleCreateComment(2)}>
                                Enter
                                <SendIcon />
                            </button>
                        )}
                    </div>
                </div>
                <div className="comment">
                    {isloading ? (
                        <ReactLoading type={'cylon'} />
                    ) : (
                        currentCmt?.map((comment, index) => <Comment comment={comment} key={index} />)
                    )}
                </div>
            </div>
            <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
                {post.commentCount > 5 && <span className="more">Show more</span>}
            </Link>
        </>
    );
}

export default Comments;
