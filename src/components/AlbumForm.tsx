
import React from 'react';
import { ConfirmButton } from './ConfirmButton';

interface AlbumFormProps {
  columns: number;
  setColumns: React.Dispatch<React.SetStateAction<number>>;
  handlePublish: () => void;
  handleDelete: () => void;
}

export const AlbumForm: React.FC<AlbumFormProps> = ({ columns, setColumns, handlePublish, handleDelete }) => {
  return (
    <form>
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
  );
};
