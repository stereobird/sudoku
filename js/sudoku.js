var sudoku = {
    // generate a basic number grid (81 numbers in a "solved" but generic state)
    generate: function() {
        var nums = [],
            i,
            ii;
        for (i = 0; i < 9; i++) {
            for (ii = 0; ii < 9; ii++) {
                nums.push((i*3 + Math.floor(i/3) + ii) % 9 + 1);
            }
        }
        sudoku.refresh(sudoku.disorder(nums));
        $("#status").html("");
    },
    // mixup the numbers in the array, but sort of thoughtfully
    disorder: function(nums) {
        var i,
            freq = 75,
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
    },
    refresh: function(nums) {
        var rnd;
        // very crudely, we'll just randomize hiding of some numbers
        $.each(nums, function(i,v) {
            rnd = Math.random();
            // ~30% of the time, don't insert the number
            if (rnd > 0.32) {
                $("#x" + (i+1)).val(v);
                $("#x" + (i+1)).attr("type", "text").attr("readonly", "readonly").parent().removeClass("empty").addClass("filled");
            } else {
                $("#x" + (i+1)).val("");
                $("#x" + (i+1)).removeAttr("readonly").parent().removeClass("filled").addClass("empty");
            }

        });
    },
    validate: function() {
        var rowerrors = [],
            colerrors = [],
            regerrors = [],
            i,
            dupes     = "",
            empties   = "";
        // loop throuh all rows/cols/regions 9x
        for (i = 1; i < 10; ++i) {
            // check row
            rowerrors.push(sudoku.analyze("row", i));
            // check column
            colerrors.push(sudoku.analyze("col", i));
            // check region
            regerrors.push(sudoku.analyze("reg", i));
        }
        // all zeroes means no errors in the row, column or region; e.g. [0,0,0,0,0,0,0,0,0]
        // 1 indicates a duplicated number in the row, column or region; e.g. [0,0,0,1,0,1,1,1,0]
        // 2 indictaes an empty space in the row, column or region; e.g. [0,0,2,2,0,0,0,0,0]
        // (2 takes precedence)
        if (rowerrors.length !== 9 || colerrors.length !== 9 || regerrors.length !== 9) {
            // something has gone wrong, one or more groups could not be validated
            // (this should never happen)
            $("#status").html("A horrible error has occurred!");
        } else {
            dupes   = (rowerrors.indexOf(1) === -1) ? (colerrors.indexOf(1) === -1) ? (regerrors.indexOf(1) === -1) ? "" : "" : "" : "<li>Numbers cannot be repeated in each row, column or region</li>";
            empties = (rowerrors.indexOf(2) === -1) ? (colerrors.indexOf(2) === -1) ? (regerrors.indexOf(2) === -1) ? "" : "" : "" : "<li>Uh oh, there are empty cells!</li>";
            if (dupes !== "" || empties !== "") {
                $("#status").addClass("error").html("<ul>" + dupes + empties + "</ul>");
            } else {
                $("#status").addClass("solved").html("Solved!");
            }
        }
        // debug:
        $("#status").append("<br /><br />rowerrors: " + rowerrors + "<br />colerrors: " + colerrors + "<br />regerrors: " + regerrors);
    },
    analyze: function(type, i) {
        var nums = [],
            sum  = 0,
            num;
        $.each($("." + type + i + " input"), function(){
            num = parseInt($(this).val());
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
                // all good
                return 0;
            } else {
                // number duplicated in col
                return 1;
            }
        } else {
            // not enough valid numbers in col
            return 2;
        }
    }
};

$(function(){

    // validate board
    $("#btnvalidate").on("click", function() {
        sudoku.validate();
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
            sudoku.validate();
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
    sudoku.generate();


});

