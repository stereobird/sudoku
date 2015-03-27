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

##### Runtime #####
jQuery is loaded in the `<head>` of `index.html`:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
```

If you want to run this game locally, save a local copy of jQuery and point to it, instead.

##### Build/Edit #####
Sass is highly recommended for the CSS portion, but not absolutely required.

Configuration
=============

In `sudoku.js`, there are a couple of configurable items in addition to some initial variable declaration:

```js
var uimap = {},
    map = {},
    key = [],
    time,
    timer,
    difficulty = 45,
    small = window.matchMedia("only screen and (max-width: 760px)");
```

All of these things need to exist here in the scope so that various functions can access them. Empty declarations are `uimap`, `map`, `key`, `time` and `timer`. The first three are used for the grid of numbers in a current board. `time` and `timer` need to be accessed to pause/start the game timer appropriately.

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

```js
small = window.matchMedia("only screen and (max-width: 760px)");
```

The "760px" portion of `small` is the threshold at which a mobile keyboard is prevented. What this means is that mobile devices (or any screen under 760 pixels wide) will have empty input cells set to "readonly", so users shouldn't have their game covered up by their device's keyboard. Users on such screens will be required to use the number buttons to fill in empty cells. You can adjust the width as desired. Set it super high to eliminate keyboard entry for just about everyone.

```js
if (small.matches) {
    $("#x" + m + i).attr("readonly", "readonly");
}
```

You may want to use a different behavior, such as changing the input `type` to "number" and adding `min` and `max` attributes for mobile devices.

Attribution
===========

Inspired by Peter Norvig's [python backtracking](http://norvig.com/sudoku.html).
Portions of the generator and cell traversal contained herein have roots in Moriel Schottlender's [javascript backtracking algorithm](http://moriel.smarterthanthat.com/tips/javascript-sudoku-backtracking-algorithm/).
`_reset.scss` is the good ol' [meyerweb reset](http://meyerweb.com/eric/tools/css/reset/).

Changelog
=========

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
