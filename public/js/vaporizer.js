$("#vaporize").on("click", function () {
    $("#file").trigger("click");
});

$("#file").change(function () {
    console.log($(this).val());

    try {
        $("#spinner").css("visibility", "visible");
        $("#form").submit();

    } finally {
        $("#spinner").css("visibility", "hidden");
        $(this).val(null);
    }
});