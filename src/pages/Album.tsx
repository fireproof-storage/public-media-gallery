import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ImageDocList } from '../components/ImageDocList'
import { ConfirmButton } from '../components/ConfirmButton'

export function Album() {
  const { database, useLiveQuery } = useFireproof('gallery')
  const { id } = useParams()

  const albumQ = useLiveQuery('_id', { key: id })
  const [album] = albumQ.docs
  const images = useLiveQuery('_id', { keys: album?.images || [] })

  return (
    <>
      <h1>Album: {album?.name}</h1>
      <ConfirmButton onConfirm={() => {
        database.del(id)
      }} initialText="Delete album" confirmText="Are you sure?" />

      <ImageDocList docs={images.docs} onReorder={(docs) => {
        const ids = docs.map(doc => doc._id)
        album.images = ids
        album.updated = Date.now()
        database.put(album)
      }} />
    </>
  )
}
