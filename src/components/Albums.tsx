import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AutoFocusInput } from './AutoFocusInput'
import { useFireproof } from 'use-fireproof'

export function Albums() {
  const { database, useLiveQuery } = useFireproof('gallery')
  const [isCreating, setIsCreating] = useState(false)
  const [albumName, setAlbumName] = useState('')

  const handleCreateClick = () => {
    // Handle album creation logic here
    console.log(`Creating album with name: ${albumName}`)
    const albumDoc = {
      type: 'album',
      name: albumName,
      images: [],
      created: Date.now(),
      updated: Date.now()
    }
    database.put(albumDoc).then(() => {
      setIsCreating(false)
      setAlbumName('')
    })
  }

  const albums = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'album') {
        emit(doc.updated)
      }
    },
    { descending: true }
  )

  const handleDragOver = e => {
    e.preventDefault()
  }

  const handleDrop = (albumId: string) => e => {
    e.preventDefault()
    const droppedData = e.dataTransfer.getData('text')
    // Handle the dropped data (e.g., update state, make API call)
    console.log(`Dropped data: ${droppedData} onto ${albumId}`)
    database.get(albumId).then(albumDoc => {
      albumDoc.images.push(droppedData)
      albumDoc.updated = Date.now()
      database.put(albumDoc)
    })
  }

  return (
    <div className="mb-2">
      <h2>Albums</h2>
      <ul>
        <li key={'add'} className="p-2">
          {isCreating ? (
            <form
              className="flex items-center"
              onSubmit={e => {
                e.preventDefault()
                handleCreateClick()
              }}
            >
              <AutoFocusInput
                value={albumName}
                isActive={isCreating}
                onChange={e => setAlbumName(e.target.value)}
                className="bg-slate-300 p-1 mr-2 text-xs text-black flex-grow"
              />
              <button type="submit" className="ml-2">
                ✔️
              </button>
            </form>
          ) : (
            <>
              <span className="inline-block text-slate-700">+</span>
              <span onClick={() => setIsCreating(true)} className="inline-block ml-2">
                Create album
              </span>
            </>
          )}
        </li>
        {albums.docs?.map(album => (
          <li
            onDragOver={handleDragOver}
            onDrop={handleDrop(album._id)}
            key={album._id}
            className="p-2"
          >
            <Link
              to={`/album/${album._id}`}
              className="block hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2"
            >
              <span className="inline-block mr-2">{album.name}</span>
              <span className="inline-block text-slate-700 text-xs">
                {album.created && new Date(album.created).toLocaleString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
