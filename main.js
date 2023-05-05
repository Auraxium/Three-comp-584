import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as player from "./components/player.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import $ from "jquery";

let PI = Math.PI;

//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new PointerLockControls(camera, document.body);
const raycaster = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 50, -100);

renderer.render(scene, camera);

const spaceTexture = new THREE.TextureLoader().load("space.jpeg");
scene.background = spaceTexture;

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

let geometry = new THREE.BoxGeometry(50, 2, 50);
let material = new THREE.MeshStandardMaterial({ color: 0x383838 });
const plane = new THREE.Mesh(geometry, material);
plane.position.set(0, -20, 0);
scene.add(plane);

geometry = new THREE.TorusGeometry(10, 3, 16, 100);
material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

scene.add(player.box);
// const controls = new OrbitControls(camera, renderer.domElement)

//adds targets
Array(20).fill().forEach(addStar);
function addStar() {
  const geometry = new THREE.SphereGeometry(1.5);
  const material = new THREE.MeshStandardMaterial({ color: "#D22030" });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y + 50, z - 100);
  scene.add(star);
}

//updates game at 60 fps
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();

async function delay(secs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(""), secs);
  });
}

//scuffed debug
document.addEventListener("keydown", async (e) => {
  // console.log(e.key.toLowerCase())
  switch (e.key.toLowerCase()) {
    case "m":
      console.log(camera.position);
      break;
    case "n":
      console.log(player.box.position);
      break;
    case "b":
      console.log(camera.rotation);
      break;
    case "r":
      location.reload();
      break;
    case "k":
      scene.traverse(obj => {
        if (obj.geometry.type == "SphereGeometry") {
          scene.remove(obj);
          $(".score").html("Score: " + ++score);
        }
      })
  }
});

document.addEventListener("click", function () {
  controls.lock();
});

let score = 0;

document.addEventListener("click", function () {
  raycaster.setFromCamera(new THREE.Vector2(), camera);

  // Find the closest object that the Raycaster intersects
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Log the object that the Raycaster intersects
  if (intersects.length > 0) {
    let mesh = intersects[0].object;
    // console.log(mesh)
    if (mesh.geometry.type == "SphereGeometry") {
      scene.remove(mesh);
      $(".score").html("Score: " + ++score);
    }
    if (score >= 20) $(".score").append(" win");
  }
});

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

document.body.requestPointerLock();
