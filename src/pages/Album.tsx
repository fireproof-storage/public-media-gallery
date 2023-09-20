import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DocFragment, useFireproof } from 'use-fireproof'
import { ImageDocList } from '../components/ImageDocList'
import { AlbumForm, AlbumSettings } from '../components/AlbumForm'
import { albumRenderHTML } from '../helpers'

export function Album() {
  const navigate = useNavigate() // Initialize useHistory hook

  const { database, useLiveQuery } = useFireproof('gallery')
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false) // State to manage form visibility
  const [publishUrl, setPublishUrl] = useState('') // State to manage publish URL

  const [isEditingName, setIsEditingName] = useState(false) // Add this line
  const [newName, setNewName] = useState('') // Add this line

  const albumQ = useLiveQuery('_id', { key: id })
  const [album] = albumQ.docs
  const images = useLiveQuery('_id', { keys: album?.images || [] })

  const handlePublish = async () => {
    const cx = database.connect('gallery')
    const html = albumRenderHTML(
      album?.name!.toString(),
      images?.docs as { cid: string; name: string }[],
      album!.settings as unknown as AlbumSettings
    )

    // Create a File object with content type set to text/html
    const file = new File([html], 'album.html', { type: 'text/html' })

    const done = await cx.accountConnection?.client?.uploadDirectory([file])
    const url = `https://${done?.toString()}.ipfs.w3s.link/album.html`

    // await sleep(1000)
    // window.open(url.toString(), '_blank')
    setPublishUrl(url.toString())
  }

  const handleDelete = () => {
    database.del(id!).then(() => {
      navigate('/') // Navigate back to root path
    })
  }

  const settings: AlbumSettings = (album?.settings || {
    color: '#111111',
    bgColor: '#eeeeee',
    columns: 3
  }) as unknown as AlbumSettings

  // const [settings, setSettings] = useState()

  const updateSettings = (newSettings: AlbumSettings) => {
    album.settings = newSettings as unknown as DocFragment
    album.updated = Date.now()
    database.put(album)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        {isEditingName ? ( // Add this conditional rendering block
          <form
            onSubmit={e => {
              e.preventDefault()
              // Call your onNameSave function here
              album.name = newName
              album.updated = Date.now()
              database.put(album)
              setIsEditingName(false)
            }}
          >
            <input
              className="bg-slate-300 p-1 mr-2 text-xs text-black flex-grow"
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button type="submit">✔️</button>
          </form>
        ) : (
          <h1
            onClick={() => {
              setNewName(album?.name?.toString() || '')
              setIsEditingName(true)
            }}
          >
            Album: {album?.name?.toString()}
          </h1>
        )}
        <button onClick={() => setShowForm(!showForm)} className="text-xl">
          ⚙️
        </button>
      </div>
      {showForm && (
        <AlbumForm
          settings={settings as unknown as AlbumSettings}
          setSettings={updateSettings}
          handlePublish={handlePublish}
          handleDelete={handleDelete}
          publishUrl={publishUrl}
        />
      )}

      <ImageDocList
        docs={images.docs}
        columns={settings.columns}
        onReorder={docs => {
          const ids = docs.map(doc => doc._id!)
          album.images = ids
          album.updated = Date.now()
          database.put(album)
        }}
      />
    </div>
  )
}
