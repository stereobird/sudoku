# Sudoku

This is an in-progress, basic Sudoku game that relies heavily on jQuery.

Current status is: playable, but not super-friendly. Generates a random, solvable board on-demand, validates without excitement.


## Upcoming
Need:
- Mobile playability improvement

Considering:
- A game timer
- In-game hints
- Better validation (a "solve" button that will correct/show mistakes, fill in empty cells)
- Difficulty selector


## Rough Changelog

#### 2015-03-23
A playable board!
- Introduced SASS for CSS preprocessing.
- Has a "test" button to provide feedback about board status.
- Characters limited to 1-9
- Use a keyboard or use the number buttons on-screen to enter numbers in an active cell
- Rudimentary responsiveness (max 500px board, shrinks to as small as 200px)

I think I'll rework the entire validation approach so the game can provide more meaningful feedback, or solve the board with indicators of user error(s).

#### 2015-03-22
Basic board structure and board generation, validation.