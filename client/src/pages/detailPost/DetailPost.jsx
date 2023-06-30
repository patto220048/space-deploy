import { useEffect, useState } from 'react';
import Post from '../../components/post/Post';
import Rightbar from '../../layout/rightbar/Rightbar';
import './detailPost.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from "../../instance/instance"

function DetailPost() {
    const [post, setPost] = useState(null);

    const postId = useParams();
    useEffect(() => {
        const fecthPost = async () => {
            try {
                const res = await axiosInstance.get(`/post/find/v1/${postId.postId}`);
                setPost(res.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fecthPost();
    }, [postId.postId]);

    return (
        <>
            <div className="container-detailPost">
                <div className="wapper-detailPost">
                    {!post ? (
                        <span className="post-mess">Post not found !!!</span>
                    ) : (
                        <>
                            <Post post={post} postDetail = {postId.postId}/>
                        </>
                    )}
                </div>
            </div>
            <Rightbar />
        </>
    );
}

export default DetailPost;
