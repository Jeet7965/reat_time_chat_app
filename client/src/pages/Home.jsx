import React, { useEffect, useState } from 'react'

function Home() {

    const [userdata, setUserdata] = useState()
    // useEffect(() => {
    //     getLoggedUser()
    // }, [])

    // async function getLoggedUser(params) {
    //     try {
    //         const response = await fetch("http://localhost:3200/user/alluser", {
    //             credentials: "include"
    //         })
    //         const data= await response.json()
    //         console.log(data)
    //     } catch (error) {

    //     }
    // }

    return (
        <div>Home</div>
    )
}

export default Home