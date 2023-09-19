import { Doc } from 'use-fireproof'
import { useContext, useCallback } from 'react'
import { DragContext } from './DragContext'

type Range1To6 = 1 | 2 | 3 | 4 | 5 | 6

export function ImageDocList({
  docs,
  onReorder,
  columns = 4
}: {
  docs: Doc[]
  onReorder?: (newDocs: Doc[]) => void
  columns: Range1To6
}) {
  const { setIsDragging } = useContext(DragContext)

  const handleDragOver = useCallback(e => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    e => {
      e.preventDefault()
      const draggedId = e.dataTransfer.getData('text')
      const draggedDoc = docs.find(doc => doc._id === draggedId)
      if (!draggedDoc) return
      const newDocs = docs.filter(doc => doc._id !== draggedId)
      newDocs.unshift(draggedDoc)
      if (onReorder) onReorder(newDocs)
    },
    [docs, onReorder]
  )
  const gridColsClasses: Record<Range1To6, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }
  return (
    <ul
      className={`grid ${gridColsClasses[columns]} gap-4`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {docs?.map(upload => (
        <li key={upload._id} className="bg-slate-500">
          <img
            className="w-full h-auto"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('text', upload._id)
              setIsDragging(true)
            }}
            onDragEnd={() => {
              setIsDragging(false)
            }}
            src={`https://${upload.cid}.ipfs.w3s.link`}
            alt={upload.name?.toString()}
          />
        </li>
      ))}
    </ul>
  )
}
