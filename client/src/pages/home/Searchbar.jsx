import React from 'react'
import searchImg from "/public/search.png"

function SearchBar({searchKey,setSearchKey}) {
    
    return (
        <>
            <div className="user-search">
                <input
                    type="text"
                    value={searchKey}
                    onChange={(e)=>setSearchKey(e.target.value)}
                    placeholder="Search users..."
                    className="user-search-text"
                />
                <img src={searchImg} alt="Search" className="search-icon" />
            </div>
        </>
    )
}

export default SearchBar