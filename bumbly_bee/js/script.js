let camera, scene, renderer, controls;
let width = window.innerWidth, height = window.innerHeight;

class Bee {
    constructor(position) {
        this.position = position;
    }

    // Offset is for if we move the bee around.
    bee(offset = new THREE.Vector3(0, 0, 0)) {
        return [
            this.body(offset),
            this.eye('right', offset),
            this.eye('left', offset),
            this.stripe(0.75, 0.5, offset),
            this.stripe(0.825, 0, offset),
            this.stripe(0.75, -0.5, offset),
            this.stinger(offset),
            this.smile(offset),
            this.wing('left', offset),
            this.wing('right', offset),
            this.feet(offset)
        ].flat();
    }

    body(offset) {
        let geometry = new THREE.SphereGeometry(1, 30, 30);
        let material = new THREE.MeshPhongMaterial({
            color: 0xffc800,
            shininess: 20
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position.clone().add(offset));
        mesh.scale.set(1, 1, 1.2);
        return mesh;
    }

    eye(side, offset) {
        let geometry = new THREE.CapsuleBufferGeometry(0.12, 0.12, 0.08, 20, 20, 20, 20);
        // let geometry = new THREE.SphereGeometry(0.12, 30, 30);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 80,
            specular: 0xeeeeee
        });
        let mesh = new THREE.Mesh(geometry, material);
        let x_offset = side === 'left' ? 0.3 : -0.3;
        let eye_pos = new THREE.Vector3(x_offset, 0, 1.1).add(offset);
        mesh.position.copy(eye_pos);
        mesh.scale.set(1, 1.2, 1);
        return mesh;
    }

    stripe(size, z_pos, offset) {
        let geometry = new THREE.TorusGeometry(size, size / 4, 50, 50);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 20
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(new THREE.Vector3(0, 0, z_pos).add(offset));
        return mesh;
    }

    stinger(offset) {
        // Using capsule buffer geometry for a cuter, rounded stinger.
        // https://github.com/maximeq/three-js-capsule-geometry
        let geometry = new THREE.CapsuleBufferGeometry(0.05, 0.2, 0.5, 20, 10, 5, 5);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 10
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(new THREE.Vector3(0, 0, -1.1).add(offset));
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    }

    smile(offset) {
        let geometry = new THREE.TorusGeometry(0.1, 0.02, 50, 50, Math.PI);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 10
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(new THREE.Vector3(0, 0, 1.2).add(offset));
        mesh.rotation.z = Math.PI;

        geometry = new THREE.SphereGeometry(0.02, 20, 20);
        material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 10
        });
        let mesh2 = new THREE.Mesh(geometry, material);
        mesh2.position.copy(new THREE.Vector3(0.1, 0, 1.2).add(offset));

        let mesh3 = new THREE.Mesh(geometry, material);
        mesh3.position.copy(new THREE.Vector3(-0.1, 0, 1.2).add(offset));
        return [mesh, mesh2, mesh3];
    }

    wing(side, offset) {
        let geometry = new THREE.CapsuleBufferGeometry(0.5, 0.3, 0.4, 20, 20, 20, 20);
        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 80,
            opacity: 0.7,
            transparent: true
        });
        let mesh = new THREE.Mesh(geometry, material);
        let x_offset = side === 'left' ? 0.5 : -0.5;
        let wing_pos = new THREE.Vector3(x_offset, 1.15, 0).add(offset);
        mesh.position.copy(wing_pos);
        mesh.scale.x = 0.2;
        mesh.scale.y = 0.8;
        // mesh.scale.z = 1.1;
        mesh.rotation.z = side === 'left' ? -Math.PI / 2.5 : Math.PI / 2.5;
        mesh.rotation.y = side === 'left' ? Math.PI / 4 : -Math.PI / 4;
        return mesh;
    }

    feet(offset) {
        let geometry = new THREE.CapsuleBufferGeometry(0.05, 0.1, 0.2, 20, 20, 15, 15);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 10
        });
        const leg_positions = [
            {
                position: new THREE.Vector3(0.8, -1, 0),
                rotation: Math.PI + 0.5
            },
            {
                position: new THREE.Vector3(0.6, -1.05, 0.5),
                rotation: Math.PI + 0.5
            },
            {
                position: new THREE.Vector3(0.6, -1.05, -0.5),
                rotation: Math.PI + 0.5
            },
            {
                position: new THREE.Vector3(-0.8, -1, 0),
                rotation: Math.PI - 0.5
            },
            {
                position: new THREE.Vector3(-0.6, -1.05, 0.5),
                rotation: Math.PI - 0.5
            },
            {
                position: new THREE.Vector3(-0.6, -1.05, -0.5),
                rotation: Math.PI - 0.5
            },
        ];
        let meshes = [];
        for (let pos of leg_positions) {
            let mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.z = pos.rotation;
            mesh.position.copy(pos.position).add(offset);
            meshes.push(mesh);
        }
        return meshes;
    }

    addToScene() {
        for (let mesh of this.bee()) {
            scene.add(mesh);
        }
    }
}

// Setting up the scene!
function init() {
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 100);
    camera.position.set(1, 1, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene = new THREE.Scene();
    // scene.add(new THREE.AxesHelper(100));

    let hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
    scene.add(hemisphereLight);

    let spotlight = new THREE.SpotLight(0xffffff, 0.5);
    spotlight.castShadow = true;
    spotlight.position.set(0, 1, 5);
    camera.add(spotlight);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x91c4cf, 1);

    // Adding orbit controls to pan around our bee.
    // And make sure to add the file from examples/js, not examples/jsm!
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", resize);

    let bee = new Bee(new THREE.Vector3(0, 0, 0));
    bee.addToScene();
}

// Let's make sure the window can resize properly.
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Animating the scene.
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();
