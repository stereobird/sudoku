$(function(){
    $("#btn").on("click", function(){
        var stat = [];
        var nums = [];
        $.each($(".row1 input"), function(){
            var num = parseInt($(this).val());
            if (typeof num === "number" && isFinite(num) && num % 1 === 0 && num > 0 && num < 10) {
                nums.push(num);
                stat.push("ok");
            } else {
                stat.push("err");
            }

        });
        $("#status").html(nums + "<br />" + stat);
    });
});
