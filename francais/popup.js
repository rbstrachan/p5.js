function showInstructionsPopup() {
  const popup = document.getElementById('instructions-popup');
  popup.style.display = 'block'; // make the popup visible
  const closeButton = document.querySelector('.btn-close'); // identify close button
  closeButton.focus(); // set focus on close button
}

function closeInstructionsPopup() {
  const popup = document.getElementById('instructions-popup');
  popup.style.display = 'none'; // hide the popup
}

// show the popup on page load
window.addEventListener('load', showInstructionsPopup);
