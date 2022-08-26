import * as THREE from '../node_modules/three/build/three.module.js';
let camera, scene, renderer, material, deathstar;

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.set(0, 0, 1);

    scene = new THREE.Scene();

    let light = new THREE.PointLight(0xffffff, 1, 20);
    light.position.set(0, 1, 1);
    camera.add(light);

    scene.add(camera);
    deathstar = sphere();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", onResize);
}

function sphere() {
    let geometry = new THREE.IcosahedronBufferGeometry(1, 50);
    material = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                type: "f",
                value: 0.0
            }
        },
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
    });
    material.side = THREE.DoubleSide;
    geometry.computeVertexNormals();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -3);
    scene.add(mesh);
    return mesh;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    deathstar.material.uniforms['time'].value += 0.0005;
    deathstar.rotation.y += 0.01;
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();