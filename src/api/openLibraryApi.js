// src/api/openLibraryApi.js

import axios from 'axios';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const OPEN_LIBRARY_COVERS_URL = 'https://covers.openlibrary.org';
const BACKEND_BASE_URL = 'http://localhost:3001'; // Your backend server URL

/**
 * Debounce function to limit how often a function is called.
 * @param {function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {function} The debounced function.
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

/**
 * Searches for books on Open Library based on a query.
 * @param {string} query The search term (e.g., book title, author name).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of book objects.
 */
export const searchOpenLibraryBooks = async (query) => {
    if (!query) {
        console.warn("No query provided for Open Library search.");
        return [];
    }

    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `${OPEN_LIBRARY_BASE_URL}/search.json?q=${encodedQuery}&limit=20`;

    try {
        console.log(`Searching Open Library URL: ${searchUrl}`);
        const response = await axios.get(searchUrl);
        const data = response.data;

        if (!data || !data.docs || data.docs.length === 0) {
            console.log(`No results found for query: "${query}"`);
            return [];
        }

        const books = data.docs.map(doc => {
            const coverId = doc.cover_i;
            const coverImageUrl = coverId ? `${OPEN_LIBRARY_COVERS_URL}/b/id/${coverId}-M.jpg` : null;

            return {
                id: doc.key?.replace('/works/', ''),
                title: doc.title || 'Unknown Title',
                authors: doc.author_name || ['Unknown Author'],
                firstPublishYear: doc.first_publish_year || null,
                cover: coverImageUrl,
                averageRating: doc.ratings_average || null,
                ratingsCount: doc.ratings_count || null,
            };
        }).filter(book => book.id && book.title && book.authors.length > 0);

        console.log(`Found ${books.length} books for query: "${query}"`);
        return books;

    } catch (error) {
        console.error("Failed to search Open Library books:", error.message);
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            console.error('Error Response Status:', error.response.status);
            console.error('Error Response Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error Request:', error.request);
        }
        throw new Error("Failed to connect to Open Library search. Please try again.");
    }
};

/**
 * Fetches detailed information for a single book using its Open Library Work ID.
 * @param {string} openLibraryWorkId The Open Library Work ID (e.g., OL12345W, without /works/).
 * @returns {Promise<Object|null>} A promise that resolves to a detailed book object or null if not found.
 */
export const getOpenLibraryBookDetails = async (openLibraryWorkId) => {
    if (!openLibraryWorkId) {
        console.error("No Open Library Work ID provided for details fetching.");
        return null;
    }

    const formattedWorkId = openLibraryWorkId.startsWith('/works/') ? openLibraryWorkId : `/works/${openLibraryWorkId}`;
    const detailsUrl = `${OPEN_LIBRARY_BASE_URL}${formattedWorkId}.json`;

    try {
        console.log(`Fetching Open Library book details for ID: ${formattedWorkId}`);
        const response = await axios.get(detailsUrl);
        const data = response.data;

        if (!data) {
            console.log(`No details found for Work ID: ${formattedWorkId}`);
            return null;
        }

        let description = '';
        if (data.description) {
            if (typeof data.description === 'string') {
                description = data.description;
            } else if (data.description.value) {
                description = data.description.value;
            }
        }

        const authors = data.authors ? await Promise.all(
            data.authors.map(async (authorObj) => {
                if (authorObj.author && authorObj.author.key) {
                    return (await getAuthorNameFromOpenLibrary(authorObj.author.key)) || 'Unknown Author';
                }
                return 'Unknown Author';
            })
        ) : [];

        const publishedDate = data.first_publish_date || (data.publish_date ? data.publish_date[0] : null);
        const pageCount = data.number_of_pages || null;
        const categories = data.subjects || [];

        const coverImageUrl = data.covers && data.covers.length > 0 ?
                              `${OPEN_LIBRARY_COVERS_URL}/b/id/${data.covers[0]}-L.jpg` :
                              null;

        return {
            id: openLibraryWorkId,
            title: data.title || 'Unknown Title',
            fullTitle: data.full_title || data.title || 'Unknown Title',
            authors: authors.filter(Boolean),
            description: description,
            pageCount: pageCount,
            categories: categories,
            publishedDate: publishedDate,
            imageLinks: { thumbnail: coverImageUrl || 'https://placehold.co/225x320?text=No+Cover' }, // Placeholder fallback
            previewLink: `${OPEN_LIBRARY_BASE_URL}${formattedWorkId}`,
            infoLink: `${OPEN_LIBRARY_BASE_URL}${formattedWorkId}`,
            averageRating: data.ratings_average || null,
            ratingsCount: data.ratings_count || null,
            // Add ISBNs from editions if available and needed for Libgen search
            isbns: data.isbn_13 || data.isbn_10 || [], // Might need to fetch edition details for comprehensive ISBNs
        };

    } catch (error) {
        console.error(`Failed to fetch Open Library book details for ID ${formattedWorkId}:`, error.message);
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            console.error('Error Response Status:', error.response.status);
        }
        throw new Error("Failed to connect to Open Library for book details. Please try again.");
    }
};

// Helper to get author name by author key (e.g., /authors/OL1A)
const getAuthorNameFromOpenLibrary = async (authorKey) => {
    try {
        const response = await axios.get(`${OPEN_LIBRARY_BASE_URL}${authorKey}.json`);
        return response.data.name || null;
    } catch (error) {
        console.error(`Failed to fetch author details for key ${authorKey}:`, error.message);
        return null;
    }
};

/**
 * Fetches a download link for a book from Libgen via the backend proxy.
 * @param {string} title Book title.
 * @param {string} author Book author (optional).
 * @param {string} isbn Book ISBN (optional).
 * @returns {Promise<string|null>} A promise that resolves to the download URL or null if not found.
 */
export const getLibgenDownloadLink = async ({ title, author, isbn }) => {
    try {
        const params = new URLSearchParams();
        if (title) params.append('title', title);
        if (author) params.append('author', author);
        if (isbn) params.append('isbn', isbn);

        const response = await axios.get(`${BACKEND_BASE_URL}/api/libgen-download?${params.toString()}`);
        return response.data.downloadUrl;
    } catch (error) {
        console.error('Error fetching Libgen download link:', error);
        // Differentiate between 404 (not found) and other errors
        if (error.response && error.response.status === 404) {
            throw new Error('Book not found on Libgen.');
        } else {
            throw new Error(error.response?.data?.message || 'Failed to get download link from Libgen.');
        }
    }
};

