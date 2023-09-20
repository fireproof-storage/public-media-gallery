import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ImageDocList } from '../components/ImageDocList'
export function Upload() {
  const { id } = useParams()
  const { useLiveQuery } = useFireproof('gallery')

  const { docs } = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'file' && /image/.test(doc.contentType!.toString())) {
        emit(doc.uploadId)
      }
    },
    { key: id }
  )
  return (
    <>
      <h1 className="pb-4">Upload {id}</h1>
      <ImageDocList docs={docs} columns={6} />
    </>
  )
}
