const modal = document.querySelector(".single-movie-modal");
const openBtn = document.getElementById("single-movie-open");
const closeBtn = document.getElementById("single-movie-close");

function displayModal() {
  modal.classList.toggle("fade");
}

openBtn.addEventListener("click", displayModal);
closeBtn.addEventListener("click", displayModal);
