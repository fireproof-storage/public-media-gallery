import { AlbumSettings } from "./components/AlbumForm";

export function albumRenderHTML(albumName: string, imageDocs: { cid: string, name: string }[], settings: AlbumSettings) {
  const { color, bgColor, columns } = settings;

  // Generate list items for images
  const imageListItems = imageDocs.map(({ cid, name }: { cid: string, name: string }) => {
    return `
      <li style="background-color: ${bgColor};">
        <img src="https://${cid}.ipfs.w3s.link" alt="${name}" style="width: 100%; height: auto;" />
      </li>
    `;
  }).join('');

  // Create the HTML string
  const htmlString = `
  <!doctype html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        color: ${color};
        background-color: ${bgColor};
        font-family: sans-serif;
        text-align: center;
      }
      ul {
        display: grid;
        list-style: none;
        grid-template-columns: repeat(${columns}, 1fr);
        gap: 16px;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">
      ${albumName}
    </h1>
    <ul>
      ${imageListItems}
    </ul>
  </body>
  </html>
`;

  return htmlString;
}