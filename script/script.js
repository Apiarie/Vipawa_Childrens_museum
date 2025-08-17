import * as THREE from 'three';
import {orbitControls} from 'three/addons/controls/orbitControls.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';

//scene
const canvas = document.querySelector('.canvas');
const scene = new THREE.Scene();

//camera
let aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1,100);
camera.position.set(800,200,1000);
scene.add(camera);

//lights
const lights = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lights);

//loading manager
const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

function updateLoadingProgress(progress) {
    const percentage = Math.round(progress * 100);
    document.getElementById('loading-percentage').textContent = percentage;
    document.getElementById('progress-bar-fill').style.width = `${percentage}%`;

    if (percentage >= 100) {
        setTimeout(() => {
            document.querySelector('.loading-screen').classList.add('fade-out');
            console.log('updateLoadingProgress setTimeout handler called');
        }, 500);
    }
    
}

//loading HDR
function init(){
new RGBELoader(manager)
    .setPath('./assets/')
    .load('sample.hdr', function(texture){
        texture.mapping = EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
        renderer();
        updateLoadingProgress(1);

    },function (xhr) {
        const progress = xhr.loaded / xhr.total;
        updateLoadingProgress(progress); 
    }, undefined, function (error) {
        console.error(error);
});
}
//render
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure =1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

controls = new orbitControls(camera, renderer.domElement);
controls.addEventListener('change', renderer);
controls.enableDamping = true;
    
//animation Loop
function animate(){
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
init();