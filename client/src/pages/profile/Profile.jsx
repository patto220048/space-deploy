import Post from '../../components/post/Post';
import Navbar from '../../layout/navbar/Navbar';
import Sidebar from '../../layout/sidebar/Sidebar';
import AddIcon from '@mui/icons-material/Add';
import './profile.scss'


function Profile() {
    return ( 
        <>
        <Navbar/>
        <div className="profile-container">
            <Sidebar/>
            <div className="profile-warpper">
                <div className="profile-item">
                    <div className="profile-top">
                        <div className="background">
                            <img className='background-img' src="https://images.unsplash.com/photo-1676113462035-e4d56ce608d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNnx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=60" alt="" />
                            <button><AddIcon fontSize='large'  className='add-icon'/></button>
                        </div>
                        <div className="btn-fl">
                            <button className='follow1'>Follow</button>
                            <button className='follow2'>Follow</button>  
                        </div>
                        <div className="avatar">
                            <img className='avatar-img' src="https://images.unsplash.com/photo-1675621929929-a8a74c6b795e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzMXx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=60" alt="" />
                            <button className='avatar-add-icon'>
                                <AddIcon fontSize='large' className='add-icon'/>
                            </button>
                           
                        </div>
                        <div className="profile-mid">
                            <p className='post-count'><span>MY POST </span>2</p>
                            <p className='follow-count'><span>FOLLOWER </span>1000</p>
                            <p className='friend-count'><span>FRIENDS </span>245</p>

                        </div>
                    </div>
                    <div className="profile-bottom">
                          <Post/>
                          <Post/>
                          <Post/>
                          <Post/>
                          <Post/>
                          <Post/>
                    </div>

                  
                   
                   
                    
                </div>
            </div>
        </div>
        </>
     );
}

export default Profile;