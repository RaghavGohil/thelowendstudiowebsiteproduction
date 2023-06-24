// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import * as THREE from 'three';

const scene = new THREE.Scene();

// GLTF loader.
// const loader = new GLTFLoader();

// loader.load( 'blend_files/monke.glb', function ( gltf ) {

// 	scene.add( gltf.scene );
// 	console.log('loaded');

// }, undefined, function ( error ) {

// 	console.error( error );

// } );

// FOV, Aspect ratio, View frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 1;

const canvas = document.querySelector('.index_background');

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer({canvas});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop( animation );

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}


// This will resize the canvas when you change the window size.
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}