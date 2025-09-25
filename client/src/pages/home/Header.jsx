import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
function Header() {

    const { user } = useSelector((state => state.userReducer))

    console.log(user)

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


    return (
        <div>
            <header className="header">
                <div className="logo">

                    <span>MyApp</span>
                </div>
                <div className="profile">
                    <div className="full-name">
                        <span className="username">{getFullname()}</span>
                    </div>
                    <div className="initials">
                        <span className="username">{getInitials()}</span>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header