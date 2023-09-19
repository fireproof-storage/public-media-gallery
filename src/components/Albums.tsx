import React, { useState, useContext } from 'react'
import { useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'
import { AutoFocusInput } from './AutoFocusInput'
import { useFireproof } from 'use-fireproof'
import { DragContext } from './DragContext'

export const ItemTypes = {
  IMAGE: 'IMAGE'
}

export function Albums() {
  // Removed DragContext
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

  const albums = useLiveQuery((doc, emit) => {
    if (doc.type === 'album') {
      emit(doc.name)
    }
  })

  const handleDrop = (albumId: string) => e => {
    e.preventDefault()
    const droppedData = e.dataTransfer.getData('text')
    // Handle the dropped data (e.g., update state, make API call)
    console.log(`Dropped data: ${droppedData} onto ${albumId}`)
    database.get(albumId).then(albumDoc => {
      console.log('handleDrop', albumDoc, droppedData)

      // Remove the droppedData if it already exists in the images array
      albumDoc.images = albumDoc.images.filter(image => image !== droppedData)

      // Add the droppedData back in its new position (e.g., at the beginning)
      albumDoc.images.push(droppedData)

      albumDoc.updated = Date.now()
      database.put(albumDoc)
    })
  }

  const refs = albums.docs?.reduce((acc, album) => {
    acc[album._id] = React.createRef()
    return acc
  }, {})

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    drop: (item, monitor) => {
      console.log('drop', item, monitor)
      handleDrop(item.albumId)(monitor)
    }
  })

  const { isDragging } = useContext(DragContext)
  console.log('isDragging', isDragging)
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
        {albums.docs?.map(album => {
          drop(refs[album._id])
          return (
            <li key={album._id} ref={refs[album._id]} className="p-2">
              <Link
                to={`/album/${album._id}`}
                className={
                  'block hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2' +
                  (isDragging ? ' bg-slate-100 dark:bg-slate-700' : '')
                }
              >
                <span className="inline-block mr-2">{album.name}</span>
                <span className="inline-block text-slate-700 text-xs">
                  {album.created && new Date(album.created).toLocaleString()}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
