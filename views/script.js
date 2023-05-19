$(document).ready(function() {
    $('#usertoggle').click(function() {
        $('#users-container').toggle();
    });

    $('#menutoggle').click(function() {
        $('.slide-in').toggleClass('show');
    });

    const modal = document.getElementById("myModal");
    const close = document.getElementsByClassName("close")[0];
    
    close.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
