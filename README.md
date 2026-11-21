# folio. — Your Personal Reading Room

folio. is a responsive, frontend-only book inventory app for collecting the books you own, tracking what you think of them, and keeping useful details close at hand. It is built with React and Create React App and is ready to run locally or deploy as a static site.

## Features

- Browse a curated starter shelf and your own books in a responsive book-cover grid.
- Add and edit books with a title, author, publisher, publication date, genre, synopsis or personal notes, cover image, and a 0–5 star rating.
- Add a cover by pasting an HTTP(S) image URL or uploading an image file (up to 1 MB).
- Search across titles, authors, publishers, and genres; filter by genre or favorites; sort alphabetically, by rating, or by publication date.
- Mark favorites, open a full book detail page, and remove books with a confirmation prompt.
- Keep changes between visits using the browser's local storage. No server or account is needed.
- Use the app on desktop, tablet, or mobile, with keyboard-accessible controls and form validation.

## Requirements

- Node.js (an active LTS release is recommended)
- npm (included with Node.js)

## Run locally

From the project directory, install the dependencies recorded in `package-lock.json` and start the development server:

```bash
npm ci
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000). To create an optimized production build:

```bash
npm run build
```

The generated static site is written to `build/`.

## Deploy to Vercel

Import the repository into Vercel and use the Create React App defaults:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `build` |
| Install command | `npm ci` |

The app uses React Router for `/books/:id` detail pages. If direct visits or refreshes on those paths return a 404 in your Vercel project, add a `vercel.json` file at the repository root with this rewrite:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## Data and privacy

This version has no backend or cross-device sync. Books are stored in the current browser's local storage, so they are private to that browser and are not shared with other users or devices. Clearing browser site data can remove the collection. Uploaded cover images are stored in the browser along with the book; keep them at or below 1 MB to reduce the chance of reaching the browser's storage limit. If the browser cannot save a change, folio. displays a notice instead of pretending it was saved.

The included starter books are created the first time the app opens in a browser. To start with an empty shelf, clear the `folio.books.v1` local-storage entry for the site before opening the app again.

## Project structure

```text
public/                 Static assets and HTML entry point
src/
  books.js              Starter data and local-storage helpers
  App.js                React Router routes
  index.js              React entry point
  index.css             Shared theme and base styles
  components/
    Homepage.js         Searchable bookshelf and collection controls
    AddBook.js          Add/edit book dialog and validation
    BookDetails.js      Book detail page
```

## Available scripts

- `npm start` — run the development server.
- `npm run build` — create a production build in `build/`.
- `npm test` — run the Create React App test runner.
