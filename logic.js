import { count } from 'console';
import { getListenEvents, getSong } from './data.mjs';

// ----------------------------------------------------------------
// # SECTION 1: DATA ENRICHMENT
//
// This section is for fetching and preparing the raw data
// into a more usable format.
// ----------------------------------------------------------------

/**
 * Fetches raw listen events and enriches them with full song details.
 * This is the most important helper function. It creates a clean data structure
 * that all other analysis functions will use.
 *
 * @param {string} userID The ID of the user.
 * @returns {Promise<object[]>} A promise that resolves to an array of "enriched" listen events.
 */
export async function getEnrichedHistory(userID) {
  const listenEvents = await getListenEvents(userID);
  if (!listenEvents || listenEvents.length === 0) {
    return [];
  }

  const songPromises = listenEvents.map(event => getSong(event.song_id));
  const songs = await Promise.all(songPromises);

  // Combine listen events with full song details into a clean format.
  return listenEvents.map((event, index) => {
    const songData = songs[index];
    return {
      timestamp: event.timestamp,
      song: {
        id: songData.id,
        name: songData.title, // Standardise 'title' to 'name'
        artist: songData.artist,
        duration: songData.duration_seconds, // Standardise 'duration_seconds' to 'duration'
        genre: songData.genre,
      },
    };
  });
}

// ----------------------------------------------------------------
// # SECTION 2: CORE ANALYSIS FUNCTIONS
//
// These functions perform the main data analysis tasks based on
// the questions in the project requirements.
// ----------------------------------------------------------------

/**
 * A generic function to find the most common item based on a property.
 * Reusable for finding the most common song, artist, etc.
 * @returns {string | null} The item with the highest count.
 */
function findMostCommonBy(history, propertyExtractor, valueExtractor = () => 1) {
  const totals = new Map();

  for (const item of history) {
    const key = propertyExtractor(item);
    const value = valueExtractor(item);
    totals.set(key, (totals.get(key) || 0) + value);
  }

  if (totals.size === 0) {
    return null;
  }

  const maxEntry = [...totals.entries()].reduce((a, b) => (b[1] > a[1] ? b : a));
  return maxEntry[0];
}

// --- Question 1 & 4 (Most Listened Song & Artist) ---
export function getMostListenedSongByCount(history) {
  return findMostCommonBy(history, item => item.song.name);
}
export function getMostListenedSongByTime(history) {
  return findMostCommonBy(history, item => item.song.name, item => item.song.duration);
}
export function getMostListenedArtistByCount(history) {
  return findMostCommonBy(history, item => item.song.artist);
}
export function getMostListenedArtistByTime(history) {
  return findMostCommonBy(history, item => item.song.artist,item => item.song.duration);
}

// --- Question 3 (Friday Night) ---
export function filterForFridayNight(history) {
  return history.filter(event => {
    const date = new Date(event.timestamp);
    const day = date.getDay(); // 5 = Friday, 6 = Saturday
    const hour = date.getHours(); 

    const isFridayEvening = (day === 5 && hour >= 17);
    const isSaturdayMorning = (day === 6 && hour < 4);

    return isFridayEvening || isSaturdayMorning;
  });
}

// --- Question 5 (Longest Streak) ---
export function findLongestStreak(history) {
  if (history.length === 0) return null;

  let longestStreak = { name: '', count: 0 };
  let currentStreak = { name: '', count: 0 };

  for (const event of history) {
    if (event.song.name === currentStreak.name) {
      currentStreak.count++;
    } else {
      currentStreak = { name: event.song.name, count: 1 };
    }

    if (currentStreak.count > longestStreak.count) {
      longestStreak = { ...currentStreak };
    }
  }
  // A streak is only a streak if it's more than 1
  return longestStreak.count > 1 ? longestStreak : null;
}

// --- Question 6 (Every Day Songs) ---
export function findEveryDaySongs(history) {
  if (history.length === 0) return [];

  const songListenDays = new Map();
  const allListenDays = new Set();

  for (const event of history) {
    const listenDate = new Date(event.timestamp).toISOString().slice(0, 10);
    allListenDays.add(listenDate);

    const songName = event.song.name;
    if (!songListenDays.has(songName)) {
      songListenDays.set(songName, new Set());
    }
    songListenDays.get(songName).add(listenDate);
  }

  const everyDaySongs = [];
  for (const [songName, listenDays] of songListenDays.entries()) {
    if (listenDays.size === allListenDays.size) {
      everyDaySongs.push(songName);
    }
  }
  return everyDaySongs;
}

// --- Question 7 (Top Genres) ---
export function getTopGenres(history) {
  const genreCounts = new Map();
  for (const event of history) {
    const genre = event.song.genre;
    genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
  }

  const sortedGenres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]);
  return sortedGenres.slice(0, 3).map(entry => entry[0]);
}