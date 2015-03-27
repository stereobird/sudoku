# Sudoku

This is an in-progress, basic Sudoku game that relies heavily on jQuery.

Current status is: playable! working!




## Rough Changelog

#### 2015-03-26
- Added a timer that shows mins:secs. You can pause it and the game will hide the numbers from you until you un-pause.
- Added difficulty selector when starting a new game
  - Easy (25-35 empty cells on average)
  - Hard (35-50 empty cells on average)
  - Hopeless (60-75 empty cells on average)
- Restructured css to focus on small displays first, then large ones... instead of the other way around
- Added haiku messages when a game reaches a solved state

#### 2015-03-25
The generator builds a "solved" board, then some numbers are removed randomly. I did like the crude randomness of the previous iteration's removal of numbers from the board, so I carried that over. Sometimes you'll get a board that is a lot easier or harder than other times, it's not rigid that way.

The board can solve the puzzle for you (just to taunt you maybe), or it can validate your attempts.

#### 2015-03-24
OK. The board was not great. A valid, solvable board would be generated -- but in a boring, predictable state (1,2,3,4,5,6,7,8,9 / 4,5,6,7,8,9,1,2,3...). Then it would shuffle those numbers randomly, but it could only do it in a limited pattern, to stay valid/solvable overall. So I'd end up with a repeating pattern, that once recognized, made the entire board easy to solve and not random at all.

After reading quite a bit about backtracking algorithms and their connection to Sudoku, I worked on replacing the board generation. It's based on the python code that does the same thing: http://norvig.com/sudoku.html

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
