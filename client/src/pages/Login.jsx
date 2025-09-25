import React from 'react'
import { Link, useNavigate } from 'react-router';
import '../assets/css/form.css'
import { useState } from 'react';

import toast from 'react-hot-toast';


function Login() {


    const navigate = useNavigate()

    const [user, setUser] = useState({ email: '', password: '' });

    const handleLoginForm = async (event) => {

        event.preventDefault();
        try {

            const response = await fetch("http://localhost:3200/api/login", {
                method: 'Post',
                body: JSON.stringify(user),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            console.log("Success:", data);

            if (data.success) {
                toast.success(data.message);
                localStorage.setItem('token', data.token)
                navigate('/')

            } else {
                toast.error(data.message || "Login  failed");
            }
        } catch (error) {


            toast.error(error.response?.data?.error || error.message);
        }
    }

    return (
        <>
            <div className="container">
                <div className='card'>
                    <div className='card-title'>
                        <h1>Login </h1>
                    </div>
                    <div className="forms">
                        <form onSubmit={handleLoginForm} >

                            <input type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} name='email' placeholder="Email" value={user.email} required />
                            <input type="password" onChange={(e) => setUser({ ...user, password: e.target.value })} name='password' placeholder="Password" value={user.password} required />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                    <div className="card-items">
                        <span> Don't have an account <Link to='/singup'>sinup here</Link></span>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Login