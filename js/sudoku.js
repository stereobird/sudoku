(function(sudoku, $, undefined) {

  var uimap = {},
    map = {},
    key = [],
    time,
    timer,
    difficulty = 45,
    small = window.matchMedia("only screen and (max-width: 760px)");

  sudoku.init = function() {
    $("#sudoku").html(sudoku.makeboard());
    sudoku.clearmap();
    sudoku.buildgame(0,0);
    sudoku.timer("start",0);
  };

  sudoku.buildgame = function(row,col) {
    var rowi,
      coli,
      nums,
      rgri,
      rgci,
      regi,
      next = sudoku.getnextempty(row,col),
      i;
    if (next) {
      // get coords of the empty cell
      rowi = next.data('row');
      coli = next.data('col');
      // now get a list of possible numbers to try here
      nums = sudoku.getavailnums(rowi,coli);
      // calculate the region map index
      rgri = Math.floor(rowi / 3);
      rgci = Math.floor(coli / 3);
      regi = (rowi % 3) * 3 + (coli % 3);
      // try out possible values for the empty cell
      for (i = 0; i < nums.length; i++) {
        // update value in input
        next.val(nums[i]);
        // update value in row/column/region maps
        map.row[rowi][coli] = nums[i];
        map.col[coli][rowi] = nums[i];
        map.reg[rgri][rgci][regi] = nums[i];
        // keep trying (recursive)
        if (sudoku.buildgame(rowi,coli)) {
          return true;
        }
        // number didn't work, get it out of here
        // clear the input
        uimap[rowi][coli].val("");
        // remove from maps
        map.row[rowi][coli] = "";
        map.col[coli][rowi] = "";
        map.reg[rgri][rgci][regi] = "";
      }
      // no number worked here, recursively step backwards
      return false;
    }
    // no empties exist, prepare the board for playing
    sudoku.makeplayable(map.row, difficulty);
    return true;
  };

  sudoku.getnextempty = function(x,y) {
    // step through the ui representation of the board and find the next empty cell
    // x and y are the starting coords (0,0 = top left corner)
    var stepx,
      stepy,
      i;
    for (i = (y + 9*x); i < 81; i++) {
      stepx = Math.floor( i / 9 );
      stepy = i % 9;
      if (map.row[stepx][stepy] === '' ) {
        return uimap[stepx][stepy];
      }
    }
  };

  sudoku.clearmap = function() {
    var i,
      ii,
      iii;
    map = {'row':{}, 'col':{}, 'reg':{}};
    // make a map for rows and columns
    for (i = 0; i < 9; i++) {
      map.row[i] = ["","","","","","","","",""];
      map.col[i] = ["","","","","","","","",""];
    }
    // make a map for regions
    for (ii = 0; ii < 3; ii++) {
      map.reg[ii] = [];
      for (iii = 0; iii < 3; iii++) {
        map.reg[ii][iii] = ["","","","","","","","",""];
      }
    }
  };

  sudoku.getavailnums = function(row,col) {
    var regx = Math.floor(row / 3),
      regy = Math.floor(col / 3),
      nums = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      smnu = [],
      i;
    // we only want nums[] to contain numbers that might work for the cell
    nums = sudoku.uniquesnowflake(nums,map.col[col]);
    nums = sudoku.uniquesnowflake(nums,map.row[row]);
    nums = sudoku.uniquesnowflake(nums,map.reg[regx][regy]);
    // then we shuffle nums[] so we don't end up with 1,2,3... ordering all over
    while (nums.length) {
      // pick a number from the nums array randomly
      i = Math.floor(Math.random() * nums.length);
      // and then move it to the shuffled nums array ("smnu")
      smnu.push(nums.splice(i, 1)[0]);
    }
    return smnu;
  };

  // remove any numbers that exist in a cell's row, column and region
  sudoku.uniquesnowflake = function(nums,typemap) {
    var val,
      i;
    for (i = 0; i < 9; i++) {
      val = parseInt(typemap[i],10);
      if (val > 0) {
        // remove from array
        if (nums.indexOf(val) > -1) {
          nums.splice(nums.indexOf(val), 1);
        }
      }
    }
    return nums;
  };

  sudoku.makeplayable = function(curmap,level) {
    var rnd;
    // make sure key is fresh
    key.length = 0;
    // loop through and remove a range of numbers per row, leaving a solvable puzzle
    $.each(curmap, function(m,set) {
      $.each(set, function(i,v) {
        if (i !== "length") {
          rnd = Math.random();
          // n% of the time (level), leave a blank cell
          if (rnd > (level/100)) {
            $("#x" + m + i).val(v);
            $("#x" + m + i).attr("type", "text").attr("readonly", "readonly").parent().removeClass("active empty corrected valid entered").addClass("filled");
          } else {
            $("#x" + m + i).val("");
            $("#x" + m + i).removeAttr("readonly").parent().removeClass("active filled corrected valid entered").addClass("empty");
            if (small.matches) {
              $("#x" + m + i).attr("readonly", "readonly");
            }
          }
          // push to the key array for quick solving
          key.push(v);
        }
      });
    });
  };

  sudoku.makeboard = function() {
    var td,
      tr,
      table = $("<table>").attr("width", "100%").attr("height", "100%").attr("id", "board"),
      regi,
      count = 0,
      i,
      ii;
    //make rows
    for (i = 0; i < 9; i++) {
      tr = $("<tr>");
      uimap[i] = {};
      // make cells and inputs
      for (ii = 0; ii < 9; ii++) {
        // make inputs
        uimap[i][ii] = $("<input>").attr("maxlength", 1).attr("type", "text").attr("id", "x" + i + ii).data("row", i).data("col", ii).attr("class", "x" + count);
        count++;
        // make cells
        if (i < 9 && ii < 9) {regi = 8;}
        if (i < 9 && ii < 6) {regi = 7;}
        if (i < 9 && ii < 3) {regi = 6;}
        if (i < 6 && ii < 9) {regi = 5;}
        if (i < 6 && ii < 6) {regi = 4;}
        if (i < 6 && ii < 3) {regi = 3;}
        if (i < 3 && ii < 9) {regi = 2;}
        if (i < 3 && ii < 6) {regi = 1;}
        if (i < 3 && ii < 3) {regi = 0;}
        td = $("<td>").addClass("row" + i).addClass("col" + ii).addClass("reg" + regi);
        td.append(uimap[i][ii]);
        // add to the row
        tr.append(td);
      }
      // add to table
      table.append(tr);
    }
    return table;
  };

  // manually validate (don't use key) *just in case* there's more than one valid solution to the board
  sudoku.check = function() {
    var errors = [],
      stats = "",
      empties,
      okbtn = '<div id="btnok" class="btn">OK</div>',
      i;
    // loop through all rows/cols/squares 9x
    for (i = 0; i < 9; ++i) {
      // check row
      errors.push(sudoku.validate("row", i));
      // check column
      errors.push(sudoku.validate("col", i));
      // check region
      errors.push(sudoku.validate("reg", i));
    }
    // errors are all in one array (row,col,reg; repeat)
    if (errors.indexOf(2) !== -1 || errors.indexOf(1) !== -1) {
      if (errors.indexOf(2) !== -1) {
        // empties exist
        empties = sudoku.empties();
        stats = (empties > 1) ? "Oh dear! There are still " + empties + " empty cells remaining!<br /><br />" : "Oh no! One more empty cell left!<br /><br />";
      }
      if (errors.indexOf(1) !== -1) {
        // duplicates exist
        stats += "Uh oh! All rows, columns and regions must contain each digit from 1-9 only ONCE.<br /><br />";
      }
    } else {
      // everything looks good
      sudoku.timer("stop",0);
      // unbind timer click
      $("#timer").off("click");
      $("#numbers, #btns").hide();
      stats = "You did it! You are really amazing.<br /><br />";
      okbtn = '<div id="btnreplay" class="btn">PLAY AGAIN</div>';
      $("#haiku").html("<div>" + sudoku.gimmehaiku() + "</div>").show();
    }
    $("#new").hide();
    $("#end").html(stats + okbtn).show();
  };

  sudoku.validate = function(type, i) {
    var nums = [],
      sum  = 0,
      num;
    $.each($("." + type + i + " input"), function(){
      num = parseInt($(this).val(),10);
      // make sure it's a number, it's not infinity, it's not a decimal, it's between 0 and 10
      if (typeof num === "number" && isFinite(num) && num % 1 === 0 && num > 0 && num < 10) {
        // make sure number is unique
        if ($.inArray(num, nums) === -1) {
          nums.push(num);
          sum += num;
        } else {
          nums.push(0);
        }
      }
    });
    // validate length
    if (nums.length === 9) {
      // should total 45 (if not, a number was duplicated somewhere in this collection)
      if (sum === 45) {
        return 0;
      }
      // number duplicated in col
      return 1;
    }
    // not enough valid numbers in col
    return 2;
  };

  // get the current state of the board and compare to key
  sudoku.solve = function() {
    var board = [],
      cell,
      rightcnt = 0,
      wrongcnt = 0,
      emptycnt = 0,
      stats,
      replaybtn,
      ii = key.length;
    // just in case we're in a paused state, unpause to show the board
    sudoku.pause("unpause");
    // stop the timer
    sudoku.timer("stop",0);
    // get current state of board so we can compare incoming to existing
    $("input").each(function() {
      if ($(this).val().length > 0) {
        board.push(parseInt($(this).val(),10));
      } else {
        board.push(0);
      }
    });
    // run through cells and check against key, treat appropriately
    while(ii--) {
      cell = $(".x" + ii);
      if (board[ii] === 0) {
        cell.val(key[ii]);
        emptycnt++;
        if (cell.parent().hasClass("empty")) {
          cell.parent().removeClass("active").addClass("entered");
        }
      } else if (key[ii] !== board[ii]) {
        cell.val(key[ii]);
        wrongcnt++;
        if (cell.parent().hasClass("empty")) {
          cell.parent().removeClass("active").addClass("corrected");
        }
      } else {
        if (cell.parent().hasClass("empty")) {
          rightcnt++;
          cell.parent().removeClass("active").addClass("valid");
        }
      }
    }
    $("#new").hide();
    // summary info
    stats = rightcnt + " correct " + sudoku.pluralize(rightcnt,"cell") + "<br />" + 
        emptycnt + " empty " + sudoku.pluralize(emptycnt,"cell") + "<br />" + 
        wrongcnt + " incorrect " + sudoku.pluralize(wrongcnt,"cell") + "<br /><br />";
    replaybtn = '<div id="btnreplay" class="btn">PLAY AGAIN</div>';
    $("#numbers, #btns").hide();
    $("#haiku").html("<div>" + sudoku.gimmehaiku() + "</div>").show();
    $("#end").html(stats + replaybtn).show();
    // unbind timer click
    $("#timer").off("click");
  };

  sudoku.pluralize = function(num,str) {
    if (num === 0 || num > 1) {
      str += "s";
    }
    return str;
  };

  // pause is optional, if true it will toggle the paused state
  sudoku.timer = function(cmd,sec,pause) {
    if (cmd === "start") {
      if (sec === 0) {
        // clear out any existing timer
        clearInterval(timer);
        $("#timer").html("00:00").attr("title", "click to pause game");
      }
      $("#timer").addClass("running");
      if (pause) {
        sudoku.pause("unpause");
      }
      // delay starting of the timer just a tiny bit to make everyone feel good
      setTimeout(function() {
        timer = setInterval(function(){
          ++sec;
          $("#timer").html(sudoku.timeadj(parseInt(sec / 60, 10)) + ":" + sudoku.timeadj(sec % 60));
          // cast seconds up in scope
          time = sec;
        }, 1000);
      }, 200);
    } else if (cmd === "stop") {
      $("#timer").removeClass("running").attr("title", "");
      clearInterval(timer);
      if (pause) {
        sudoku.pause("pause");
      }
    } else if (cmd === "toggle") {
      if ($("#timer").hasClass("running")) {
        sudoku.timer("stop",0,true);
      } else {
        sudoku.timer("start",time,true);
      }
    }
  };

  sudoku.timeadj = function(val) {
    return (val > 9) ? val : "0" + val;
  };

  sudoku.pause = function(cmd) {
    if (cmd === "pause") {
      $("input").hide();
      $("#resume").show();
    } else {
      $("input").show();
      $("#resume").hide();
    }
  };

  // show a haiku message when a game has been solved
  sudoku.gimmehaiku = function() {
    var haiku = [
      "this is so easy<br />gonna finish so fast, wait<br />seven can't go here",
      "looks perfect to me<br />but two fives are in this row<br />where did i go wrong",
      "click the timer, friend<br />your active game will be paused<br />maybe take a nap",
      "logic, all you need<br />or maybe just lots of time<br />and tons of patience",
      "train will be here soon<br />time for one quick Sudoku<br />missed the train again"
      ];
    return haiku[Math.floor(Math.random()*haiku.length)];
  };

  sudoku.empties = function() {
    var empties = 0;
    $("#board input").each(function() {
      if($(this).val() === "") {
        empties++;
      }
    });
    return empties;
  };

  sudoku.newgame = function() {
    var easy,
      hard,
      hopeless,
      cancel;
    $("#end").hide();
    easy = $("<div>").attr("class", "btn").attr("id", "btneasy").attr("data-diff", "25").html("EASY");
    hard = $("<div>").attr("class", "btn").attr("id", "btnhard").attr("data-diff", "50").html("HARD");
    hopeless = $("<div>").attr("class", "btn").attr("id", "btnhopeless").attr("data-diff", "80").html("HOPELESS");
    cancel = (!$("#haiku").is(":empty") && $("#haiku").is(":visible")) ? "" : $("<div>").attr("id", "btncancel").html("X"); 
    $("#new").html("New Game:<br />").append(easy).append(hard).append(hopeless).append(cancel).show();
  };

  // prevent unwanted characters, and detect remaining empties at the same time
  $("#sudoku").on("input", "input", function() {
    // limit to nums 1-9
    $(this).val($(this).val().replace(/[^1-9]/,""));
    // are there any empties left?
    if (sudoku.empties() === 0) {
      sudoku.check();
    }
  });

  // make a cell active on click (also select the text for easy modifcation)
  $("#sudoku").on("click", "#board tr td", function() {
    $("#board tr td").removeClass("active");
    $(this).addClass("active");
    if ($(this).hasClass("empty")) {
      $(this).find("input").select();
    }
  });
  // ...or on input focus
  $("#sudoku").on("focus", "#board tr td input", function() {
    $("#board tr td").removeClass("active");
    $(this).parent().addClass("active");
  });

  // insert a number in the active cell on click
  $("#numbers span").on("click", function() {
    $("#board tr td.active.empty input").val($(this).attr("data-num"));
  });

  // new game
  $("#outer").on("click", "#btnnew, #btnreplay", function() {
    sudoku.newgame();
  });

  // load a new board
  $("#outer").on("click", "#new .btn", function() {
    difficulty = $(this).attr("data-diff");
    // clear map first so the board is fresh
    sudoku.clearmap();
    // reset internal timekeeper
    time = 0;
    // make sure we aren't in a paused state
    sudoku.pause("unpause");
    // now go on, get building
    sudoku.buildgame(0,0);
    $("#numbers, #btns").show();
    $("#end, #haiku, #new").hide();
    // restart ui timer
    sudoku.timer("start",0);
    // re-bind timer click
    $("#timer").off("click").on("click", function() {
      sudoku.timer("toggle");
    });
  });

  // cancel new game dialog
  $("#outer").on("click", "#btncancel", function() {
    $("#new").hide();
  });

  // validate board
  $("#btncheck").on("click", function(){
    sudoku.check();
  });

  // dismiss checker dialog
  $("#outer").on("click", "#btnok", function() {
    $("#end").hide();
  });

  // solve board
  $("#btnsolve").on("click", function() {
    sudoku.solve();
  });

  // pause/restart game
  $("#timer").on("click", function() {
    sudoku.timer("toggle");
  });

  $("#resume").on("click", function() {
    sudoku.timer("toggle");
  });

}(window.sudoku = window.sudoku || {}, jQuery));

$(function(){
  sudoku.init();
});