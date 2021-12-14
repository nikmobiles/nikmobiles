$(document).ready(function () {
    function scroll() {
        $("html, body").animate({
            scrollTop: $(document).height()
        }, 1500);
    };
    setTimeout(scroll,1000);
    // DISABLE ENTER KEY
    $('#password, #email-email').keypress(function (e) {
        if (e.which == 13) return false;
    });
    //RIGHT CLICK DISABLE
    $(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });

});
