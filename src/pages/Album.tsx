import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ImageDocList } from '../components/ImageDocList'
import { AlbumForm, AlbumSettings } from '../components/AlbumForm'
import { albumRenderHTML } from '../helpers'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function Album() {
  const navigate = useNavigate() // Initialize useHistory hook

  const { database, useLiveQuery } = useFireproof('gallery')
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false) // State to manage form visibility

  const albumQ = useLiveQuery('_id', { key: id })
  const [album] = albumQ.docs
  const images = useLiveQuery('_id', { keys: album?.images || [] })

  const handlePublish = async () => {
    const cx = database.connect('gallery');
    const html = albumRenderHTML(album?.name!.toString(), images?.docs, album!.settings);
    
    // Create a File object with content type set to text/html
    const file = new File([html], "album.html", { type: "text/html" });
    
    const done = await cx.accountConnection?.client?.uploadDirectory([file]);
    const url = `https://${done?.toString()}.ipfs.w3s.link/album.html`

    await sleep(1000)
    window.open(url.toString(), '_blank')
  }
  

  const handleDelete = () => {
    database.del(id!).then(() => {
      navigate('/') // Navigate back to root path
    })
  }

  const settings = album?.settings || {
      color: '#111111',
      bgColor: '#eeeeee',
      columns: 3
    }

  // const [settings, setSettings] = useState()

  const updateSettings = (newSettings: AlbumSettings) => {
    album.settings = newSettings
    album.updated = Date.now()
    database.put(album)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1>Album: {album?.name}</h1>
        <button onClick={() => setShowForm(!showForm)} className="text-xl">
          ⚙️
        </button>
      </div>
      {showForm && (
        <AlbumForm
          settings={settings}
          setSettings={updateSettings}
          handlePublish={handlePublish}
          handleDelete={handleDelete}
        />
      )}

      <ImageDocList
        docs={images.docs}
        columns={settings.columns}
        onReorder={docs => {
          const ids = docs.map(doc => doc._id)
          album.images = ids
          album.updated = Date.now()
          database.put(album)
        }}
      />
    </div>
  )
}
