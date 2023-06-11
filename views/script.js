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
        let uid = $(this).data("user-id");
    
        $.ajax({
            url: "/api/users/getUserInfo",
            type: "POST",
            data: { id: uid },
            success: function(user) {
                let html = `
                    <h2>User Info for ${user.username}</h2>
                    <p>Registered: ${user.registered}</p>
                    <p>Last Login: ${user.lastLogin}</p>
                    <p>Last IP: ${user.lastIP}</p>
                    <p>Keys: ${user.keys}</p>
                    <p>Subscription: ${user.subscription}</p>
                    <p>Expiry: ${user.expiry}</p>
                    <p>Banned: ${user.banned}</p>
                    <p>Ban Reason: ${user.banReason}</p>
                    <p>HWID: ${user.hwid}</p>
                    <p>ID: ${user._id}</p>
    
                    <h2>Edit User</h2>
                    <input id="username" type="text" value="${user.username}">
                    <input id="email" type="text" value="${user.email}">
                    <input id="password" type="text" value="${user.password}">
                    <input id="role" type="text" value="${user.role}">
                    <button id="ban-toggle">Toggle Ban</button>
                    <button id="save-user">Save</button>
                `;
    
                $("#modal-content").html(html);
            }
        });
    
        modal.css("display", "block");
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
