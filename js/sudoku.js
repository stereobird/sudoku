$(function(){

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
        },
        // mixup the numbers in the array, but sort of thoughtfully
        disorder: function(nums) {
            var i, jumbles = 75, from_number, to_number, ii;
            for (i = 1; i < jumbles; ++i) {
                from_number = Math.floor(Math.random() * 9) + 1; // 3
                to_number   = Math.floor(Math.random() * 9) + 1; // 6
                for (ii = 0; ii < nums.length; ii++) {
                    if (nums[ii] == from_number) {
                        nums[ii] = to_number;
                    } else if (nums[ii] == to_number) {
                        nums[ii] = from_number;
                    }
                }
            }
            return nums;
        },
        refresh: function(nums) {
            // very crudely, we'll just randomize hiding of some numbers
            $.each(nums, function(i,v) {
                // ~30% of the time, don't insert the number
                var rnd = Math.random();
                if (rnd > 0.32) {
                    $("#x" + (i+1)).val(v);
                } else {
                    $("#x" + (i+1)).val("");
                }

            });
        },
        validate: function(type, i) {
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



// debugging for now...

    // validate board
    $("#btnvalidate").on("click", function(){
        var rowerrors = [],
            colerrors = [],
            sqrerrors = [],
            i;

        // loop throuh all rows/cols/squares 9x
        for (i = 1; i < 10; ++i) {
            // check row
            rowerrors.push(sudoku.validate("row", i));
            // check column
            colerrors.push(sudoku.validate("col", i));
            // check square
            sqrerrors.push(sudoku.validate("sq", i));
        }

        // all zeroes means no errors in the row/column/square [0,0,0,0,0,0,0,0,0]
        // 1 indicates a duplicated number, e.g. [0,0,0,1,0,1,1,1,0]
        // 2 indictaes an empty space or invalid charcater, e.g. [0,0,2,2,0,0,0,0,0]
        // (2 takes precedence)

        $("#status").html(
            "rowerrors: " + rowerrors + 
            "<br />colerrors: " + colerrors + 
            "<br />sqrerrors: " + sqrerrors);
    });


    // load a new board
    $("#btnnew").on("click", function(){
        sudoku.generate();
    })






});

