import React from 'react'
import { useSelector } from 'react-redux'

function UsersList({ searchKey }) {
    const { allUsers } = useSelector(state => state.userReducer)

    if (!allUsers || allUsers.length === 0) return <p>No users found</p>
    return (
        allUsers
            .filter(user => {
                const key = searchKey.toLowerCase();
                return (
                    (user.firstname.toLowerCase().includes(key) ||
                        user.lastname.toLowerCase().includes(key))
                )
            })



            .map((user) => {
                return (
                    <div className="user-card" key={user._id}>
                        <div className="user-info">
                            <div className="user-profile">
                                {
                                    user.profilePic ? <img src={user.profilePic} alt="profilepic" /> :
                                        <div className="full-name">
                                            {user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase()}
                                        </div>
                                }
                            </div>
                            <div className="user-details">
                                <span className="name">{user.firstname} {user.lastname}</span>
                                <span className="email">{user.email}</span>
                            </div>
                        </div>
                        <button className="start-chat-btn">Start Chat</button>
                    </div>
                )
            })

    )
}

export default UsersList