let camera, scene, renderer;
let cubies = [];
let leftcube = -window.innerWidth / 2 + 60;
let topcube = window.innerHeight / 2 - 50;
let amount = 0.0;

function init() {
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    camera.position.set(0, 0, 1);

    scene = new THREE.Scene();

    const light = new THREE.PointLight(0xffffff, 1, window.innerWidth * 2);
    light.position.set(-window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2);
    camera.add(light);
    const light2 = new THREE.PointLight(0x3399ff, 1, window.innerWidth * 2);
    light2.position.set(window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth / 2);
    camera.add(light2);

    scene.add(camera);
    while (leftcube < window.innerWidth / 2) {
        topcube = window.innerHeight / 2 - 50;
        while (topcube > -window.innerHeight / 2) {
            cubies.push(createCubes());
            topcube -= 100;
        }
        leftcube += 100;
    }

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    for (let cube of cubies) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;
    }
}

function createCubes() {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshStandardMaterial({
        color: 0xbada55,
        wireframe: false,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(leftcube, topcube, -100);
    cube.rotation.x = amount;
    cube.rotation.y = amount;
    cube.rotation.z = amount;
    scene.add(cube);
    amount += 0.01;
    return cube;
}

init();
animate();