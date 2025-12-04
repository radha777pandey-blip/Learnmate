// 🎓 COURSES 3D Background - Graduation Caps & Certificates Theme
const canvas = document.getElementById("three-bg");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Academic color palette
const academicColors = [0x3498db, 0x2ecc71, 0x9b59b6, 0xe74c3c, 0xf39c12, 0x1abc9c, 0x34495e];

// Create graduation cap (mortarboard)
function createGraduationCap() {
    const group = new THREE.Group();
    
    // Cap top (square board)
    const topGeometry = new THREE.BoxGeometry(1, 1, 0.1);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.4,
        roughness: 0.6
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.rotation.x = Math.PI / 4;
    group.add(top);
    
    // Cap base (cylinder)
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.3,
        roughness: 0.7
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.15;
    group.add(base);
    
    // Tassel (hanging string)
    const tasselGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
    const tasselMaterial = new THREE.MeshStandardMaterial({
        color: academicColors[Math.floor(Math.random() * academicColors.length)],
        metalness: 0.8,
        roughness: 0.2
    });
    const tassel = new THREE.Mesh(tasselGeometry, tasselMaterial);
    tassel.position.set(0.4, -0.35, 0);
    tassel.rotation.z = Math.PI / 6;
    group.add(tassel);
    
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

// Create certificate/diploma
function createCertificate() {
    const group = new THREE.Group();
    
    // Certificate paper
    const certGeometry = new THREE.PlaneGeometry(1.2, 0.8);
    const certMaterial = new THREE.MeshStandardMaterial({
        color: 0xfef9e7,
        metalness: 0.1,
        roughness: 0.9,
        side: THREE.DoubleSide
    });
    const cert = new THREE.Mesh(certGeometry, certMaterial);
    group.add(cert);
    
    // Decorative border (gold frame effect)
    const borderGeometry = new THREE.RingGeometry(0.58, 0.6, 32);
    const borderMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.7,
        roughness: 0.3,
        side: THREE.DoubleSide
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.rotation.x = Math.PI / 2;
    border.position.z = 0.01;
    group.add(border);
    
    // Slight curl
    group.rotation.x = Math.random() * 0.2;
    group.rotation.y = Math.random() * 0.3;
    group.rotation.z = Math.random() * 0.2;
    
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

// Create badge/medal
function createBadge() {
    const group = new THREE.Group();
    
    // Badge circle
    const badgeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const badgeMaterial = new THREE.MeshStandardMaterial({
        color: academicColors[Math.floor(Math.random() * academicColors.length)],
        metalness: 0.8,
        roughness: 0.2
    });
    const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
    group.add(badge);
    
    // Star on badge
    const starShape = new THREE.Shape();
    const outerRadius = 0.2;
    const innerRadius = 0.1;
    for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * outerRadius;
        const y = Math.sin(angle) * outerRadius;
        if (i === 0) starShape.moveTo(x, y);
        else starShape.lineTo(x, y);
        
        const innerAngle = angle + (2 * Math.PI) / 10;
        starShape.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius);
    }
    starShape.closePath();
    
    const starGeometry = new THREE.ShapeGeometry(starShape);
    const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.1
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.rotation.z = Math.PI / 2;
    star.position.z = 0.06;
    group.add(star);
    
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

// Create floating objects
const floatingObjects = [];

// Add graduation caps
for (let i = 0; i < 6; i++) {
    const cap = createGraduationCap();
    cap.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(cap);
    floatingObjects.push(cap);
}

// Add certificates
for (let i = 0; i < 5; i++) {
    const cert = createCertificate();
    cert.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(cert);
    floatingObjects.push(cert);
}

// Add badges
for (let i = 0; i < 4; i++) {
    const badge = createBadge();
    badge.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(badge);
    floatingObjects.push(badge);
}

// Bright, academic lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x3498db, 0.9, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x2ecc71, 0.6, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

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

