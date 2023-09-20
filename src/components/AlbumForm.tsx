import React from 'react'
import { ConfirmButton } from './ConfirmButton'
import type { Range1To6 } from './ImageDocList'
export interface AlbumSettings {
  columns: Range1To6
  color: string
  bgColor: string
}

interface AlbumFormProps {
  settings: AlbumSettings
  setSettings: (settings: AlbumSettings) => void
  handlePublish: () => void
  handleDelete: () => void
  publishUrl: string
}

export const AlbumForm: React.FC<AlbumFormProps> = ({
  settings,
  setSettings,
  handlePublish,
  handleDelete,
  publishUrl
}) => {
  const { columns, color, bgColor } = settings

  const customStyle = {
    backgroundColor: bgColor,
    color
  }

  const updateSettings = (key: keyof AlbumSettings, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <form style={customStyle} className="rounded p-2 my-2">
      <label htmlFor="column-slider">Columns: </label>
      <input
        id="column-slider"
        type="range"
        min="1"
        max="6"
        step="1"
        value={columns}
        onChange={e => updateSettings('columns', Number(e.target.value))}
      />
      <span>{columns}</span>
      <br />

      <label htmlFor="color-picker">Color: </label>
      <input
        id="color-picker"
        type="color"
        value={color}
        onChange={e => updateSettings('color', e.target.value)}
      />
      <br />

      <label htmlFor="bg-color-picker">Background Color: </label>
      <input
        id="bg-color-picker"
        type="color"
        value={bgColor}
        onChange={e => updateSettings('bgColor', e.target.value)}
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
      {publishUrl && (
        <p>
          Published at <a target="_blank" className='underline' href={publishUrl}>the album URL</a>. (<button onClick={(e)=>{
            e.preventDefault()
            navigator.clipboard.writeText(publishUrl)
          }}>Click here to copy.</button>)
        </p>
      )}
    </form>
  )
}
