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
import axiosInstance from "../../instance/instance"

function Comments({ post, focusCmt, setFocusCmt, postDetail }) {
    const { currentCmt } = useSelector((state) => state.cmt);
    const { currentUser } = useSelector((state) => state.user);
    const noAvatar = process.env.REACT_APP_PUBLIC_FOLDER || process.env.REACT_APP_PUBLIC_FOLDER_SSL  + 'no_avatar1.jpg';
    const [comments, setComments] = useState([]);
    const [desc, setDesc] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    //focus cmt
    const focus = useRef(null);
    useEffect(() => {
        focusCmt && focus.current.focus();
        setFocusCmt(false);
        focusCmt && focus.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, [focusCmt, focus]);

    // useEffect(() =>{

    //     currentCmt && setComments(currentCmt)
    // },[currentCmt])

    useEffect(() => {
        const fectchComment = async () => {
            setIsLoading(true);
            dispatch(cmtStart());
            try {
                const res = postDetail
                    ? await axiosInstance.get(`/comment/${postDetail}/find/allComent`)
                    : await axiosInstance.get(`/comment/${post._id}/find`);
                    setComments(res.data);
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
  
            try {
                const res = await axiosInstance.post(`/comment/create`, {
                    postId: post?._id,  
                    comment: desc,
                });
                setDesc('');    
                window.location.reload()
                // dispatch(newCmt(res.data));
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
                        comments?.map((comment, index) => <Comment comment={comment} key={index} />)
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
