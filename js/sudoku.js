
(function(sudoku, $, undefined) {

    sudoku.init = function() {
        sudoku.generate();
    };


    // generate a basic number grid (81 numbers in a "solved" but generic state)
    sudoku.generate = function() {
        var nums = [],
            i,
            ii;
        for (i = 0; i < 9; i++) {
            for (ii = 0; ii < 9; ii++) {
                nums.push((i * 3 + Math.floor(i / 3) + ii) % 9 + 1);
            }
        }
        sudoku.refresh(sudoku.disorder(nums));
        $("#status").html("");
        $("td").removeClass("corrected entered valid");
    };



    // mixup the numbers in the array, but sort of thoughtfully
    sudoku.disorder = function(nums) {
        var i,
            freq = 66,
            orig,
            dest,
            ii;
        for (i = 1; i < freq; ++i) {
            orig = Math.floor(Math.random() * 9) + 1;
            dest = Math.floor(Math.random() * 9) + 1;
            for (ii = 0; ii < nums.length; ii++) {
                if (nums[ii] === orig) {
                    nums[ii] = dest;
                } else if (nums[ii] === dest) {
                    nums[ii] = orig;
                }
            }
        }
        return nums;
    };



    sudoku.refresh = function(nums) {
        var rnd;
        key = nums;
        // very crudely, we'll just randomize hiding of some numbers
        $.each(nums, function(i,v) {
            rnd = Math.random();
            // ~33% of the time, don't insert the number
            if (rnd > 0.33) {
                $("#x" + (i + 1)).val(v);
                $("#x" + (i + 1)).attr("type", "text").attr("readonly", "readonly").parent().removeClass("empty").addClass("filled");
            } else {
                $("#x" + (i + 1)).val("");
                $("#x" + (i + 1)).removeAttr("readonly").parent().removeClass("filled").addClass("empty");
            }

        });
    };



    sudoku.validate = function(solve) {
        board.length = 0;
        var i,
            ii = key.length,
            cell,
            errors = 0,
            msg;
        for (i = 0; i < 81; i++) {
            if ($("#x" + (i + 1)).val() != "") {
                board.push($("#x" + (i + 1)).val());
            } else {
                board.push(0);
            }
        }
        if (solve === "solve") {
            // solve it!
            while(ii--) {
                cell = $("#x" + (ii + 1));
                if (board[ii] == 0) {
                    cell.val(key[ii]);
                    if (cell.parent().hasClass("empty")) {
                        cell.parent().removeClass("active").addClass("entered");
                    }
                } else if (key[ii] != board[ii]) {
                    cell.val(key[ii]);
                    if (cell.parent().hasClass("empty")) {
                        cell.parent().removeClass("active").addClass("corrected");
                    }
                } else {
                    if (cell.parent().hasClass("empty")) {
                        cell.parent().removeClass("active").addClass("valid");
                    }
                }
            }
        } else {
            // just check validity
            while(ii--) {
                if (board[ii] == 0) {
                    errors += 1;
                } else if (key[ii] != board[ii]) {
                    errors += 1;
                }
            }
            msg = (errors > 0) ? (errors > 5) ? "Uh oh. There's a few mistakes." : "Almost perfect!" : "Solved!"
            $("#status").html(msg);
        }
    };


}(window.sudoku = window.sudoku || {}, jQuery));



var key   = [],
    board = [];

$(function(){

    // validate board
    $("#btnvalidate").on("click", function() {
        sudoku.validate("solve");
    });


    // prevent unwanted characters, and detect remaining empties at the same time
    // bind to "input", as "change" is deferred until the input loses focus
    $("input").on("input", function() {
        // limit to nums 1-9
        $(this).val($(this).val().replace(/[^1-9]/,""));
        // how many empties are left?
        var empties = 0;
        $("#board input").each(function() {
            if($(this).val() === "") {
                empties++;
            }
        });
        if (empties === 0) {
            sudoku.validate("check");
        } else {
            $("#status").append(empties + "|");
        }
    });


    // make a cell active on click (also select the text for easy modifcation)
    $("#board tr td").on("click", function() {
        $("#board tr td").removeClass("active");
        $(this).addClass("active");
        if ($(this).hasClass("empty")) {
            $(this).find("input").select();
        }
    });
    // ...or on input focus
    $("#board tr td input").on("focus", function() {
        $("#board tr td").removeClass("active");
        $(this).parent().addClass("active");
    });


    // insert a number in the active cell on click
    $("#numbers span").on("click", function() {
        $("#board tr td.active input").val($(this).attr("data-num"));
    });


    // load a new board
    $("#btnnew").on("click", function() {
        sudoku.generate();
    });


    // generate a playable board once on page load
    //sudoku.generate();
    sudoku.init();


});

