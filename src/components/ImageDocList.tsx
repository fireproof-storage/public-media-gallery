import { Doc } from 'use-fireproof'

export function ImageDocList({ docs }: { docs: Doc[] }) {
  return (
    <ul className="flex flex-wrap space-x-1 space-y-1">
      {docs?.map(upload => (
        <li key={upload._id} className="p-1 m-1">
          <img
            className="w-24 h-24"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('text', upload._id)
            }}
            src={`https://${upload.cid}.ipfs.w3s.link`}
            alt={upload.name?.toString()}
          />
        </li>
      ))}
    </ul>
  )
}
