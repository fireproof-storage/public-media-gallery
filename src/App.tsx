import { useState } from 'react'
import { FileDrop } from 'react-file-drop'
import { fireproof } from 'use-fireproof'
import './App.css'

function App() {
  const theStyle = { background: '#bbb', width: '200px', height: '200px' }

  const gotFiles = (files: FileList| null) => {
    console.log('files:', files)
  }

  return (
    <>
      <div>
        <h1>Gallery</h1>
        <FileDrop onDrop={gotFiles}>
          <div style={theStyle}>Drop images here!</div>
        </FileDrop>
      </div>
    </>
  )
}

export default App
