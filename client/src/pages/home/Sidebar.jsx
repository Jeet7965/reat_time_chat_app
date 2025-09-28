import React, { useState } from 'react'
import '../home/'
import SearchBar from './Searchbar'
import UsersList from './UsersList'
function Sidebar({socket}) {
    const [searchKey, setSearchKey] = useState("")

    return (
        <div className="app-sider">
            <SearchBar searchKey={searchKey} setSearchKey={setSearchKey} > </SearchBar>
            <UsersList searchKey={searchKey} socket={socket} ></UsersList>
        </div>
    )
}

export default Sidebar