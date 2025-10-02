import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router';

import '../../assets/css/home.css'

function Header({socket}) {

    const { user } = useSelector((state => state.userReducer))

    const navigate = useNavigate()
    function getFullname() {
        if (!user) return "";
        const fname = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
        const lname = user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
        return fname + " " + lname;
    }
    function getInitials() {
        if (!user) return "";
        return user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase();
    }

    async function logout(params) {
        localStorage.removeItem('token')
        navigate('/login')
        socket.emit('user-offline',user._id)
    }

    return (
        <div>
            <header className="header">
                <div className="logo">

                    <span>Chat_App</span>
                </div>
                <div className="profile">
                    <div className="full-name">
                        <span className="username">{getFullname()}</span>
                    </div>
                    <div className="user-profile">
                        {user?.profilePic ?(
                            <img src={user.profilePic} className="user-profile-pic-upload" onClick={() => navigate("/profile")} alt="Profile" />
                        ) : (
                            <div className="username" onClick={() => navigate("/profile")}  >{getInitials()}</div>
                        )}
                    </div>

                <button className='logout-btn' onClick={logout} >
                    <i className='fa fa-power-off'></i>
                </button>
                </div>
            </header>
        </div>
    )
}

export default Header