import React, { createContext, useContext, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DragContext = createContext({ isDragging : false, setIsDragging : (_isDragging: boolean) => {
  console.log('setIsDragging not implemented')
} });

export const DragProvider = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <DragContext.Provider value={{ isDragging, setIsDragging }}>
      {children}
    </DragContext.Provider>
  );
};
