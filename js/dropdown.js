//Javascript for Menu

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */

document.getElementById("menu-button").onclick = function() {
    document.getElementById("menu-items").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.menu')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}