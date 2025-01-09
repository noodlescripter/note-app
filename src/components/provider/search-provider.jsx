"use client";
import { useContext, useState, createContext } from "react"

const SearchContext = createContext();

export function SearchProvider({children}){
    const [searchKeyPro, setSearchKeyPro] = useState({
        key: "",
        second_key: ""
    })
    return(
        <SearchContext.Provider value={{searchKeyPro, setSearchKeyPro}}>
            {children}
        </SearchContext.Provider>
    )

}

export const useSearch = () => useContext(SearchContext)