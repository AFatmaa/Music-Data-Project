# Music Data Analysis Project

A simple website that shows music listening statistics for different users. This project uses HTML and JavaScript to read data, find interesting facts, and show them on the page.

This was a solo project for the CodeYourFuture Piscine.

## Live Demo

**Check out the live project here:**
**[https://music-listening-analysis.netlify.app/](https://music-listening-analysis.netlify.app/)**

## What It Does

- You can choose a user from a dropdown menu.
- The page then shows listening stats for that user.
- If a user has no data, or if an answer to a question can't be found, that section is hidden.
- It was built to be fully accessible and scores 100% on Lighthouse tests.

## Features

- **Dynamic User Selection**: A dropdown menu is populated with all available users.
- **Data-Driven UI**: The interface updates dynamically based on the selected user's data.
- **Conditional Rendering**: Questions and answers are only displayed if there is valid data to show. For example, if a user has no "Friday night" listens, that entire section is hidden.
- **Edge Case Handling**: Properly handles users with no data (User 4) and cases where results are not found.
- **Dynamic Titles**: The "Top Genres" title adjusts based on the number of genres found (e.g., "Top 2 Genres", "Top Genre").

### Questions Answered by the Analysis

The application processes the data to answer the following questions for each user:
1.  **Most Listened Song** (by play count and by total listening time)
2.  **Most Listened Artist** (by play count and by total listening time)
3.  **Top Friday Night Song** (by play count and by total listening time)
4.  **Longest Listening Streak** for a single song.
5.  **"Every Day Songs"**: Songs listened to on every single day the user was active.
6.  **Top Genres**: The user's top 3 (or fewer) genres by play count.

## Technologies Used

- **HTML5**
- **Vanilla JavaScript** (with ES Modules)
- **Vitest** for testing
- **Netlify** for deployment (with GitHub Actions)

## Key Learnings

- **Code Reusability**: A generic `findTopItemBy` function was created to handle all "most common" calculations (by count and time), reducing code duplication.
- **Data Enrichment**: To avoid repeatedly calling data-fetching functions, an `getEnrichedHistory` helper was implemented to process all raw data into a clean, standardized format at the beginning. This greatly improves performance and code readability.

## How to Run This Project Locally

1.  **Clone the project:**
    ```bash
    git clone https://github.com/AFatmaa/Music-Data-Project.git
    ```
2.  **Go into the folder:**
    ```bash
    cd Music-Data-Project
    ```
3.  **Install the tools:**
    ```bash
    npm install
    ```
4.  **Start the local server:**
    ```bash
    npm start
    ```
5.  Open the link you see in your terminal (usually `http://127.0.0.1:8080`).

To run the tests, use this command:
```bash
npm test
```