import { useFireproof } from 'use-fireproof';
import { Link } from 'react-router-dom';

export function Imports() {
  const { useLiveQuery } = useFireproof('gallery');

  const uploads = useLiveQuery(
    (doc, emit) => {
      if (doc.type === 'upload') {
        emit(doc.created);
      }
    },
    { descending: true }
  );
  return (
    <>
      <h2>Recent Imports</h2>
      <ul className="list-inside list-none">
        {uploads.docs.map(upload => (
          <li key={upload._id} className="p-2">
            <Link
              to={`/upload/${upload._id}`}
              className="block hover:bg-gray-100dark: hover:bg-gray-800 rounded px-2"
            >
              <span className="text-xs text-gray-500 block pb-2">
                {new Date(upload.created as number).toLocaleString()}
              </span>
              <span className="inline-block mr-2">
                {upload.count?.toString()} {upload.count === 1 ? 'file' : 'files'}
              </span>
              <span className="inline-block text-slate-700">({upload.status?.toString()})</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
