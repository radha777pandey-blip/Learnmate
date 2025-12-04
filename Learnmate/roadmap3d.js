// 🚀 ROADMAP 3D Background - Paths, Milestones & Progress Indicators Theme
const canvas = document.getElementById("three-bg");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Progress/roadmap color palette
const roadmapColors = [0x3498db, 0x2ecc71, 0xf39c12, 0xe74c3c, 0x9b59b6, 0x1abc9c, 0xff6b6b];

// Create milestone marker (checkpoint flag)
function createMilestone() {
    const group = new THREE.Group();
    
    // Flag pole
    const poleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.5,
        roughness: 0.5
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 0.5;
    group.add(pole);
    
    // Flag (triangular)
    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(0.4, 0.2);
    flagShape.lineTo(0, 0.4);
    flagShape.closePath();
    
    const flagGeometry = new THREE.ShapeGeometry(flagShape);
    const flagMaterial = new THREE.MeshStandardMaterial({
        color: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
        metalness: 0.6,
        roughness: 0.4,
        side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(0, 0.7, 0);
    flag.rotation.y = Math.PI / 4;
    group.add(flag);
    
    // Base (platform)
    const baseGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.4,
        roughness: 0.6
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);
    
    group.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.005
    };
    group.userData.floatSpeed = 0.002 + Math.random() * 0.003;
    group.userData.floatAmplitude = 0.3 + Math.random() * 0.4;
    group.userData.initialY = (Math.random() - 0.5) * 8;
    
    return group;
}

// Create progress path (connected nodes)
function createPathSegment() {
    const group = new THREE.Group();
    
    // Path line (curved)
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.5, 0, 0),
        new THREE.Vector3(0, 0.3, 0),
        new THREE.Vector3(0.5, 0, 0)
    );
    
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
        linewidth: 3
    });
    const line = new THREE.Line(geometry, material);
    group.add(line);
    
    // Nodes along path
    for (let i = 0; i < 3; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const nodeMaterial = new THREE.MeshStandardMaterial({
            color: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
            metalness: 0.7,
            roughness: 0.3,
            emissive: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
            emissiveIntensity: 0.4
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        const point = points[Math.floor((points.length - 1) * i / 2)];
        node.position.copy(point);
        group.add(node);
    }
    
    group.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.008
    };
    group.userData.floatSpeed = 0.0025 + Math.random() * 0.003;
    group.userData.floatAmplitude = 0.35 + Math.random() * 0.45;
    group.userData.initialY = (Math.random() - 0.5) * 8;
    
    return group;
}

// Create arrow (direction indicator)
function createArrow() {
    const group = new THREE.Group();
    
    // Arrow shaft
    const shaftGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.05);
    const shaftMaterial = new THREE.MeshStandardMaterial({
        color: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
        metalness: 0.6,
        roughness: 0.4
    });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.x = -0.4;
    group.add(shaft);
    
    // Arrowhead (cone)
    const headGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
        metalness: 0.7,
        roughness: 0.3,
        emissive: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
        emissiveIntensity: 0.5
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.x = 0.4;
    head.rotation.z = Math.PI / 2;
    group.add(head);
    
    group.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.012,
        y: (Math.random() - 0.5) * 0.012,
        z: (Math.random() - 0.5) * 0.01
    };
    group.userData.floatSpeed = 0.003 + Math.random() * 0.004;
    group.userData.floatAmplitude = 0.4 + Math.random() * 0.5;
    group.userData.initialY = (Math.random() - 0.5) * 8;
    
    return group;
}

// Create progress bar (3D)
function createProgressBar() {
    const group = new THREE.Group();
    
    // Background bar
    const bgGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.1);
    const bgMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.3,
        roughness: 0.7
    });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    group.add(bg);
    
    // Progress fill (animated percentage)
    const progress = Math.random();
    const fillGeometry = new THREE.BoxGeometry(1.2 * progress, 0.18, 0.08);
    const fillMaterial = new THREE.MeshStandardMaterial({
        color: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
        metalness: 0.8,
        roughness: 0.2,
        emissive: roadmapColors[Math.floor(Math.random() * roadmapColors.length)],
        emissiveIntensity: 0.6
    });
    const fill = new THREE.Mesh(fillGeometry, fillMaterial);
    fill.position.x = -0.6 + (1.2 * progress) / 2;
    fill.position.z = 0.01;
    group.add(fill);
    
    group.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.006
    };
    group.userData.floatSpeed = 0.0025 + Math.random() * 0.003;
    group.userData.floatAmplitude = 0.35 + Math.random() * 0.45;
    group.userData.initialY = (Math.random() - 0.5) * 8;
    
    return group;
}

// Create floating objects
const floatingObjects = [];

// Add milestones
for (let i = 0; i < 7; i++) {
    const milestone = createMilestone();
    milestone.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(milestone);
    floatingObjects.push(milestone);
}

// Add path segments
for (let i = 0; i < 5; i++) {
    const path = createPathSegment();
    path.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(path);
    floatingObjects.push(path);
}

// Add arrows
for (let i = 0; i < 6; i++) {
    const arrow = createArrow();
    arrow.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(arrow);
    floatingObjects.push(arrow);
}

// Add progress bars
for (let i = 0; i < 4; i++) {
    const progressBar = createProgressBar();
    progressBar.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(progressBar);
    floatingObjects.push(progressBar);
}

// Bright, motivational lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x2ecc71, 1, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x3498db, 0.8, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xf39c12, 0.6, 100);
pointLight3.position.set(0, 0, 5);
scene.add(pointLight3);

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    floatingObjects.forEach((obj, index) => {
        obj.position.y = obj.userData.initialY + Math.sin(time * obj.userData.floatSpeed + index) * obj.userData.floatAmplitude;
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.rotation.z += obj.userData.rotationSpeed.z;
        obj.position.x += Math.sin(time * 0.005 + index) * 0.001;
        obj.position.z += Math.cos(time * 0.005 + index) * 0.001;
    });
    
    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

