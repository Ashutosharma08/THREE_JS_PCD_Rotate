

			import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';

			import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
			import { PCDLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/PCDLoader.js';

			let camera, scene, renderer,cameraTarget;
			init();
			animate();
			function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 10, 400 ); // original value: 100, window.innerWidth/window.innerHeight, 0.1, 400
				camera.position.set( 20, 20, 20 );
				cameraTarget = new THREE.Vector3( 0, 0, 0 ); // original value:  0, - 0.1, 0 
				scene.add( camera );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 30; // original value: 50
				controls.maxDistance = 30; // original value: 50


				const loader = new PCDLoader();
				loader.load( './tree_1.pcd', function ( points ) {

					points.geometry.center();
					points.geometry.rotateX( Math.PI*1.5 );
					scene.add( points );

					render();

				} );

				window.addEventListener( 'resize', onWindowResize );

				window.addEventListener( 'keypress', keyboard );

				scene.rotation.y = Date.now() * 0.001;	

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function keyboard( ev ) {

				const points = scene.getObjectByName( 'tree_1.pcd' );

				switch ( ev.key || String.fromCharCode( ev.keyCode || ev.charCode ) ) {

					case '+':
						points.material.size *= 1.2;
						break;

					case '-':
						points.material.size /= 1.2;
						break;

					case 'c':
						points.material.color.setHex( Math.random() * 0xffffff );
						break;

				}

			}

			function animate(){
				render();
				requestAnimationFrame( animate );
			}

			function render() {
				
				// PCD can't be rotated or revolved on its axis, so we revolve the camera in a big circular motion.
				const timer = Date.now() * 0.002;

				
				camera.position.x = Math.sin( timer ) * 100.5;
				camera.position.z = Math.cos( timer ) * 100.5;
				// setting up camera lookAt position 
				camera.lookAt( cameraTarget );

				// rendering scene and camera
				renderer.render( scene, camera );


			}

