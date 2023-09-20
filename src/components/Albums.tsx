import { useState, useContext, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'
import { AutoFocusInput } from './AutoFocusInput'
import { useFireproof } from 'use-fireproof'
import { DragContext } from './DragContext'

import { ItemTypes } from './ImageDocList'

export function Albums() {
  const { database, useLiveQuery } = useFireproof('gallery')
  const [isCreating, setIsCreating] = useState(false)
  const [albumName, setAlbumName] = useState('')

  const listRef = useRef(null) // Single ref for the entire list

  const handleCreateClick = () => {
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

  const handleDrop = (albumId: string, item: { id: string }) => {
    const { id } = item
    database.get(albumId).then(albumDoc => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      albumDoc.images = albumDoc.images!.filter(image => image !== id) as string[]
      albumDoc.images.push(id)
      albumDoc.updated = Date.now()
      database.put(albumDoc)
    })
  }

  const [hoveredAlbumId, setHoveredAlbumId] = useState<string | null>(null)

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset()!
      const elementUnderCursor = document.elementFromPoint(clientOffset.x, clientOffset.y)

      let targetElement = elementUnderCursor
      while (targetElement && targetElement.tagName !== 'LI') {
        targetElement = targetElement.parentElement
      }

      if (targetElement) {
        const targetAlbumId = targetElement.getAttribute('data-album-id')
        setHoveredAlbumId(targetAlbumId || null)
      }
    },
    drop: (item, monitor) => {
      setHoveredAlbumId(null) // Reset hover state on drop
      const clientOffset = monitor.getClientOffset()!
      const elementUnderCursor = document.elementFromPoint(clientOffset.x, clientOffset.y)

      // Traverse up the DOM tree to find the closest li element (album)
      let targetElement = elementUnderCursor
      while (targetElement && targetElement.tagName !== 'LI') {
        targetElement = targetElement.parentElement
      }

      if (targetElement) {
        const targetAlbumId = targetElement.getAttribute('data-album-id')
        if (targetAlbumId) {
          handleDrop(targetAlbumId, item as { id: string })
        }
      }
    }
  })

  drop(listRef) // Use the drop function to wrap the single ref

  const { isDragging } = useContext(DragContext)

  return (
    <div className="mb-2">
      <h2>Albums</h2>
      <ul ref={listRef}>
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
          return (
            <li key={album._id} data-album-id={album._id} className="p-2">
              <Link
                to={`/album/${album._id}`}
                className={
                  'block hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2' +
                  (isDragging && hoveredAlbumId === album._id ? ' bg-red-500' : 
                   isDragging ? ' bg-slate-100 dark:bg-slate-700' : '')
                }
              >
                <span className="inline-block mr-2">{album.name as string}</span>
                <span className="inline-block text-slate-700 text-xs">
                  {album.created && new Date(album.created as number).toLocaleString()}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
