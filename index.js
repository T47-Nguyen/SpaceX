import "./home.css";
import * as THREE from "three";
import * as Tone from "tone";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshStandardMaterial, TextureLoader } from "three";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
});

renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);
// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background

const spaceTexture = new THREE.TextureLoader().load("./Images/star.jpg");
scene.background = spaceTexture;

// Torus

const vongTexture = new THREE.TextureLoader().load("./Images/star.jpg");
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(7, 0.5, 16, 100),
  new THREE.MeshLambertMaterial({
    map: vongTexture,
    side: THREE.DoubleSide
  })
);

scene.add(torus);
torus.position.z = -5;
torus.position.x = -2;
torus.rotation.x = -Math.PI / 2;

// earth

const earthTexture = new THREE.TextureLoader().load("./Images/01-3.jpg");

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.MeshBasicMaterial({ map: earthTexture })
);

scene.add(earth);

earth.position.z = -5;
earth.position.x = -2;

//tone.js
const Listener = new THREE.AudioListener();
camera.add(Listener);

const player = new Tone.Player("./sounds/544083.beat-spacestation.mp3", () => {
  player.loop = true;
  player.autostart = true;
}).toDestination();

//star

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 50, 50);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Moon

const moonTexture = new THREE.TextureLoader().load("./Images/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("./normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 40, 40),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

// Mars
const moon1Texture = new THREE.TextureLoader().load("./Images/Jupiter.webp");
const normal1Texture = new THREE.TextureLoader().load("normal.jpg");

const moon1 = new THREE.Mesh(
  new THREE.SphereGeometry(3, 40, 40),
  new THREE.MeshStandardMaterial({
    map: moon1Texture,
    normalMap: normal1Texture
  })
);

scene.add(moon1);

moon1.position.z = 15;
moon1.position.setX(-20);

//loader gld
const loader = new GLTFLoader();

loader.load(
  "./SpaceCraft/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.multiplyScalar(0.001);
    gltf.scene.position.set(0, -1, 0);
    //gltf.scene.rotation.set(39, 39, 39);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// this function loads a flamingo model with animation data
const onLoadModel = function (gltf) {
  const spacecraft = gltf.scene.children[0]; // assign the first child of the scene contained in the gltf file to a variable called flamingo
  spacecraft.scale.multiplyScalar(0.002);
  spacecraft.position.z = 40;
  spacecraft.position.setX(-15);
  spacecraft.position.setY(-1);
  scene.add(spacecraft); // add our model to our scene
};

// create new vector for the position of our flamingo
const loader1 = new GLTFLoader();
loader1.load(
  // call the loader's load function
  "SpaceCraft/scene.gltf", // specify our file path
  function (gltf) {
    // specify the callback function to call once the model has loaded
    onLoadModel(gltf);
  }
);
//

// create the planet
const jupiterTexture = new THREE.TextureLoader().load("./Images/Mars.jpeg");
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(3, 96, 96),
  new MeshStandardMaterial({
    map: jupiterTexture
  })
);

// create the ring
const ringGeometry = new THREE.RingGeometry(3.6, 4.5, 96);
const ringMaterial = new THREE.MeshLambertMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = -Math.PI / 2;

// add the ring to the planet
jupiter.add(ring);

// add the planet to the scene
scene.add(jupiter);
jupiter.position.x += -15;
jupiter.position.y += -15;
jupiter.position.z += -15;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  //moon.rotation.z += 0.05;

  moon1.rotation.x += 0.1;
  moon1.rotation.y += 0.3;

  //spacecraft.rotation.y += 0.01;

  earth.rotation.y += 0.01;
  earth.rotation.z += 0.01;

  //spacecraft.rotation.z += 30;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0003; //change to 2
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
/*let rotationMatrix = new THREE.Matrix4();
rotationMatrix.makeRotationY(Math.PI / 4);
spacecraft.applyMatrix(rotationMatrix);*/

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  //torus.rotateZ(Math.PI /48);

  earth.rotation.x += 0.01;
  earth.rotation.y += 0.005;
  earth.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  //spacecraft.rotation.y += 0.04;
  // controls.update();

  renderer.render(scene, camera);
}

animate();
