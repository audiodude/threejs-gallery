// Mute the audio and toggle the speaker icon when it is clicked.
var player = document.getElementById('player');
var speaker = document.getElementById('speaker');
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

// Show/hide the info box when the icon is clicked.
var info_icon = document.getElementById('info-icon');
var toggleInfo = function() {
  var info = document.getElementById('info');
  info.classList.toggle('hid');
}
info_icon.addEventListener('click', toggleInfo);

function make3D() {
  var FPS = 60;
  var secs_to_capture = 64;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xaaaaaaa);
  document.body.appendChild(renderer.domElement);

  var ORIGIN = new THREE.Vector3(0, 0, 0);
  var DEAD = new THREE.Color(0xFFFFFF);
  var LIVE = new THREE.Color(0xFF0000);


  camera.position.copy(new THREE.Vector3(0, 0, 25));
  camera.lookAt(ORIGIN);

  var geometry = new THREE.BoxGeometry(.5, .5, .5, 3, 3, 3);


  var p = 0;
  var q = 1;
  var grids = [[]];
  var cubes = [];
  var base = 35;
  var spacing = 1;
  var total_space = base * spacing;
  for (var i = 0; i < base; i++) {
    var col = [];
    grids[0].push(col);
    for (var j = 0; j < base; j++) {
      col.push(Math.random() > 0.2);

      var material = new THREE.MeshBasicMaterial({
        color: DEAD,
        wireframe: true
      });
      var cube = new THREE.Mesh(geometry, material);
      cube.position.x = -1 * total_space/2 + i * spacing;
      cube.position.y = -1 * total_space/2 + j * spacing;
      cube.position.z = 0;
      scene.add(cube);
      cubes.push(cube);
    }
  }
  grids[p+1] = grids[p].slice(0);

  var frame = 0;
  var canvas = document.getElementsByTagName('CANVAS')[0];
  var captureFrame = function() {
    var img = canvas.toDataURL('image/png');
    $.ajax('http://localhost:5000', {
      method: 'POST',
      data: {
        'frame': frame,
        'data': img
        },
      error: function() {
        // If the server is unavailable, stop the capture process.
        CAPTURE = false;
      }
    });
  }

  function getNeighbors(i, j) {
    ans = []
    for (var x=-1; x <= 1; x++) {
      for (var y=-1; y <= 1; y++) {
        if (x == 0 && y == 0) {
          break;
        }
        var n = i + x;
        if (n < 0) { n = base - 1; }
        if (n > base - 1) { n = 0; }
        var m = j + y;
        if (m < 0) { m = base - 1; }
        if (m > base - 1) { m = 0; }
        ans.push(grids[p][n][m]);
      }
    }
    return ans;
  }

  function numAlive(bors) {
    var num = 0;
    for (var i=0; i<bors.length; i++) {
      if (bors[i]) {
        num++;
      }
    }
    return num;
  }

  function calcGrid() {
    for (var i=0; i<base; i++) {
      for (var j=0; j<base; j++) {
        var bors = getNeighbors(i, j);
        var num = numAlive(bors);
        grids[q][i][j] = (grids[p][i][j] && num == 2) || num == 3;
      }
    }
    if (p == 0) {
      p = 1;
      q = 0;
    } else {
      p = 0;
      q = 1;
    }
  }

  function addRandom() {
    for (var i=0; i < base * base / 2; i++) {
      var x = Math.ceil(Math.random() * (base - 1));
      var y = Math.ceil(Math.random() * (base - 1));
      grids[p][x][y] = true;
    }
  }

  var t = 0;
  var count = 0;
  function render() {
    setTimeout(function() {
      requestAnimationFrame( render );
    }, 1000 / FPS);

    for (var i=0; i<base; i++) {
      for (var j=0; j<base; j++) {
        if (grids[p][i][j]) {
          cubes[i*base + j].material.color = LIVE;
        } else {
          cubes[i*base + j].material.color = DEAD;
        }
      }
    }

    for (var i=0; i<cubes.length; i++) {
      var cube = cubes[i];
      cube.rotation.x += cube.position.x / 100;
      cube.rotation.y += cube.position.y / 100;
      cube.rotation.z += cube.position.z / 100;
    }

    // Rotate the camera
    camera.position['x'] = 25 * Math.sin(t);
    camera.position['z'] = 25 * Math.cos(t);
    camera.lookAt(ORIGIN);

    t += 0.01;
    if (t > 6.28) {
      t = 0;
    }

    count++;
    if (count % (FPS/5) == 0) {
      calcGrid();
    }
    if (count == FPS * 10) {
      count = 0;
      addRandom();
    }

    renderer.render(scene, camera);
    if (CAPTURE && frame < secs_to_capture * FPS) {
      captureFrame();
    }
    frame++;
  }
  render();
};

var CAPTURE = window.location.href.indexOf('capture') != -1;
if (CAPTURE) {
  // Load jquery, we only need it for AJAX requests for capturing PNGs.
  var tag = document.createElement('script');
  tag.src = "https://code.jquery.com/jquery-2.1.4.min.js";
  tag.async = "true";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  player.pause();
  window.setTimeout(make3D, 3000);  //Wait 3 seconds for jquery to load. Lame.
} else {
  make3D();
}
