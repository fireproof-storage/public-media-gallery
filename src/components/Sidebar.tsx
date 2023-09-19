import { useEffect, useState } from 'react'
import { FileDrop } from 'react-file-drop'
import { useFireproof } from 'use-fireproof'
import { Login } from './Login'
import { Link } from 'react-router-dom'
import { Albums } from './Albums'

export function Sidebar() {
  const { database, useLiveQuery } = useFireproof('gallery')
  const [authorized, setAuthorized] = useState(false)
  const cx = database.connect('gallery')

  // const images = useLiveQuery((doc, emit) => {
  //   if (doc.contentType && /image/.test(doc.contentType.toString())) {
  //     emit(doc.added)
  //   }
  // })

  const uploads = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'upload') {
        emit(doc.created)
      }
    },
    { descending: true }
  )

  useEffect(() => {
    cx.ready.then(() => {
      setAuthorized(!!cx.authorized)
    })
  }, [])

  const onLogin = (email: `${string}@${string}`) => {
    cx.authorize(email).then(() => {
      setAuthorized(true)
    })
  }

  const gotFiles = async (files: FileList | null) => {
    if (!files) return
    function fileWithName(name: string) {
      if (!files) return
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === name) return files[i]
      }
    }
    const ok = await database.put({
      type: 'upload',
      created: Date.now(),
      status: 'uploading',
      count: files.length
    })
    const statusDoc = await database.get(ok.id)
    const done = await cx.accountConnection?.client?.uploadDirectory(Array.from(files))
    const apiURL = `https://dweb.link/api/v0/ls?arg=${done?.toString()}`
    statusDoc.status = 'processing'
    await database.put(statusDoc)
    const response = await fetch(apiURL)
    const json = await response.json()
    statusDoc.status = 'ready'
    await database.put(statusDoc)
    const objects = json.Objects as { Links: [] }[]
    for (const object of objects) {
      const links = object.Links
      for (const { Name, Hash, Size } of links) {
        const fileDoc = {
          type: 'file',
          uploadId: ok.id,
          name: Name,
          cid: Hash,
          size: Size,
          added: Date.now()
        }
        const thisFile = fileWithName(Name)
        if (thisFile) {
          database.put({
            ...fileDoc,
            contentType: thisFile.type,
            updated: thisFile.lastModified
          })
        } else {
          database.put(fileDoc)
        }
      }
    }
  }

  console.log('uploads', uploads)

  return (
    <div className="w-1/4 p-4 dark:bg-gray-900 bg-slate-200">
      {authorized ? (
        <FileDrop onDrop={gotFiles}>
          <div style={{ minHeight: '3em' }} className="bg-slate-100 dark:bg-slate-700 rounded p-4 mb-4 hover:dark:bg-slate-600">
            🎞 Drop images here to import!
          </div>
        </FileDrop>
      ) : (
        <Login onLogin={onLogin} />
      )}

    <Albums />



      <h2>Recent Imports</h2>
      <ul className="list-inside list-none">
        {uploads.docs.map(upload => (
          <li key={upload._id} className="p-2">
            <Link to={`/upload/${upload._id}`} className="block hover:bg-gray-100dark: hover:bg-gray-800 rounded px-2">
              <span className="text-xs text-gray-500 block pb-2">
                {new Date(upload.created).toLocaleString()}
              </span>
              <span className="inline-block mr-2">{upload.count} {upload.count === 1 ? 'file' : 'files'}</span>
              <span className="inline-block text-slate-700">({upload.status})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
