import { useEffect, useRef, useState } from 'react'
import { FileDrop } from 'react-file-drop'
import { useFireproof } from 'use-fireproof'
import { Login } from './Login'
import { Albums } from './Albums'
import { Imports } from './Imports'

export function Sidebar() {
  const { database } = useFireproof('gallery')

  const [authorized, setAuthorized] = useState(false)
  const cx = database.connect('gallery')
  const fileInputRef = useRef(null) // Add this line

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
  const onTargetClick = () => {
    // Add this function
    fileInputRef.current.click()
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
    statusDoc.done = done!.toString()
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

  return (
    <div className="w-1/4 p-4 dark:bg-gray-900 bg-slate-200">
      {authorized ? (
        <>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={e => gotFiles(e.target.files)}
            style={{ display: 'none' }}
          />
          <FileDrop onDrop={gotFiles} onTargetClick={onTargetClick}>
            <div
              style={{ minHeight: '3em' }}
              className="bg-slate-100 dark:bg-slate-700 rounded p-4 mb-4 hover:dark:bg-slate-600"
            >
              🎞 Drop image files here! 🖼
            </div>
          </FileDrop>
          <Albums />
          <Imports />
        </>
      ) : (
        <Login onLogin={onLogin} />
      )}
    </div>
  )
}
