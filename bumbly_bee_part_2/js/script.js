let camera,
    scene,
    renderer,
    composer,
    controls,
    bee,
    y_pos = 0,
    x_pos = 0,
    z_pos = 0,
    z_rot = 0,
    tick = 0;
let width = window.innerWidth, height = window.innerHeight;

/*
I want to refactor this class because it is very complicated and
doesn't work correctly!
 */
class Bee {
    constructor() {
        this.bee = this.addToScene();
    }

    bee_constructor() {
        return [
            this.body(),
            this.eye('right'),
            this.eye('left'),
            this.stripe(0.75, 0.5, ),
            this.stripe(0.825, 0, ),
            this.stripe(0.75, -0.5, ),
            this.stinger(),
            this.smile(),
            this.wing('left', ),
            this.wing('right', ),
            this.feet()
        ].flat();
    }

    body() {
        let geometry = new THREE.SphereGeometry(1, 30, 30);
        let material = new THREE.MeshPhongMaterial({
            color: 0xffc800,
            shininess: 20
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.scale.set(1, 1, 1.2);
        return mesh;
    }

    eye(side) {
        let geometry = new THREE.CapsuleBufferGeometry(0.12, 0.12, 0.08, 20, 20, 20, 20);
        // let geometry = new THREE.SphereGeometry(0.12, 30, 30);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 80,
            specular: 0xeeeeee
        });
        let mesh = new THREE.Mesh(geometry, material);
        let x_offset = side === 'left' ? 0.3 : -0.3;
        let eye_pos = new THREE.Vector3(x_offset, 0, 1.1);
        mesh.position.copy(eye_pos);
        mesh.scale.set(1, 1.2, 1);
        return mesh;
    }

    stripe(size, z_pos) {
        let geometry = new THREE.TorusGeometry(size, size / 4, 50, 50);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 20
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(new THREE.Vector3(0, 0, z_pos));
        return mesh;
    }

    stinger() {
        // Using capsule buffer geometry for a cuter, rounded stinger.
        // https://github.com/maximeq/three-js-capsule-geometry
        let geometry = new THREE.CapsuleBufferGeometry(0.05, 0.2, 0.5, 20, 10, 5, 5);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 10
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(new THREE.Vector3(0, 0, -1.1));
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    }

    smile() {
        let geometry = new THREE.TorusGeometry(0.1, 0.02, 50, 50, Math.PI);
        let material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 10
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(new THREE.Vector3(0, 0, 1.2));
        mesh.rotation.z = Math.PI;

        geometry = new THREE.SphereGeometry(0.02, 20, 20);
        material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 10
        });
        let mesh2 = new THREE.Mesh(geometry, material);
        mesh2.position.copy(new THREE.Vector3(0.1, 0, 1.2));

        let mesh3 = new THREE.Mesh(geometry, material);
        mesh3.position.copy(new THREE.Vector3(-0.1, 0, 1.2));
        return [mesh, mesh2, mesh3];
    }

    wing(side) {
        let geometry = new THREE.CapsuleBufferGeometry(0.5, 0.3, 0.4, 20, 20, 20, 20);
        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 80,
            opacity: 0.7,
            transparent: true
        });
        let mesh = new THREE.Mesh(geometry, material);
        let x_offset = side === 'left' ? 0.8 : -0.8;
        let wing_pos = new THREE.Vector3(x_offset, 1, 0.5);
        mesh.position.copy(wing_pos);
        mesh.scale.x = 0.2;
        mesh.scale.y = 0.8;
        // mesh.scale.z = 1.1;
        let rotation_z = THREE.MathUtils.degToRad(80);
        mesh.rotation.z = side === 'left' ? -rotation_z : rotation_z;
        mesh.rotation.y = side === 'left' ? Math.PI / 4 : -Math.PI / 4;
        mesh.geometry.applyMatrix(
            new THREE.Matrix4().makeTranslation(0, 0, -0.5)
        );

        // Maybe try animating the wings?
        anime({
            targets: mesh.rotation,
            x: THREE.MathUtils.degToRad(20), // Nice utility!
            loop: true,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            duration: 50
        })

        return mesh;
    }

    feet() {
        let geometry = new THREE.CapsuleBufferGeometry(0.05, 0.13, 0.2, 20, 20, 15, 15);
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
            mesh.position.copy(pos.position);

            // Animate the legs too?
            anime({
                targets: mesh.rotation,
                y: THREE.MathUtils.degToRad(40),
                loop: true,
                easing: 'easeInOutQuad',
                direction: 'alternate',
                duration: 300
            })
            meshes.push(mesh);
        }
        return meshes;
    }

    // Use Three.js Groups to group the bee parts together.
    addToScene() {
        const group = new THREE.Group();
        for (let mesh of this.bee_constructor()) {
            group.add(mesh);
        }
        scene.add(group);
        return group;
    }

    // Adding this to try to move the bee programmatically.
    updateBeePosition(position) {
        this.bee.position.copy(position);
    }

    // And the bee's rotation!
    updateBeeRotation(rotation) {
        this.bee.rotation.x = rotation.x;
        this.bee.rotation.y = rotation.y;
        this.bee.rotation.z = rotation.z;
    }
}

// Setting up the scene!
function init() {
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 100);
    camera.position.set(1, 1, 6);
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

    // Moving the bee just moves the body right now.
    // We need to be able to move the bee as one piece.
    bee = new Bee();

    // I want the bee to do a 360 spin as it wobbles.
    // This is a bit much.
    // anime({
    //     targets: bee.bee.rotation,
    //     y: Math.PI * 2,
    //     easing: 'easeInOutQuad',
    //     loop: true,
    //     direction: 'normal',
    //     duration: 8000
    // });

    // Adding a film pass just to make things interesting.
    const renderPass = new THREE.RenderPass(scene, camera);
    const fxaa = new THREE.ShaderPass(THREE.FXAAShader);
    const vignette = new THREE.ShaderPass(THREE.VignetteShader);

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(vignette);
    composer.addPass(fxaa);
}

// Let's make sure the window can resize properly.
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
}

// Animating the scene.
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render();
    // Animating the y position with a sine wave to give the bee a bit
    // of up and down motion.
    // Why not do the x position too?
    bee.updateBeePosition(new THREE.Vector3(x_pos, y_pos, z_pos)); //  It works!!!
    bee.updateBeeRotation(new THREE.Vector3(0, 0, z_rot));
    tick += 0.02;
    y_pos = Math.sin(tick);
    x_pos = Math.cos(tick / 2) * 4;
    z_pos = Math.sin(tick / 2) * 2;
    z_rot = Math.sin(tick / 2);
}

init();
animate();
