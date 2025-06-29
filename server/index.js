const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio'); 
const app = express();
const PORT = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());

const LIBGEN_SEARCH_BASE = 'https://libgen.is/search.php';

async function searchLibgenAndGetDownloadLink({ title, author, isbn }) {
    console.log(`Searching Libgen for: Title="${title}", Author="${author}", ISBN="${isbn}"`);
    let query = title;
    if (author) query += ` ${author}`;
    if (isbn) query += ` ${isbn}`;

    try {
        const searchUrl = `${LIBGEN_SEARCH_BASE}?req=${encodeURIComponent(query)}&lgw=1`;
        console.log("Libgen Search URL:", searchUrl);
        const searchResponse = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(searchResponse.data);

        let downloadPageLink = null;
        $('table.c tr').each((i, row) => {
            const columns = $(row).find('td');
            if (columns.length > 5) { 
                const rowTitle = $(columns[2]).text().toLowerCase(); 
                const rowAuthor = $(columns[3]).text().toLowerCase(); 
                // Basic match
                if (rowTitle.includes(title.toLowerCase()) && (!author || rowAuthor.includes(author.toLowerCase()))) {
                    $(columns[9] || columns[8]).find('a').each((j, a) => { 
                        const link = $(a).attr('href');
                        if (link && link.includes('libgen.is') && link.includes('/main/')) {
                           downloadPageLink = link;
                           return false;
                        }
                    });
                    if (downloadPageLink) return false;
                }
            }
        });

        if (!downloadPageLink) {
            throw new Error('No direct download page link found on Libgen search results.');
        }

        console.log("Found Libgen Download Page Link:", downloadPageLink);

        const downloadPageResponse = await axios.get(downloadPageLink, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $$ = cheerio.load(downloadPageResponse.data);

        const finalDownloadLink = $$('a[href*="download.php"]').first().attr('href'); 
        if (finalDownloadLink && !finalDownloadLink.startsWith('http')) {
            const urlObj = new URL(downloadPageLink);
            return `${urlObj.origin}${finalDownloadLink}`;
        }


        if (!finalDownloadLink) {
            throw new Error('Could not extract final download link from Libgen page.');
        }

        return finalDownloadLink;

    } catch (error) {
        console.error("Libgen scraping failed:", error.message, error.response ? error.response.status : '');
        if (error.response && error.response.status === 403) {
            throw new Error('Libgen blocked the request (403 Forbidden). It might have rate-limiting or bot detection in place.');
        }
        throw new Error(`Failed to fetch from Libgen: ${error.message}`);
    }
}

app.post('/api/libgen', async (req, res) => {
    const { title, author, isbn } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required for Libgen search.' });
    }

    try {
        const downloadUrl = await searchLibgenAndGetDownloadLink({ title, author, isbn });
        res.json({ downloadUrl });
    } catch (error) {
        console.error("Error in /api/libgen endpoint:", error.message);
        res.status(500).json({ message: error.message || 'Internal server error while fetching Libgen link.' });
    }
});

app.get('/', (req, res) => {
    res.send('PageTurner Backend is running!');
});

app.listen(PORT, () => {
    console.log(`PageTurner Backend listening on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});
