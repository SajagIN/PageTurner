import axios from 'axios';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const LIBGEN_BACKEND_URL = '/api/libgen';


/**
 * @param {string} bookId
 * @returns {Promise<Object>}
 */
export const getOpenLibraryBookDetails = async (bookId) => {
    try {
        const response = await axios.get(`${OPEN_LIBRARY_BASE_URL}/works/${bookId}.json`);
        const data = response.data;

        const authorsPromises = data.authors ? data.authors.map(author =>
            axios.get(`${OPEN_LIBRARY_BASE_URL}${author.author.key}.json`)
        ) : [];
        const authorsData = await Promise.all(authorsPromises);
        const authorsNames = authorsData.map(res => res.data.name);

        let isbns = [];
        let pageCount = null;
        if (data.covers && data.covers.length > 0) {
            const editionsResponse = await axios.get(`${OPEN_LIBRARY_BASE_URL}/works/${bookId}/editions.json?limit=1`);
            if (editionsResponse.data.entries && editionsResponse.data.entries.length > 0) {
                const edition = editionsResponse.data.entries[0];
                isbns = edition.isbn_10 || edition.isbn_13 || [];
                pageCount = edition.number_of_pages || null;
            }
        }

        let description = 'No description available.';
        if (data.description) {
            if (typeof data.description === 'string') {
                description = data.description;
            } else if (data.description.value) {
                description = data.description.value;
            }
        }

        return {
            id: bookId,
            title: data.title,
            fullTitle: data.full_title || data.title,
            authors: authorsNames,
            publishedDate: data.first_publish_date,
            description: description,
            pageCount: pageCount,
            isbns: isbns,
            imageLinks: {
                thumbnail: data.covers && data.covers.length > 0
                    ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
                    : null
            },
            averageRating: data.rating?.average || 0,
            ratingsCount: data.rating?.count || 0,
            categories: data.subjects ? data.subjects.slice(0, 5) : [],
            previewLink: `https://openlibrary.org/works/${bookId}`
        };
    } catch (error) {
        console.error('Error in getOpenLibraryBookDetails:', error);
        throw new Error('Failed to fetch Open Library book details. ' + (error.response?.data?.error || error.message));
    }
};

/**
 * @param {Object} bookDetails 
 * @returns {Promise<string>} 
 */
export const getLibgenDownloadLink = async ({ title, author, isbn }) => {
    try {
        console.log("Requesting Libgen download link from backend:", { title, author, isbn });
        const response = await axios.post(LIBGEN_BACKEND_URL, {
            title,
            author,
            isbn
        });
        if (response.data && response.data.downloadUrl) {
            return response.data.downloadUrl;
        } else {
            throw new Error('Backend did not return a valid download URL.');
        }
    } catch (error) {
        console.error("Error fetching Libgen download link from backend:", error);
        throw new Error(error.response?.data?.message || 'Failed to get download link from Libgen via backend.');
    }
};

export const searchManga = async (query) => {
    try {
        const response = await axios.get(`${JIKAN_BASE_URL}/manga?q=${encodeURIComponent(query)}`);
        return response.data.data;
    } catch (error) {
        console.error('Error searching manga:', error);
        throw new Error('Failed to search manga on Jikan API.');
    }
};

export const getMangaById = async (id) => {
    try {
        const response = await axios.get(`${JIKAN_BASE_URL}/manga/${id}/full`);
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            throw new Error('Manga not found.');
        }
    } catch (error) {
        console.error(`Error fetching manga with ID ${id}:`, error);
        if (error.response && error.response.status === 404) {
            throw new Error('Manga not found.');
        }
        throw new Error('Failed to fetch manga details.');
    }
};

export const getMangaReviews = async (id) => {
    try {
        const response = await axios.get(`${JIKAN_BASE_URL}/manga/${id}/reviews`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching reviews for manga ID ${id}:`, error);
        throw new Error('Failed to fetch reviews.');
    }
};

export const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};
