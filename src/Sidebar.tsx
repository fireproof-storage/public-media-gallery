import { useEffect, useState } from 'react'
import { FileDrop } from 'react-file-drop'
import { useFireproof } from 'use-fireproof'
import './App.css'
import { Login } from './Login'

export function Sidebar() {
  const theStyle = { background: '#bbb', width: '200px', height: '200px' }
  const { database, useLiveQuery } = useFireproof('gallery')
  const [authorized, setAuthorized] = useState(false)
  const cx = database.connect('gallery')

  const images = useLiveQuery((doc, emit) => {
    if (doc.contentType && /image/.test(doc.contentType.toString())) {
      emit(doc.added)
    }
  })

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
    <>
        <h1>Media Library</h1>
        {authorized ? (
          <FileDrop onDrop={gotFiles}>
            <div style={theStyle}>Drop images here!</div>
          </FileDrop>
        ) : (
          <Login onLogin={onLogin} />
        )}

        <h2>Uploads</h2>
        <ul>
          {uploads.docs.map(upload => (
            <li key={upload._id}>
              {upload.status} {upload.count}
            </li>
          ))}
        </ul>
    </>
  )
}

