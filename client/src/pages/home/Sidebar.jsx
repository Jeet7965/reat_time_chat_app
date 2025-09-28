import React, { useState } from 'react'
import '../home/'
import SearchBar from './Searchbar'
import UsersList from './UsersList'
function Sidebar({ socket }) {
    const [searchKey, setSearchKey] = useState("")

    return (
        <div className="app-sider">
            <div className='search-top '>
                <SearchBar searchKey={searchKey} setSearchKey={setSearchKey} > </SearchBar>
            </div>
            <div className='search-bottom'>
                <UsersList searchKey={searchKey} socket={socket} ></UsersList>
            </div>
        </div>
    )
}

export default Sidebar