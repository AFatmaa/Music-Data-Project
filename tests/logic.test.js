import { describe, it, expect } from "vitest";
import { findEveryDaySongs } from '../logic.js';

describe('findEveryDaySong', () => {

  // A standard case where there is exactly one "every day song".
  it('should return the single song that was played on every unique listening day', () => {

    // User listened on 3 different days. Only 'Song A' was played on all 3 days.
    const mockHistory = [
      // Day 1: 2023-01-01
      { timestamp: new Date('2023-01-01T10:00:00Z').getTime(), song: { artist: 'Artist A', name: 'Song A' } },
      { timestamp: new Date('2023-01-01T11:00:00Z').getTime(), song: { artist: 'Artist B', name: 'Song B' } },
      // Day 2: 2023-01-02
      { timestamp: new Date('2023-01-02T12:00:00Z').getTime(), song: { artist: 'Artist A', name: 'Song A' } },
      { timestamp: new Date('2023-01-02T13:00:00Z').getTime(), song: { artist: 'Artist C', name: 'Song C' } },
      // Day 3: 2023-01-03
      { timestamp: new Date('2023-01-03T14:00:00Z').getTime(), song: { artist: 'Artist A', name: 'Song A' } },
    ];

     // Run the function we are testing with our mock data.
     const result = findEveryDaySongs(mockHistory);

    // Check if the result is what we expect.
    // The result should be an array containing only the full name of Song A.
    expect(result).toEqual(['Artist A - Song A']);
  });

  // A case where no song meets the criteria.
  it('should return an empty array if no song was played every day', () => {
    
    // Similar data, but now 'Song A' is missing from the last day.
    const mockHistory = [
      { timestamp: new Date('2023-01-01T10:00:00Z').getTime(), song: { artist: 'Artist A', name: 'Song A' } },
      { timestamp: new Date('2023-01-02T12:00:00Z').getTime(), song: { artist: 'Artist A', name: 'Song A' } },
      { timestamp: new Date('2023-01-03T14:00:00Z').getTime(), song: { artist: 'Artist B', name: 'Song B' } }, // Song A is not here
    ];

    // Run the function...
    const result = findEveryDaySongs(mockHistory);

    // The result should be an empty array.
    expect(result).toEqual([]);
  });

  // What happens if the user has no listening history?
  it('should return an empty array for an empty history', () => {
    
    // An empty history array.
    const mockHistory = [];

    // Run the function...
    const result = findEveryDaySongs(mockHistory);

    // The result must be an empty array.
    expect(result).toEqual([]);
  });

  // A case where more than one song meets the criteria.
  it('should return multiple songs if they are all played every day', () => {
     
    // User listens on only 2 days, and both Song A and B are played on both days.
     const mockHistory = [
      { timestamp: new Date('2023-01-01T10:00:00Z').getTime(), song: { artist: 'Artist A', name: 'Song A' } },
      { timestamp: new Date('2023-01-01T11:00:00Z').getTime(), song: { artist: 'Artist B', name: 'Song B' } },
      { timestamp: new Date('2023-01-02T12:00:00Z').getTime(), song: { artist: 'Artist A', name: 'Song A' } },
      { timestamp: new Date('2023-01-02T13:00:00Z').getTime(), song: { artist: 'Artist B', name: 'Song B' } },
    ];

    // Run the function...
    const result = findEveryDaySongs(mockHistory);

    // The result should be an array with both song names.
    // We use .sort() on both arrays to make sure the test passes regardless of the order.
    expect(result.sort()).toEqual(['Artist A - Song A', 'Artist B - Song B'].sort());
  });
});