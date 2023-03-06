import './editPost.scss'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL,deleteObject } from "firebase/storage";
import app from "../../firebase/firebase";



import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { postAdd, postDelImg } from '../../redux/postSlice';
function EditPost({post ,openEditPost, setOpenEditPost, setText, setImg, img, handleEditPost ,setIputs, inputs, postImg ,handleDelImg,postDesc,setOpenMenuPost}) {
    const dispatch = useDispatch()

    const  {currentPost} = useSelector((state) => state.post)

    const uploadFile = (file, type ) =>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // type === 'imgPost' && setImgPercent(Math.round(progress))
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log(`is running`);
                    break;
                default:

                    break;
                }
            },
            //handle error
            (error) => {console.log('Upload error: ' + error)},
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setIputs((pre)=>{
                        return {...pre, [type]:downloadURL}
                    })
                });
              }

            )
    }

    useEffect(()=>{
        img && uploadFile(img,'imgPost')
    },[img])

    const handleCloseEitPost = () =>{
        setOpenEditPost(false)
        setOpenMenuPost(false)
       

    }
    return ( 
        <>
        {openEditPost &&
            <div className="edit-post" >
            <div className="edit-post-items">
                    <div className="head-items-post">
                        <span>EDIT POST</span>
                        <div className="icon" >
                            <CloseIcon onClick={handleCloseEitPost}/>
                        </div>
                    </div>
                    <div className="input">
                        <div className="input-items">
                            <textarea type="text" placeholder={postDesc} onChange={e=>setText(e.target.value)} />
                           
                           {!currentPost.some(postId => postId._id === post._id && postId.imgPost.length === 0 )
                           ?
                           <div className="img-post">
                                
                                {!currentPost.some(postId => postId._id === post._id && postId.imgPost.length !== 0 )
                                ? 
                                <img src={postImg} alt="" /> 

                                :
                                <button>
                                    <input type='file' id='file' onChange={e=>setImg(e.target.files[0])}/>
                                    <label htmlFor='file'>
                                        <AddPhotoAlternateIcon className="icon1" fontSize='large' style={{cursor:'pointer'}}/>
                                    </label>
                                </button>
                                } 
                                
                           </div>
                           
                           :
                            <button>
                                <input type='file' id='file' onChange={e=>setImg(e.target.files[0])}/>
                               <label htmlFor='file'>
                                    <AddPhotoAlternateIcon className="icon1" fontSize='large' style={{cursor:'pointer'}}/>
                                </label>
                            </button>
                            }

                        </div>
                        {!currentPost.some(postId => postId._id === post._id && postId.imgPost.length !== 0 ) &&
                        <div className="del-img">
                            <CloseIcon onClick={handleDelImg}/>
                        </div>
                        }
                    </div>
               
                    <div className="body-items">
                        <button onClick={handleEditPost}>Yes</button>
                        <button onClick={handleCloseEitPost}>No</button>
                    </div>
                
            </div>
        </div>}
        </>
    );
}

export default EditPost;