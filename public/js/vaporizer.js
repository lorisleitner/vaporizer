let enabled = true;

$("#vaporize").on("click", function () {
    if (enabled) {
        $("#errorMessage").css("visibility", "hidden");
        $("#file").trigger("click");
    }
});

$("#file").change(function () {
    enabled = false;
    const vaporize = $("#vaporize");
    vaporize.html("Vaporizing...");

    setTimeout(function () {
        enabled = true;
        vaporize.html("Vaporize!");
    }, 8 * 1000);

    $("#form").submit();
    $(this).val(null);
});