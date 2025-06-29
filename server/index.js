// server/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const libgen = require('libgen');
const { Mangakakalot } = require('mangascrape'); // Keeping MangaScrape for completeness

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Essential for parsing POST request bodies

// Serve static frontend files (from 'dist' folder)
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'dist')));

// --- API Endpoints ---

// Existing endpoint: Search books using Open Library API
app.get('/api/search-books', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required.' });
    }

    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://openlibrary.org/search.json?q=${encodedQuery}&limit=20`; // Increased limit for more results

    try {
        console.log(`[Backend] Searching Open Library for: ${query}`);
        const response = await axios.get(searchUrl);
        const data = response.data;

        if (!data || !data.docs || data.docs.length === 0) {
            console.log(`[Backend] No results found for query: ${query}`);
            return res.json([]);
        }

        const books = data.docs.map(doc => {
            const coverId = doc.cover_i;
            const coverImageUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;

            return {
                id: doc.key?.replace('/works/', ''),
                title: doc.title || 'Unknown Title',
                authors: doc.author_name || ['Unknown Author'],
                firstPublishYear: doc.first_publish_year,
                cover: coverImageUrl,
                averageRating: doc.ratings_average || null,
                ratingsCount: doc.ratings_count || null,
                isbns: doc.isbn || [] // Pass ISBNs to frontend for Libgen search
            };
        }).filter(book => book.title && book.authors.length > 0);

        console.log(`[Backend] Found ${books.length} books for query: ${query}`);
        res.json(books);

    } catch (error) {
        console.error('[Backend] Failed to search Open Library books:', error.message);
        res.status(500).json({ message: 'Error fetching data from Open Library API.', details: error.message });
    }
});


// UPDATED ENDPOINT: Search and get download link from Libgen (now POST)
app.post('/api/libgen-download', async (req, res) => {
    const { title, author, isbn } = req.body; // Data from request body

    if (!title && !author && !isbn) {
        return res.status(400).json({ message: 'At least title, author, or ISBN is required for Libgen search.' });
    }

    try {
        const mirror = await libgen.mirror();
        console.log(`[Backend][Libgen] Using mirror: ${mirror}`);

        const options = {
            mirror: mirror,
            count: 1, // We only need the first, most relevant result
            query: title, // Start with title as the primary query
        };

        if (isbn) {
            options.query = isbn;
            options.search_in = 'identifier';
        } else if (author) {
            options.query = `${title} ${author}`;
            options.search_in = 'def';
        }

        console.log(`[Backend][Libgen] Searching with options:`, options);
        const data = await libgen.search(options);

        if (!data || data.length === 0) {
            console.log(`[Backend][Libgen] No results found for query: ${options.query}`);
            return res.status(404).json({ message: 'Book not found on Libgen with the provided criteria.' });
        }

        const md5 = data[0].md5.toLowerCase();
        const downloadUrl = `${mirror}/book/index.php?md5=${md5}`;

        console.log(`[Backend][Libgen] Found download link: ${downloadUrl}`);
        res.json({ downloadUrl });

    } catch (error) {
        console.error('[Backend][Libgen] Failed to search Libgen for download link:', error.message);
        // More descriptive error messages
        if (error.message.includes("Couldn't retrieve mirror")) {
             res.status(503).json({ message: 'Libgen mirror currently unavailable. Please try again later.', details: error.message });
        } else if (error.message.includes("No such book")) {
             res.status(404).json({ message: 'Book not found on Libgen with the provided criteria.', details: error.message });
        } else {
             res.status(500).json({ message: 'Error searching Libgen. Please try again later or refine your search.', details: error.message });
        }
    }
});


// Initialize MangaKakalot scrapper from mangascrape
const mangakakalotScraper = new Mangakakalot();

// NEW ENDPOINT: Search Manga on MangaKakalot using mangascrape
app.get('/api/mangakakalot/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required for MangaKakalot search.' });
    }

    try {
        console.log(`[Backend][MangaKakalot] Searching for "${query}" using MangaScrape`);
        const { results } = await mangakakalotScraper.search({ query: query });
        console.log(`[Backend][MangaKakalot] Found ${results.length} results.`);
        res.json(results);
    } catch (error) {
        console.error('[Backend][MangaKakalot] Error searching manga with MangaScrape:', error.message);
        res.status(500).json({ message: 'Failed to search MangaKakalot.', details: error.message });
    }
});

// NEW ENDPOINT: Get Manga details (including chapters) from MangaKakalot by ID using mangascrape
app.get('/api/mangakakalot/details/:id', async (req, res) => {
    const mangaKakalotId = req.params.id;

    if (!mangaKakalotId) {
        return res.status(400).json({ message: 'MangaKakalot ID is required.' });
    }

    try {
        console.log(`[Backend][MangaKakalot] Getting details for ID: ${mangaKakalotId} using MangaScrape`);
        const details = await mangakakalotScraper.id(mangaKakalotId);
        if (!details) {
            return res.status(404).json({ message: 'Manga not found on MangaKakalot with the provided ID.' });
        }
        console.log(`[Backend][MangaKakalot] Details fetched for "${details.title}"`);
        res.json(details);
    } catch (error) {
        console.error('[Backend][MangaKakalot] Error fetching manga details by ID with MangaScrape:', error.message);
        res.status(500).json({ message: 'Failed to fetch MangaKakalot details.', details: error.message });
    }
});

// NEW ENDPOINT: Get Chapter Pages from MangaKakalot by Manga ID and Chapter ID using mangascrape
app.get('/api/mangakakalot/pages/:mangaId/:chapterId', async (req, res) => {
    const { mangaId, chapterId } = req.params;

    if (!mangaId || !chapterId) {
        return res.status(400).json({ message: 'MangaKakalot Manga ID and Chapter ID are required.' });
    }

    try {
        console.log(`[Backend][MangaKakalot] Getting pages for Manga ID: ${mangaId}, Chapter ID: ${chapterId} using MangaScrape`);
        const chapterData = await mangakakalotScraper.chapter(mangaId, chapterId);
        if (!chapterData || !chapterData.pages) {
            return res.status(404).json({ message: 'Chapter pages not found for this chapter.' });
        }
        console.log(`[Backend][MangaKakalot] Found ${chapterData.pages.length} pages.`);
        res.json(chapterData.pages); // Return just the array of image URLs
    } catch (error) {
        console.error('[Backend][MangaKakalot] Error fetching chapter pages with MangaScrape:', error.message);
        res.status(500).json({ message: 'Failed to fetch MangaKakalot chapter pages.', details: error.message });
    }
});

// SPA Fallback (for React Router) - MUST BE LAST ROUTE DEFINITION
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access frontend at http://localhost:${PORT}`);
    console.log(`Libgen download API: http://localhost:${PORT}/api/libgen-download (POST)`);
});
