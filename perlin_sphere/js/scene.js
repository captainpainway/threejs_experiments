let camera,
    scene,
    renderer,
    spheres = [],
    tick = 0.0;

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
    camera.position.set(0, 0, 5);

    scene = new THREE.Scene();

    const light = new THREE.PointLight(0xffffff, 1, 22);
    light.position.set(1, 5, 1);
    camera.add(light);
    scene.add(camera);

    const light2 = new THREE.PointLight(0x45afff, 1, 22);
    light2.position.set(-1, -5, 1);
    camera.add(light2);
    scene.add(camera);

    // var ambient = new THREE.AmbientLight(0xffffff, 0.1);
    // scene.add(ambient);
    spheres.push(createSphere());
    makeNoise();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function createSphere() {
    let geometry = new THREE.IcosahedronBufferGeometry(20, 50);
    let material = new THREE.MeshStandardMaterial({
        color: 0x6ef099,
        roughness: 0.4,
        metalness: 0.4,
        emissive: 0x6ef099,
        emissiveIntensity: 0.3
    });
    material.opacity = 1.0;

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,-1, 0);
    scene.add(mesh);
    return mesh;
}

function makeNoise() {
    for (let sphere of spheres) {
        let peak = 0.8;
        let smoothing = 4;
        let vertices = sphere.geometry.attributes.position.array;
        for (let i = 0; i <= vertices.length; i += 3) {
            vertices[i + 1] = peak * noise.simplex2(vertices[i] / smoothing, vertices[i + 2] / smoothing);
        }
        sphere.geometry.attributes.position.needsUpdate = true;
        sphere.geometry.computeVertexNormals();
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    tick += 0.01;
    for (let sphere of spheres) {
        sphere.position.z += 0.1;
        if (sphere.position.z > 20) {
            sphere.geometry.dispose();
            sphere.material.dispose();
            scene.remove(sphere);
            spheres.shift();
        }
    }
}

init();
animate();
