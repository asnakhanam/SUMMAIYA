let scene, camera, renderer, controls;
let cake, happyBirthdayText;
let hearts = [];

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe42189);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createCake() {
    const cakeGroup = new THREE.Group();

    const colors = [0xffb6c1, 0xffdab9, 0xf0f8ff];
    const radii = [5, 4, 3];
    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.CylinderGeometry(radii[i], radii[i], 2, 32);
        const material = new THREE.MeshLambertMaterial({ color: colors[i] });
        const layer = new THREE.Mesh(geometry, material);
        layer.position.y = i * 2 + 1;
        cakeGroup.add(layer);

        const frostingGeo = new THREE.TorusGeometry(radii[i] + 0.1, 0.2, 16, 100);
        const frostingMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const frosting = new THREE.Mesh(frostingGeo, frostingMat);
        frosting.rotation.x = Math.PI / 2;
        frosting.position.y = (i + 1) * 2;
        cakeGroup.add(frosting);
    }

    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 1, 8),
            new THREE.MeshLambertMaterial({ color: 0x8b4513 })
        );
        candle.position.set(x, 6.5, z);
        cakeGroup.add(candle);

        const flame = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffa500 })
        );
        flame.position.set(x, 7.1, z);
        cakeGroup.add(flame);

        const flameLight = new THREE.PointLight(0xffa500, 1, 3);
        flameLight.position.copy(flame.position);
        scene.add(flameLight);
    }

    scene.add(cakeGroup);
    return cakeGroup;
}

function createText() {
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json', font => {
        const material = new THREE.MeshPhongMaterial({ color: 0xffd700 });

        const text1 = new THREE.TextGeometry('Happy Birthday', {
            font, size: 1.3, height: 0.2, curveSegments: 12,
            bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02
        });
        text1.center();
        const mesh1 = new THREE.Mesh(text1, material);
        mesh1.position.set(0, 9, -5);
        mesh1.rotation.y = -0.2;

        const text2 = new THREE.TextGeometry('Summaiya!', {
            font, size: 1.3, height: 0.2, curveSegments: 12,
            bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02
        });
        text2.center();
        const mesh2 = new THREE.Mesh(text2, material);
        mesh2.position.set(0, 7.2, -5);
        mesh2.rotation.y = 0.2;

        happyBirthdayText = new THREE.Group();
        happyBirthdayText.add(mesh1);
        happyBirthdayText.add(mesh2);
        scene.add(happyBirthdayText);
    });
}

function createHeart() {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.8);
    shape.bezierCurveTo(0.5, -0.8, 0.9, -0.4, 0.9, 0.1);
    shape.bezierCurveTo(0.9, 0.4, 0.7, 0.7, 0, 0.9);
    shape.bezierCurveTo(-0.7, 0.7, -0.9, 0.4, -0.9, 0.1);
    shape.bezierCurveTo(-0.9, -0.4, -0.5, -0.8, 0, -0.8);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        steps: 2, depth: 0.2, bevelEnabled: true,
        bevelThickness: 0.1, bevelSize: 0.1, bevelOffset: 0, bevelSegments: 1
    });

    const material = new THREE.MeshPhongMaterial({ color: 0xff69b4 });
    const heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.5, 0.5, 0.5);
    heart.position.set(
        (Math.random() - 0.5) * 15,
        Math.random() * 5 + 10,
        (Math.random() - 0.5) * 15
    );
    heart.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    scene.add(heart);
    hearts.push(heart);
}

function populateHearts(n = 25) {
    for (let i = 0; i < n; i++) {
        createHeart();
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (cake) cake.rotation.y += 0.005;
    if (happyBirthdayText) {
        happyBirthdayText.rotation.y += 0.002;
        happyBirthdayText.position.y = 7.5 + Math.sin(Date.now() * 0.001) * 0.3;
    }

    hearts.forEach(heart => {
        heart.position.y += 0.08;
        heart.rotation.x += 0.02;
        heart.rotation.y += 0.01;
        if (heart.position.y > 20) {
            heart.position.y = -5;
            heart.position.x = (Math.random() - 0.5) * 15;
            heart.position.z = (Math.random() - 0.5) * 15;
        }
    });

    renderer.render(scene, camera);
}

// Run Everything
init();
cake = createCake();
createText();
populateHearts();
animate();
