import { Doc } from 'use-fireproof'
import { useCallback, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

export const ItemTypes = {
  IMAGE: 'IMAGE'
}

interface DragItem {
  id: string
  index: number
}

type Range1To6 = 1 | 2 | 3 | 4 | 5 | 6

const ImageDocListItem: React.FC<{ upload: Doc }> = ({ upload }) => {
  const ref = useRef(null)

  const [, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { id: upload._id }
  })

  drag(ref)

  return (
    <li ref={ref} className="bg-slate-500">
      <img
        className="w-full h-auto"
        draggable="false"
        onDragStart={e => {
          e.dataTransfer.setData('text', upload._id)
        }}
        src={`https://${upload.cid}.ipfs.w3s.link`}
        alt={upload.name?.toString()}
      />
    </li>
  )
}

export function ImageDocList({
  docs,
  onReorder,
  columns = 4
}: {
  docs: Doc[]
  onReorder?: (newDocs: Doc[]) => void
  columns: Range1To6
}) {

  const ref = useRef(null) // Create a ref for the list

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    drop(item: DragItem, monitor) {
      console.log('drop', item, monitor)
      const dragIndex = docs.findIndex(doc => doc._id === item.id);
    
      if (!ref.current) {
        return;
      }
    
      // Get mouse position
      const clientOffset = monitor.getClientOffset();
    
      // Get grid dimensions
      const gridBoundingRect = ref.current.getBoundingClientRect();
    
      // Calculate dimensions of a single grid item
      const itemWidth = gridBoundingRect.width / columns;
      const itemHeight = gridBoundingRect.height / Math.ceil(docs.length / columns);
    
      // Calculate row and column based on mouse position
      const hoverRow = Math.floor((clientOffset.y - gridBoundingRect.top) / itemHeight);
      const hoverCol = Math.floor((clientOffset.x - gridBoundingRect.left) / itemWidth);
    
      // Calculate hoverIndex
      const hoverIndex = hoverRow * columns + hoverCol;
    
      if (dragIndex !== hoverIndex && onReorder) {
        const newDocs = [...docs];
        const [movedItem] = newDocs.splice(dragIndex, 1);
        newDocs.splice(hoverIndex, 0, movedItem);
        onReorder(newDocs);
      }
    }
    
  })

  drop(ref) // Use the drop function to wrap the ref

  return (
    <ul className={`grid grid-cols-${columns} gap-4`} ref={ref}>
      {docs?.map(upload => (
        <ImageDocListItem key={upload._id} upload={upload} />
      ))}
    </ul>
  )
}
