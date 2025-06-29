# PageTurner

PageTurner is a React-based web application designed to help you discover and explore books using the Open Library API. It also integrates with a Node.js backend to provide direct download links for books via Libgen.

## Features

* **Book Search:** Search for books by title or author using the Open Library API.
* **Book Details:** View comprehensive details for individual books, including synopsis, authors, publication information, and ratings.
* **Libgen Download Integration:** Attempt to find and download books directly from Libgen via a custom backend proxy.
* **Responsive Design:** Optimized for various screen sizes, from mobile to desktop.
* **Modern UI:** Built with React and Material-UI for a clean and intuitive user experience.

## Project Structure

```
PageTurner/
├── index.html
├── public/
│   └── favicon/
├── server/
│   └── index.js
└──src/
    ├── App.jsx
    ├── main.jsx
    ├── ThemeContext.jsx
    ├── api/
    │   ├── jikanApi.js
    │   └── openLibraryApi.js
    ├── components/
    │   ├── BookCard.jsx
    │   ├── MangaCard.jsx
    │   ├── ReviewList.jsx
    │   ├── StarRating.jsx
    │   └── UserReview.jsx
    └── pages/
        ├── BookDetailPage.jsx
        ├── BrowseBooksPage.jsx
        ├── Homepage.jsx
        ├── MangaDetailPage.jsx
        └── MangaPage.jsx

```
## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS recommended)
* npm or Yarn (or Bun)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/PageTurner.git](https://github.com/your-username/PageTurner.git)
    cd PageTurner
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install  # or yarn install or bun install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install  # or yarn install or bun install
    cd .. # Go back to the project root
    ```

### Running Locally (Unified Frontend & Backend)

For a streamlined local development experience that mimics the production setup, run the Node.js server which will also serve the React frontend.

1.  **Build the React Frontend:**
    ```bash
    npm run build
    ```
    This will create a `dist` folder in the project root.

2.  **Start the Unified Server:**
    ```bash
    cd server
    npm start
    ```
    The server will typically run on `http://localhost:3001`. Open this URL in your browser.

    * **Note:** If `libgen.is` changes its HTML structure, the scraping logic in `server/index.js` might break. You may need to inspect `libgen.is` in a browser's developer tools and update the `cheerio` selectors in `server/index.js` accordingly.

## API Services Used

* **Open Library API:** For searching and retrieving book metadata.
* **Libgen (via custom Node.js backend):** For finding book download links (note: this uses web scraping, which can be fragile).

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

## License

This project is licensed under the ISC License.