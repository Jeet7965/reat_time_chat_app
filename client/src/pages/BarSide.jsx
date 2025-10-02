import React, { useState } from 'react'
import '../home/'
import SearchBar from './homePage/Searchbar'
import UsersList from './homePage/UsersList'
function SideBar({ socket,onlineUser }) {
    const [searchKey, setSearchKey] = useState("")

    return (
        <div className="app-sider">
            <div className='search-top '>
                <SearchBar searchKey={searchKey} setSearchKey={setSearchKey} > </SearchBar>
            </div>
            <div className='search-bottom'>
                <UsersList 
                onlineUser={onlineUser}
                 searchKey={searchKey} 
                 socket={socket} >
                    
                 </UsersList>
            </div>
        </div>
    )
}

export default SideBar