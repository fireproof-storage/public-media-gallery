import React, { createContext, ReactNode } from 'react';
import { DndProvider, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; 

// Define the shape of the context
interface DragContextProps {
  isDragging: boolean;
}

// Define the shape of the props for DragLayerInner and DragProvider
interface DragLayerInnerProps {
  children: ReactNode;
}

// Create the context
export const DragContext = createContext<DragContextProps>({
  isDragging: false,
});

// Inner component to hold the drag layer logic
const DragLayerInner: React.FC<DragLayerInnerProps> = ({ children }) => {
  const { isDragging } = useDragLayer(monitor => ({
    isDragging: monitor.isDragging(),
  }));

  return (
    <DragContext.Provider value={{ isDragging }}>
      {children}
    </DragContext.Provider>
  );
};

// Create the provider
export const DragProvider: React.FC<DragLayerInnerProps> = ({ children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragLayerInner>
        {children}
      </DragLayerInner>
    </DndProvider>
  );
};
