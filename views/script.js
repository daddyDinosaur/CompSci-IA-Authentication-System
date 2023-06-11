$(document).ready(function() {
    $("#menutoggle").click(function() {
        $('.slide-in').toggleClass('show');
    });

    $("#usertoggle").click(function() {
        $("#users-container").toggle();
    });

    const modal = $("#myModal");
    const close = $(".close");

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    $(".more-info").click(function() {
        let uid = $(this).data("user-id");
    
        $.ajax({
            url: "/api/users/getUserInfo",
            type: "POST",
            data: { id: uid },
            success: function(user) {
                let formattedRegistered = formatTimestamp(user.registered);
                let formattedLastLogin = formatTimestamp(user.lastLogin);
                let formattedExpiry = formatTimestamp(user.expiry);
                var html = `<h1 class="white-text">User Info</h1>
                <p class="white-text">Registered: ${formattedRegistered}</p>
                <p class="white-text">Last login: ${formattedLastLogin}</p>
                <p class="white-text">Last IP: ${user.lastIP}</p>
                <p class="white-text">Keys: ${user.keys}</p>
                <p class="white-text">Subscription: ${user.subscription}</p>
                <p class="white-text">Expiry: ${formattedExpiry}</p>
                <p class="white-text">Banned: ${user.banned}</p>
                <p class="white-text">Ban Reason: ${user.banReason}</p>
                <p class="white-text">HWID: ${user.hwid}</p>
            
                <h2 class="white-text">Edit User</h2>
                <form id="edit-user-form">
                    <input class="input-field-special white-text" type="text" name="username" value="${user.username}">
                    <input class="input-field-special white-text" type="text" name="email" value="${user.email}">
                    <input class="input-field-special white-text" type="password" name="password" placeholder="New Password">
                    <input class="input-field-special white-text" type="text" name="role" value="${user.role.toUpperCase()}">
                    <button id="update-button" type="button" class="more-info-special white-text">Update User</button>
                    <button id="hwid-button" type="button" class="more-info-special white-text">Reset HWID</button>
                    <button id="ban-toggle-button" type="button" class="more-info-special white-text">${user.banned ? 'Unban' : 'Ban'} User</button>
                    <button id="delete-button" type="button" class="more-info-special white-text">Delete User</button>
                    </form>`;
            
                $("#modal-content").html(html);

                $("#delete-button").click(function() {
                    $.ajax({
                        url: "/api/users/delUser",
                        type: "POST",
                        data: { id: uid },
                        success: function() {
                            alert("User deleted successfully!");
                            modal.css("display", "none");
                            location.reload();
                        }
                    });
                });

                $("#update-button").click(function() {
                    let updatedUser = {
                        id: uid,
                        username: $("#username").val(),
                        email: $("#email").val(),
                        password: $("#password").val(),
                        role: $("#role").val()
                    };
    
                    $.ajax({
                        url: "/api/users/saveUser",
                        type: "POST",
                        data: updatedUser,
                        success: function() {
                            alert("User saved successfully!");
                            modal.css("display", "none");
                            location.reload();
                        }
                    });
                });

                $("#ban-toggle-button").click(function() {
                    $.ajax({
                        url: "/api/users/ban",
                        type: "POST",
                        data: { id: uid },
                        success: function() {
                            alert("Ban status toggled successfully!");
                            modal.css("display", "none");
                            location.reload();
                        }
                    });
                });

                $("#hwid-button").click(function() {
                    $.ajax({
                        url: "/api/users/resetHwid",
                        type: "POST",
                        data: { id: uid },
                        success: function() {
                            alert("Reset HWID successfully!");
                            modal.css("display", "none");
                            location.reload();
                        }
                    });
                });
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
