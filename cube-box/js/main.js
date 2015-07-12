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


// Now let's make some 3D.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaaa);
document.body.appendChild(renderer.domElement);

var ORIGIN = new THREE.Vector3(0, 0, 0);

var colors = [
  0x636BC8,
  0xFF6A6A,
  0x05116D,
  0xE50000,
  0x1A29A1,
  0xFFFFFF,
  0xB2B4BC,
  0xFE5353,
  0x6971B3,
  0x910000,
  0x000739,
  0x350000
];

var base = 5;
var spacing = 2;
var total_space = base * spacing;
var camera_space = total_space * 0.67
var positions = [];
for (var i = 0; i < base; i++) {
  for (var j = 0; j < base; j++) {
    for (var k = 0; k < base; k++) {
      var x = -1 * total_space/2 + i * spacing;
      var y = -1 * total_space/2 + j * spacing;
      var z = -1 * total_space/2 + k * spacing;
      positions.push(new THREE.Vector3(x, y, z));
    }
  }
}

var cubes = [];
for (var i=0; i < 125; i++) {
  var geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
  var material = new THREE.MeshBasicMaterial({
    color: colors[i % colors.length],
    wireframe: true
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.copy(positions[i]);
  scene.add(cube);
  cubes.push(cube);
}


var t = 0;
var ax = ['x', 'y', 'z'];
camera.position[ax[2]] = camera_space;
function render() {
  requestAnimationFrame( render );
  for (var i=0; i<cubes.length; i++) {
    var cube = cubes[i];
    cube.rotation.x += cube.position.x / 100;
    cube.rotation.y += cube.position.y / 100;
    cube.rotation.z += cube.position.z / 100;
  }

  // Rotate the camera
  camera.position[ax[0]] = camera_space * Math.sin(t);
  camera.position[ax[1]] = camera_space * Math.cos(t);
  camera.lookAt(ORIGIN);

  t += 0.01;
  if (t > 6.28) {
    ax.splice(0, 0, ax.pop());
    t = 0;
  }

  renderer.render( scene, camera );
}
render();
