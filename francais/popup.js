function showInstructionsPopup() {
  const popup = document.getElementById('instructions-popup');
  popup.style.display = 'block'; // Make the popup visible
  const closeButton = document.querySelector('.btn-close'); // Identify close button
  closeButton.focus(); // Set focus on the close button
}

function closeInstructionsPopup() {
  const popup = document.getElementById('instructions-popup');
  popup.style.display = 'none'; // Hide the popup
}

// Show the popup on page load
window.addEventListener('load', showInstructionsPopup);

// const samwButton = document.querySelector(".btn-samw");
// samwButton.addEventListener('click', () => )
