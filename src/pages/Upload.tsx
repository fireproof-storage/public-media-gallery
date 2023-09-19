import { useParams } from 'react-router-dom'
import { useDocument, useFireproof } from 'use-fireproof'
export function Upload() {
  const { id } = useParams()
  const { database, useLiveQuery } = useFireproof('gallery')

  // const [uploadInfo] = useDocument(id)

  const { docs } = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'file' && /image/.test(doc.contentType.toString())) {
        emit(doc.uploadId)
      }
    },
    { key: id }
  )

  return (
    <>
      <h1 className='pb-4'>Upload {id}</h1>
      <ul className="flex flex-wrap space-x-1 space-y-1">
        {docs?.map(upload => (
          <li key={upload._id} className="p-1 m-1">
            <img
              className="w-24 h-24"
              src={`https://${upload.cid}.ipfs.w3s.link`}
              alt={upload.name?.toString()}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
