var secs_to_capture = 3;
var makeAnimation = null;

var captureFrame = null;
var CAPTURE = window.location.href.indexOf('capture') != -1;
if (CAPTURE) {
  // Load jquery, we only need it for AJAX requests for capturing PNGs.
  var tag = document.createElement('script');
  tag.src = "https://code.jquery.com/jquery-2.1.4.min.js";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  // Wait 3 seconds for jquery to load. Lame.
  window.setTimeout(function() {
    makeAnimation();
  }, 3000);

  var canvas = null;
  captureFrame = function(frame, fps_ratio) {
    canvas = canvas || document.getElementsByTagName('CANVAS')[0];
    var img = canvas.toDataURL('image/png');
    $.ajax('/capture', {
      method: 'POST',
      data: {
        'frame': frame / fps_ratio,
        'data': img
      },
      error: function() {
        // If the server is unavailable, stop the capture process.
        catpureFrame = null;
      }
    });
  }
}
