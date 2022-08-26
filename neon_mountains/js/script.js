import * as THREE from "../node_modules/three/build/three.module.js";
import {EffectComposer} from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import {UnrealBloomPass} from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

let camera, scene, renderer, sphere, sphere2, skysphere, composer, tick = 0;

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1500);
    camera.position.set(0, 11, 1);
    camera.rotation.x = -0.3;

    scene = new THREE.Scene();

    let light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(100, 100, 100);
    scene.add(light);

    scene.add(camera);
    sphere = addSphere(199, 0x00d0ff, 1);
    // Add wireframe pass to the sphere
    sphere2 = addSphere(199.05, 0x6600ff, 1, true, true);
    skysphere = addSkySphere(); // Outer sky sphere.

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Effect composer post-processing.
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
}

function addSphere(radius, color, opacity, emissive = false, wireframe = false) {
    let geometry = new THREE.IcosahedronGeometry(radius, 150);
    let material = new THREE.MeshStandardMaterial({
        color: color,
        flatShading: wireframe ? false : true, // Wireframe flat shading does not work with bloom pass.
        opacity: opacity,
        transparent: opacity < 1 ? true : false,
        polygonOffset: wireframe ? false : true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        wireframe: wireframe,
        wireframeLinewidth: 1,
        emissive: color,
        emissiveIntensity: wireframe ? 1 : 0.1,
        roughness: 0.8
    });

    // Some onBeforeCompile wisdom from https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270.
    material.onBeforeCompile = (shader) => {
        // The perlin noise code goes here, above the main() function in the shader.
        // Noise shader from https://github.com/ashima/webgl-noise.
        shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_pars_vertex>',
            document.getElementById('vertexShader').textContent
        )
        // The vertex shader code that goes inside main() needs to be separate from the perlin noise code.
        shader.vertexShader = shader.vertexShader.replace(
            '#include <worldpos_vertex>',
        `vUv = uv;
        noise = 80.0 * turbulence(normal);
        float b = 5.0 * pnoise(0.01 * position, vec3(100.0));
        float displacement = noise + b;
        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);`);
    }

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -195, -20);
    mesh.rotation.z = Math.PI;
    scene.add(mesh);
    return mesh;
}

// Neon pink sky triangles.
function addSkySphere() {
    let geometry = new THREE.IcosahedronGeometry(500, 50);
    let material = new THREE.MeshStandardMaterial({
        color: 0xfb00ff,
        flatShading: false,
        wireframe: true,
        emissive: 0xfb00ff,
        emissiveIntensity: 100
    });
    material.side = THREE.DoubleSide;

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    return mesh;
}

function animate() {
    requestAnimationFrame(animate);
    composer.render();
    tick += 0.01;
    sphere.rotation.x += 0.002;
    sphere2.rotation.x += 0.002;
    skysphere.rotation.x += 0.0005;
    // Making the camera swoop over the terrain.
    camera.position.x = Math.sin(tick) * 20;
    camera.position.y = Math.sin(tick) * 6;
}

init();
animate();