import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';
import { useNavigate } from "react-router";
import '../app.css';
function Profile() {
    const { user } = useSelector((state) => state.userReducer);
    const [previewImage, setPreviewImage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();
 const navigate = useNavigate();
    useEffect(() => {
        if (user?.profilePic) {
            setPreviewImage(user.profilePic);
        }
    }, [user]);

    const getFullname = () => {
        if (!user) return '';
        return `${user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase()} ${user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase()}`;
    };

    const getInitials = () => {
        if (!user) return '';
        return user.firstname.charAt(0).toUpperCase() + user.lastname.charAt(0).toUpperCase();
    };

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file)); // shows preview
        }
    };

    const uploadProfilePic = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("profilePic", selectedFile);
            const response = await fetch("https://real-chat-app-58ba.onrender.com/upload-profile-pic", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                credentials: "include",

            });

            const result = await response.json();

            if (result.success) {

                toast.success(result.message);
                dispatch(setUser(result.data));


            } else {
                toast.error(result.message || "Image upload failed");
            }
        } catch (error) {
            toast.error(error.message || "Image upload failed");
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <div className="profile-pic-container">
                    {previewImage ? (
                        <img src={previewImage} className="user-profile-pic-upload" alt="Profile" />
                    ) : (
                        <div className="user-default-profile-avtar">{getInitials()}</div>
                    )}
                </div>

                <div className="profile-info-container">
                    <div className="user-profile-name">
                        <h1>{getFullname()}</h1>
                    </div>
                    <div><b>Email:</b> {user?.email}</div>
                    <div><b>Account Created:</b> {moment(user?.createdAt).format('MMM DD, YYYY')}</div>

                    <div className="select-profile-pic">
                        <input type="file" accept="image/*" onChange={onFileSelect} />
                       
                        <button onClick={uploadProfilePic}>Upload</button>
                        <button onClick={()=>navigate('/')}>Back Home</button>
                       
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Profile;
