import React from 'react'
import { ConfirmButton } from './ConfirmButton'

interface AlbumFormProps {
  columns: number
  setColumns: React.Dispatch<React.SetStateAction<number>>,
  setColor: React.Dispatch<React.SetStateAction<string>>,
  bgColor: string
  setBgColor: React.Dispatch<React.SetStateAction<string>>,
  handlePublish: () => void
  handleDelete: () => void
}

export const AlbumForm: React.FC<AlbumFormProps> = ({
  columns,
  setColumns,
  color,
  setColor,
  bgColor,
  setBgColor,
  handlePublish,
  handleDelete
}) => {

  const customStyle = {
    backgroundColor: bgColor,
    color
  }

  return (
    <form style={customStyle} className='rounded p-2 my-2'>
      <label htmlFor="column-slider">Columns: </label>
      <input
        id="column-slider"
        type="range"
        min="1"
        max="6"
        step="1"
        value={columns}
        onChange={e => setColumns(Number(e.target.value))}
      />
      <span>{columns}</span>
      <br />

      <label htmlFor="color-picker">Color: </label>
      <input
        id="color-picker"
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
      />
      <br />

      <label htmlFor="bg-color-picker">Background Color: </label>
      <input
        id="bg-color-picker"
        type="color"
        value={bgColor}
        onChange={e => setBgColor(e.target.value)}
      />
      <br />

      <ConfirmButton
        onConfirm={handlePublish}
        initialText="Publish album"
        confirmText="Are you sure?"
      />
      <ConfirmButton
        onConfirm={handleDelete}
        initialText="Delete album"
        confirmText="Are you sure?"
      />
    </form>
  )
}
