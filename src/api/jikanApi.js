const BASE_URL = 'https://api.jikan.moe/v4';

/**
 @param {string} query 
 @returns {Promise<Array>} 
 **/
export async function searchManga(query) {
  if (!query) {
    return [];
  }
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${BASE_URL}/manga?q=${encodedQuery}&limit=20`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching manga from Jikan API:', error);
    throw error;
  }
}

/**
 * @param {string|number} mangaId
 * @returns {Promise<Object>} 
 */
export async function getMangaById(mangaId) {
  try {
    const response = await fetch(`${BASE_URL}/manga/${mangaId}/full`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Manga not found.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching manga with ID ${mangaId}:`, error);
    throw error;
  }
}

/**
 * @param {string|number} mangaId
 * @returns {Promise<Array>}
 */
export async function getMangaReviews(mangaId) {
  try {
    const response = await fetch(`${BASE_URL}/manga/${mangaId}/reviews`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching reviews for manga ID ${mangaId}:`, error);
    throw error;
  }
}

let debounceTimer;
export function debounce(func, delay) {
  return function(...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}