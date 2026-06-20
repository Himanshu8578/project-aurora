import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
);

camera.position.set(0, 50, 150);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(
    renderer.domElement
);

// Ambient Light
const ambientLight =
new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);

// Sun Light
const sun =
new THREE.DirectionalLight(
    0xffffff,
    3
);

sun.position.set(
    100,
    200,
    100
);

sun.castShadow = true;

scene.add(sun);

// Ground
const ground =
new THREE.Mesh(

    new THREE.PlaneGeometry(
        5000,
        5000
    ),

    new THREE.MeshStandardMaterial({
        color: 0x3a7d44
    })

);

ground.rotation.x =
-Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);

// Palace Model
let palace;

const loader =
new GLTFLoader();

loader.load(

    '/models/Big Building.glb',

    (gltf) => {

        palace =
        gltf.scene;

        palace.scale.set(
            1,
            1,
            1
        );

        palace.position.set(
            0,
            0,
            0
        );

        scene.add(
            palace
        );
        const box = new THREE.Box3().setFromObject(palace);
const center = box.getCenter(new THREE.Vector3());
const size = box.getSize(new THREE.Vector3());

console.log("Center:", center);
console.log("Size:", size);

        console.log(
            "PALACE LOADED SUCCESSFULLY"
        );

    },

    (xhr) => {

        console.log(
            (xhr.loaded / xhr.total * 100).toFixed(0)
            + "% loaded"
        );

    },

    (error) => {

        console.error(
            "MODEL LOAD ERROR:",
            error
        );

    }

);

// Resize
window.addEventListener(
    'resize',
    () => {

        camera.aspect =
        window.innerWidth /
        window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);

// Animation Loop
function animate() {

    requestAnimationFrame(
        animate
    );

    if (palace) {

        palace.rotation.y +=
        0.001;

    }

    renderer.render(
        scene,
        camera
    );

}

animate();