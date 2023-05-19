$(document).ready(function() {
    $("#usertoggle").click(function() {
        $("#users-container").toggle();
    });

    $('#menutoggle').click(function() {
        $('.slide-in').toggleClass('show');
    });

    const modal = document.getElementById("myModal");

    const close = document.getElementsByClassName("close")[0];
    
    <% users.forEach((user) => { %>
        document.getElementById("modal-trigger-<%= user._id %>").onclick = function() {
            modal.style.display = "block";
            let uid = this.parentNode.querySelector('input[name="userIdStorage"]').value;
            document.getElementById("modal-content").innerHTML = 
            `<form action="/updateUser" method="post">
                <div class="more-info-container">
                    <table>
                    <thead>
                        <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>ID</th>
                        <th>HWID</th>
                        <th>Last IP</th>
                        <th>Banned</th>
                        <th>Subscription</th>
                        <th>Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <input type="hidden" name="id" value="<%= user._id %>">
                        <td><input id="moreinfoa" name="newUsername" value=<%= user.username %>></td>
                        <td><input id="moreinfoh" name="newEmail" value=<%= user.email %>></td>
                        <td><input id="moreinfob" name="newPass" value="NewPassword"></td>
                        <td><%= user._id %></td>
                        <td><%= user.hwid %></td>
                        <td><%= user.lastIP %></td>
                        <td><%= user.banned %></td>
                        <td><%= user.subscription %></td>
                        <td><%= user.expiry %></td>
                        </tr>
                    </tbody>
                    </table>
                    <div class="buttons-container">
                        <button type="submit" class="button">Update User</button>
                        <form action="/delUser" method="post">
                            <input type="hidden" name="id" value="<%= user._id %>">
                            <button type="submit" class="button">Delete</button>
                        </form>
                        <form action="/updateBanned" method="post">
                            <input type="hidden" name="id" value="<%= user._id %>">
                            <input type="hidden" name="bannedValue" value=<%= user.banned %>>
                            <button type="submit" class="button">
                            <% if (user.banned) { %>
                                Unban
                            <% } else { %>
                                Ban
                            <% } %>
                            </button>
                        </form>
                    </div>
                </div>
                </form>`;
        }
    <% }); %>
     
    close.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
