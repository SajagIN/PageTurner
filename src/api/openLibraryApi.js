// src/api/openLibraryApi.js

import axios from 'axios';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const OPEN_LIBRARY_COVERS_URL = 'https://covers.openlibrary.org';

// Use a relative path for backend API calls when deployed on Vercel
const BACKEND_BASE_PATH = '/api';

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
        console.warn("[openLibraryApi] No query provided for Open Library search.");
        return [];
    }

    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `${OPEN_LIBRARY_BASE_URL}/search.json?q=${encodedQuery}&limit=20`;

    try {
        console.log(`[openLibraryApi] Searching Open Library URL: ${searchUrl}`);
        const response = await axios.get(searchUrl);
        const data = response.data;

        if (!data || !data.docs || data.docs.length === 0) {
            console.log(`[openLibraryApi] No results found for query: "${query}"`);
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
                isbns: doc.isbn || [] // Include ISBNs for Libgen search
            };
        }).filter(book => book.id && book.title && book.authors.length > 0); // Ensure minimal data for validity

        console.log(`[openLibraryApi] Found ${books.length} books for query: "${query}"`);
        return books;

    } catch (error) {
        console.error("[openLibraryApi] Failed to search Open Library books:", error.message);
        if (error.response) {
            console.error('[openLibraryApi] Error Response Data:', error.response.data);
            console.error('[openLibraryApi] Error Response Status:', error.response.status);
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
        console.error("[openLibraryApi] No Open Library Work ID provided for details fetching.");
        return null;
    }

    const formattedWorkId = openLibraryWorkId.startsWith('/works/') ? openLibraryWorkId : `/works/${openLibraryWorkId}`;
    const detailsUrl = `${OPEN_LIBRARY_BASE_URL}${formattedWorkId}.json`;

    try {
        console.log(`[openLibraryApi] Fetching Open Library book details for ID: ${formattedWorkId}`);
        const response = await axios.get(detailsUrl);
        const data = response.data;

        if (!data) {
            console.log(`[openLibraryApi] No details found for Work ID: ${formattedWorkId}`);
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
            imageLinks: { thumbnail: coverImageUrl || 'https://placehold.co/225x320?text=No+Cover' },
            previewLink: `${OPEN_LIBRARY_BASE_URL}${formattedWorkId}`,
            infoLink: `${OPEN_LIBRARY_BASE_URL}${formattedWorkId}`,
            averageRating: data.ratings_average || null,
            ratingsCount: data.ratings_count || null,
            isbns: data.isbn_13 || data.isbn_10 || [], // Ensure ISBNs are collected for Libgen
        };

    } catch (error) {
        console.error(`[openLibraryApi] Failed to fetch Open Library book details for ID ${formattedWorkId}:`, error.message);
        if (error.response) {
            console.error('[openLibraryApi] Error Response Data:', error.response.data);
            console.error('[openLibraryApi] Error Response Status:', error.response.status);
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
        console.error(`[openLibraryApi] Failed to fetch author details for key ${authorKey}:`, error.message);
        return null;
    }
};

/**
 * Fetches a download link for a book from Libgen via the backend proxy.
 * Sends a POST request with book details in the body.
 * @param {Object} bookDetails - Object containing title, author, isbn.
 * @returns {Promise<string|null>} A promise that resolves to the download URL or null if not found.
 */
export const getLibgenDownloadLink = async ({ title, author, isbn }) => {
    try {
        console.log(`[openLibraryApi] Requesting Libgen download link from backend: ${BACKEND_BASE_PATH}/libgen-download`);
        const response = await axios.post(`${BACKEND_BASE_PATH}/libgen-download`, {
            title,
            author,
            isbn
        });
        if (response.data && response.data.downloadUrl) {
            console.log(`[openLibraryApi] Received download URL from backend: ${response.data.downloadUrl}`);
            return response.data.downloadUrl;
        } else {
            throw new Error('Backend did not return a valid download URL.');
        }
    } catch (error) {
        console.error("[openLibraryApi] Error fetching Libgen download link from backend:", error);
        // Differentiate between 404 (not found) and other errors
        if (error.response && error.response.status === 404) {
            throw new Error('Book not found on Libgen via backend.');
        } else {
            // Provide more specific message for network errors
            if (error.code === 'ERR_NETWORK') {
                 throw new Error('Network error. Could not connect to the backend server for Libgen. Is the backend running?');
            }
            throw new Error(error.response?.data?.message || 'Failed to get download link from Libgen via backend.');
        }
    }
};

