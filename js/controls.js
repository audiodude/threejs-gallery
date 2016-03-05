// Mute the audio and toggle the speaker icon when it is clicked.
var player = document.getElementById('player');
var speaker = document.getElementById('speaker');
if (player) {
  speaker.addEventListener('click', function() {
    if (speaker.classList.contains('playing')) {
      player.muted = true;
      speaker.classList.remove('playing');
      speaker.classList.add('mute');
    } else {
      player.muted = false;
      speaker.classList.remove('mute');
      speaker.classList.add('playing');
    }
  });
} else {
  speaker.classList.add('hid');
}

// Show/hide the info box when the icon is clicked.
var info_icon = document.getElementById('info-icon');
var toggleInfo = function() {
  var info = document.getElementById('info');
  info.classList.toggle('hid');
}
info_icon.addEventListener('click', toggleInfo);
