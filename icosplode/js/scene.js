let camera,
    scene,
    renderer,
    icos = [],
    tick = 0,
    startPoint = -20;

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
    camera.position.set(10, 5, 1);

    scene = new THREE.Scene();

    const light = new THREE.PointLight(0xffffff, 1, 22);
    light.position.set(1, 5, 1);
    camera.add(light);
    scene.add(camera);

    const light2 = new THREE.PointLight(0xffffff, 1, 22);
    light2.position.set(-1, 5, 1);
    camera.add(light2);
    scene.add(camera);

    // var ambient = new THREE.AmbientLight(0xffffff, 0.1);
    // scene.add(ambient);

    let new_ico = createIco();
    icos.push(new_ico);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function createIco() {
    let geometry = new THREE.IcosahedronBufferGeometry(0.5, 0);
    let material = new THREE.MeshPhongMaterial();
    material.color.setRGB(Math.random(), Math.random(), 1);
    material.opacity = 1.0;
    material.transparent = true;
    material.side = THREE.DoubleSide;

    let position = geometry.attributes.position;
    const numfaces = position.count / 3;
    let displacement = new Float32Array(position.count * 3);

    for (let f = 0; f < numfaces; f++) {
        let index = 9 * f;

        for (let i = 0; i < 3; i++) {
            displacement[index + (3 * i)] = 1.0;
            displacement[index + (3 * i) + 1] = 1.0;
            displacement[index + (3 * i) + 2] = 1.0;
        }
    }

    geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

    material.userData = {amount: {value: 0.0}};
    material.onBeforeCompile = (shader) => {
        const token = '#include <worldpos_vertex>';
        shader.uniforms.amount = material.userData.amount;
        shader.vertexShader = `
            attribute vec3 displacement;
            uniform float amount;
        ` + shader.vertexShader;

        let shaderText = `
            vec3 newPosition = position + normal * displacement * amount;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        `

        shader.vertexShader = shader.vertexShader.replace(token, shaderText);
    };

    let mesh = new THREE.Mesh(geometry, material);
    let xaxis = Math.floor((Math.random() * 20));
    let yaxis = Math.floor((Math.random() * 10));
    mesh.position.set(xaxis, yaxis, startPoint);
    scene.add(mesh);

    return {mesh: mesh, icotick: 0};
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    for (let i = 0; i < icos.length; i++) {
        let ico = icos[i];
        if (ico.mesh.position.z > 5) {
            renderer.dispose();
            icos.shift();
        }

        ico.mesh.rotation.x += 0.01;
        ico.mesh.rotation.y += 0.01;
        ico.mesh.position.z += 0.02;

        ico.icotick += 0.01;

        ico.mesh.material.userData.amount.value = Math.abs(Math.sin(ico.icotick));
    }
    tick += 1;

    if (tick % 2 === 0) {
        let new_ico = createIco();
        icos.push(new_ico);
    }
}

init();
animate();
