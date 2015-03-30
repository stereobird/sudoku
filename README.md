Sudoku
======

A basic, utilitarian Sudoku game that uses jQuery.

[Sudoku](http://en.wikipedia.org/wiki/Sudoku) is a single-player, logic-based puzzle game. The object is to fill in a 9x9 grid of squares with numbers from 1 to 9, so that no number repeats within each row, column and 3x3 region. The word Sudoku is short for _Su-ji wa dokushin ni kagiru_ which means "the numbers must be single".

- Uses [backtracking](http://en.wikipedia.org/wiki/Sudoku_solving_algorithms) to generate a solved puzzle
- Provides different level-of-difficulty options
- Timer keeps track of game duration (and it's pausable)
- A random haiku is shown when the game enters a solved state
- Uses [Sass](http://sass-lang.com/) to preprocess the CSS (recommended but not required)

Files
=====

- [index.html](https://github.com/stereobird/sudoku/blob/master/index.html)<br />
  Main game layout. It does not need to be called index.html, you can rename it! Or, copy the parts you need from it to another file.
- [sudoku.js](https://github.com/stereobird/sudoku/blob/master/js/sudoku.js)<br />
  The entire game functionality lives here, in an anonymous closure. This file is heavily commented, so you should be able to step through it and make adjustments as you need or want.
- [css.scss](https://github.com/stereobird/sudoku/blob/master/scss/css.scss)<br />
  Sass SCSS file. Ideally, use this to make your CSS edits. If you don't want to, you can brave the Sass-generated `css.css` file below instead.
- [_reset.css](https://github.com/stereobird/sudoku/blob/master/scss/_reset.scss)<br />
  Sass partial file, gets included when `css.css` is generated. If you aren't using Sass, just use the `css.css` file below.
- [css.css](https://github.com/stereobird/sudoku/blob/master/css/css.css)<br />
  Generated CSS file. If you are using Sass, make your edits in `css.scss` above. If you are not using Sass, you can edit this file.

Dependencies
============

##### Runtime
jQuery is loaded in the `<head>` of `index.html`:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
```

If you want to run this game locally, save a local copy of jQuery and point to it, instead.

##### Build/Edit
Sass is highly recommended for the CSS portion, but not absolutely required.

Configuration
=============

In `sudoku.js`, there are a couple of configurable items in addition to some initial variable declarations:

```js
var uimap = {},
    map = {},
    key = [],
    time,
    timer,
    difficulty = 45,
    small = window.matchMedia("only screen and (max-width: 760px)");
```

All of these things need to exist at this level in the scope so that various functions can access them. Empty declarations are `uimap`, `map`, `key`, `time` and `timer`. The first three are used for the grid of numbers in a current board. `time` and `timer` need to be accessed to pause/start the game timer appropriately.

##### Game Difficulty
```js
difficulty = 45,
```

`difficulty` is the _initial_ board's difficulty setting, from 1 (easiest) to 100 (hardest). This setting applies to the board loaded at runtime only, not a board generated from the easy/hard/hopeless buttons. Default is 45, which means about 45% of cells will be empty in the initial game board.

```js
easy = $("<div>").attr("class", "btn").attr("id", "btneasy").attr("data-diff", "25").html("EASY");
hard = $("<div>").attr("class", "btn").attr("id", "btnhard").attr("data-diff", "50").html("HARD");
hopeless = $("<div>").attr("class", "btn").attr("id", "btnhopeless").attr("data-diff", "80").html("HOPELESS");
```
If you want to change the difficulty levels for the easy/hard/hopeless buttons, changes can be made in `sudoku.newgame`. Default difficulty levels are easy: 25, hard: 50, hopeless: 80. You can also remove or add buttons here.

##### Mobile Consideration
```js
small = window.matchMedia("only screen and (max-width: 760px)");
```

The "760px" portion of `small` is the threshold at which a mobile keyboard is prevented. What this means is that mobile devices (or any screen under 760 pixels wide) will have empty input cells set to "readonly", so users shouldn't have their game covered up by their device's keyboard. Users on such screens will be required to use the number buttons to fill in empty cells. You can adjust the width as desired. Set it super high to eliminate keyboard entry for just about everyone.

`small` is the threshold at which a mobile keyboard is prevented. What this means is that mobile devices (or any screen under 760px wide) will have empty cells set to "readonly", so they shouldn't have their game covered up by their device's keyboard. They will be required to use the number buttons to fill in empty cells. You can adjust the width as desired.

```js
if (small.matches) {
    $("#x" + m + i).attr("readonly", "readonly");
}
```

You may want to use a different behavior, such as changing the input `type` to "number" and adding `min` and `max` attributes for mobile devices.

##### Immediate Start
If you want to prevent a game from automatically starting on initial page load (the default behavior), you can remove the last two lines from the `sudoku.init` function.

```js
sudoku.init = function() {
    $("#sudoku").html(sudoku.makeboard());
    sudoku.clearmap();
    sudoku.buildgame(0,0);
    sudoku.timer("start",0);
};
```

`$("#sudoku").html(sudoku.makeboard());` creates an empty board, this is required.

`sudoku.clearmap()` prepares the `map` object structure (and clears out an existing, populated one when necessary), this is also required.

`sudoku.buildgame(0,0)` creates a playable set of numbers. This can safely be removed.

`sudoku.timer("start",0)` starts the game timer (at zero). This can safely be removed.

If `sudoku.buildgame(0,0)` and `sudoku.timer("start",0)` are removed, and you want to show the "new game" dialog on page load, just add `sudoku.newgame();` to `sudoku.init`.

Gameplay
========

When `index.html` is loaded, a new game begins immediately. The timer starts counting from 00:00, and the game is in an _active_ state.

A user can enter numbers in empty or editable cells by:
- clicking an empty/editable cell and then clicking a number button
- clicking an empty/editable cell and then typing a number (non-mobile only)
- tabbing into an empty/editable cell and then clicking a number button (non-mobile only)
- tabbing into an empty/editable cell and then typing a number (non-mobile only)

Cell inputs are restircted to numbers 1-9 only, users are not able to enter any other character or digit. An active editable cell can be emptied by clicking the "X" button in the number button bar, or using delete/backspace keys appropriately (non-mobile only).

At any point during an _active_ or _paused_ game, a user can select the "new game" button to bring up the "new game" dialog.

A user can give up at any time during an _active_ or _paused_ game by clicking the "give up" button. The game will enter an _ended_ state and game statistics will be shown to the user for that game:
- number of cells the user had correct
- number of cells the user left empty
- number of cells the user had incorrect

A user can check their game progress by clicking the "check" button at any time in an active game. If any cells are empty, the user will be notified how many empty cells are remaining. If any rows, columns or regions contain duplicate numbers, the user will be notified that duplicates exist _somewhere_ on the board. It is the user's responsibility to figure out _where_.

When the last empty cell is filled in by the user, the check process runs automatically, and the user will be notified if any duplicates exist on the board. If the board is valid, the timer will be stopped and the user will be notified of a successful solve (an _ended_ state).

A user can pause an active game at any time by clicking the game timer. The time will stop and the game will enter a _paused_ state -- all numbers are hidden from view in a _paused_ state to discourage cheating, in case someone would actually cheat at Sudoku. The game and timer will resume when the user clicks the giant "play" button that covers the board while in a _paused_ state.

Each editable cell on the board is changed to show where the statistics apply in this specific _ended_ state. Correct cells are shown in green, empty cells are filled in with a light gray color number, and incorrect cells are shown in red (but with the incorrect number corrected).

In any _ended_ state, a "play again" button is shown. Clicking this button brings up the "new game" dialog, where a user can select a difficulty level for the new game. The _ended_ state also displays a random haiku about Sudoku, for no good reason.

Attribution
===========

Inspired by Peter Norvig's [python backtracking](http://norvig.com/sudoku.html).
Portions of the generator and cell traversal contained herein have roots in Moriel Schottlender's [javascript backtracking algorithm](http://moriel.smarterthanthat.com/tips/javascript-sudoku-backtracking-algorithm/).
`_reset.scss` is the good ol' [meyerweb reset](http://meyerweb.com/eric/tools/css/reset/).

Changelog
=========

#### 2015-03-30
- Added two more haiku for _solved_ game state
- Removed a couple errant spaces, combined a redundant binding

#### 2015-03-29
- Eliminated precedence of empty cells in _checked_ state (show empty cells AND duplicate notice)
- Added gameplay documentation
- Reformatted js and scss (farewell, tabs)

#### 2015-03-28
- Fixed timer being restartable in _solved_ game state
- Show haiku only in _solved_ game state, not during _checked_ state
- Added cancel button to new game dialog, when game is in active state

#### 2015-03-27
- v1.0
- Cleaned up code, added documentation

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

After reading quite a bit about backtracking algorithms and their connection to Sudoku, I worked on replacing the board generation. I started at the python code that does the same thing (http://norvig.com/sudoku.html), and based the generator backtracking and cell traversal on portions of code by Moriel Schottlender  (http://moriel.smarterthanthat.com/tips/javascript-sudoku-backtracking-algorithm/).

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