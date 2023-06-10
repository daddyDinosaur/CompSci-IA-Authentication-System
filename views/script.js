$(document).ready(function() {
    $("#menutoggle").click(function() {
        $('.slide-in').toggleClass('show');
    });

    $("#usertoggle").click(function() {
        $("#users-container").toggle();
    });

    const modal = $("#myModal");
    const close = $(".close");

    $(".more-info").click(function() {
        modal.css("display", "block");
        let uid = $(this).data("user-id");
        
        // $.ajax({
        //     url: "/getUserInfo",
        //     type: "POST",
        //     data: { id: uid },
        //     success: function(user) {
        //         // your existing code to fill modal goes here
        //     }
        // });

        $("#modal-content").html("User Info for " + uid);
    });
     
    close.click(function() {
        modal.css("display", "none");
    });

    $(window).click(function(event) {
        if (event.target == modal[0]) {
            modal.css("display", "none");
        }
    });
});
