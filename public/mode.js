let dark = false;

document.addEventListener('keyup', (event) => {
  if (event.keyCode === 192 && !dark) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "#39ff14";
    document.body.style.borderColor = "#39ff14";
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.body.style.borderColor = "black";
  }
  dark = !dark;
});