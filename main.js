import { getUserIDs } from "./data.mjs";
import * as logic from './logic.js'; // Import all logic functions at once

// ----------------------------------------------------------------
// DOM ELEMENT REFERENCES
// ----------------------------------------------------------------

const userSelect = document.getElementById('user-select');
const resultContainer = document.getElementById('results-container');


// ----------------------------------------------------------------
// APPLICATION LOGIC
// Core logic to handle user interaction and display data.
// ----------------------------------------------------------------

/**
 * Main function to fetch and display all statistics for a given user.
 * This is called whenever the user selects a new user from the dropdown.
 */
async function displayStatsForUser(userID) {
  resultContainer.innerHTML = '<h2>Loading data...</h2>';

  const history = await logic.getEnrichedHistory(userID);  

  resultContainer.innerHTML = ''; // Clear loading message

  if (history.length === 0) {
    resultContainer.innerHTML = '<p>This user has no listening data.</p>';
    return;
  }

  // --- Create the main table structure to hold all results ---
  const table = document.createElement('table');
  table.setAttribute('border', '1'); // Add a simple border
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  /**
   * Helper function to add a new row to our results table.
   * It does nothing if the answer value is empty or null.
   * @param {string} question - The text for the left column.
   * @param {string | string[] | null} answer - The answer for the right column.
   */
  function addRowToTable(question, answer) {
    if(!answer || (Array.isArray(answer) && answer.length === 0)) {
      return; // Don't add a row if there is no answer
    }
    const row = document.createElement('tr');

    const questionCell = document.createElement('td');
    questionCell.style.fontWeight = 'bold';
    questionCell.textContent = question;

    const answerCell = document.createElement('td');
    answerCell.textContent = Array.isArray(answer) ? answer.join(', ') : answer;

    row.appendChild(questionCell);
    row.appendChild(answerCell);
    tbody.appendChild(row);
  }
  
  // --- Get all results and add them as rows to the table ---

  addRowToTable('Most Listened Song (by count)', logic.getMostListenedSongByCount(history));
  addRowToTable('Most Listened Song (by time)', logic.getMostListenedSongByTime(history));
  addRowToTable('Most Listened Artist (by count)', logic.getMostListenedArtistByCount(history));
  addRowToTable('Most Listened Artist (by time)', logic.getMostListenedArtistByTime(history));

  const fridayHistory = logic.filterForFridayNight(history);
  if (fridayHistory.length > 0) {
    addRowToTable('Friday Night Song (by count)', logic.getMostListenedSongByCount(fridayHistory));
    addRowToTable('Friday Night Song (by time)', logic.getMostListenedSongByTime(fridayHistory));
  }

  const streak = logic.findLongestStreak(history);
  if (streak) {
    addRowToTable('Longest Streak Song', `${streak.name} (length: ${streak.count})`);
  }

  addRowToTable('Every Day Song', logic.findEveryDaySongs(history));

  const topGenres = logic.getTopGenres(history);
  if (topGenres.length > 0) {
    const title = `Top ${topGenres.length > 1 ? topGenres.length : ''} Genre${topGenres.length > 1 ? 's' : ''}`.trim();
    addRowToTable(title, topGenres);
  }

  // Finally, append the fully constructed table to the page
  resultContainer.appendChild(table);
}

/**
 * Initializes the application.
 * Populates the user dropdown and sets up the event listener.
 */
async function init() {
  const userIDs = await getUserIDs();
  for (const id of userIDs) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = `User ${id}`;
    userSelect.appendChild(option);
  }

  userSelect.addEventListener('change', (event) => {
    const selectedUserID = event.target.value;
    if (selectedUserID) {
      displayStatsForUser(selectedUserID);
    } else {
      resultContainer.innerHTML = ''; // Clear results if the default option is chosen
    }
  });
}

// --- START THE APP ---
init();
