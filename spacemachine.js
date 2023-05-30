import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./space.css";

let scene, camera, renderer;

let colour, intensity, light;
let ambientLight;

let orbit;

let listener, sound, audioLoader;

let clock, delta, interval;
let sceneHeight, sceneWidth;

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", init);

function init() {
  // remove overlay
  let overlay = document.getElementById("overlay");
  overlay.remove();

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;

  //create our clock and set interval at 30 fpx
  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 30;

  //create our scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfdfdf);
  //create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  //specify our renderer and add it to our document
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //create the orbit controls instance so we can use the mouse move around our scene
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = true;

  // lighting
  colour = 0xffffff;
  intensity = 1;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  const spacecraft = "SpaceCraft/scene.gltf";
  // create a box to spin
  loader.load(
    "SpaceCraft/scene.gltf",
    function (gltf) {
      const spacecraft = gltf.scene;
      scene.add(spacecraft);
      gltf.scene.scale.multiplyScalar(0.001);
      gltf.scene.position.set(0, -1, 0);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  //geometry = new THREE.BoxGeometry();
  //cube = new THREE.Mesh(geometry);

  //sound for single source and single listener

  listener = new THREE.AudioListener();
  camera.add(listener);
  sound = new THREE.PositionalAudio(listener);

  audioLoader = new THREE.AudioLoader();
  audioLoader.load("./sounds/CPC_Basic_Drone_Loop.mp3", function (buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(10);
    sound.setDirectionalCone(180, 230, 0.1);
    sound.setLoop(true);
    sound.setVolume(0.9);
    sound.play();
  });
  window.addEventListener("resize", onWindowResize, false);
  play();
}

// stop animating (not currently used)
function stop() {
  renderer.setAnimationLoop(null);
}

// simple render function

function render() {
  renderer.render(scene, camera);
}

// start animating

function play() {
  //using the new setAnimationLoop method which means we are WebXR ready if need be
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

//our update function

function update() {
  orbit.update();
}

function onWindowResize() {
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
