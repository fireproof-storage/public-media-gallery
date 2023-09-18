import { useState } from 'react'
import { FileDrop } from 'react-file-drop'

import './App.css'

function App() {
  const theStyle = { background: '#bbb', width: '200px', height: '200px' }

  const gotFiles = (files: FileList) => {
    console.log('files:', files)
  }

  return (
    <>
      <div>

        <h1>Gallery</h1>

        <FileDrop onDrop={gotFiles}>
          <div style={theStyle}>Drop some files here!</div>
        </FileDrop>
      </div>
    </>
  )
}

export default App
