// contexts/NavContext.js
"use client";

import { createContext, useContext, useState } from 'react';

const NavContext = createContext();

export function NavProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState({
    mainMenu: "null",
    subMenu: "null"     
  });

  return (
    <NavContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </NavContext.Provider>
  );
}

export const useNav = () => useContext(NavContext);