import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { ImageDocList } from '../components/ImageDocList'
import { ConfirmButton } from '../components/ConfirmButton'
import { AlbumForm } from '../components/AlbumForm'

export function Album() {
  const navigate = useNavigate() // Initialize useHistory hook

  const { database, useLiveQuery } = useFireproof('gallery')
  const { id } = useParams()
  const [columns, setColumns] = useState(3) // Initial value for columns
  const [showForm, setShowForm] = useState(false) // State to manage form visibility

  const albumQ = useLiveQuery('_id', { key: id })
  const [album] = albumQ.docs
  const images = useLiveQuery('_id', { keys: album?.images || [] })

  const handlePublish = () => {
    // Your publish logic here
    console.log('Album published')
  }
  const handleDelete = () => {
    database.del(id!).then(() => {
      navigate('/') // Navigate back to root path
    })
  }
  const [color, setColor] = useState('#111'); // Initial color value
  const [bgColor, setBgColor] = useState('#ffffff'); // Initial background color value


  console.log('name', name)
  return (
    <div >
      <div className="flex justify-between items-center mb-2" >
        <h1>Album: {album?.name}</h1>
        <button onClick={() => setShowForm(!showForm)} className="text-xl">
          ⚙️
        </button>
      </div>
      {showForm && (
        <AlbumForm
          columns={columns}
          setColumns={setColumns}
          color={color}
          setColor={setColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          handlePublish={handlePublish}
          handleDelete={handleDelete}
        />
      )}

      <ImageDocList
        docs={images.docs}
        columns={columns}
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
