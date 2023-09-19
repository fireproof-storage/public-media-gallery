import { useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ImageDocList } from '../components/ImageDocList'

export function Album() {
  const { database, useLiveQuery } = useFireproof('gallery')
  const { id } = useParams()

  const albumQ = useLiveQuery('_id', { key: id })
  const [album] = albumQ.docs
  console.log('album', album?.images)
  const images = useLiveQuery('_id', { keys: album?.images || [] })
  console.log('images', images)
  return (
    <>
      <h1>Album</h1>
      <p>Gallery page content</p>
      <ImageDocList docs={images.docs} />

    </>
  )
}
