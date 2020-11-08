function sideMenu(){
    var x = document.getElementById("barLinks")
    if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
    }
}
function darkMode() {
    var theme = document.body;
    theme.classList.toggle("darkMode");
  }
darkMode()

