// 📚 BOOKS 3D Background - Floating Books & Pages Theme
const canvas = document.getElementById("three-bg");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Warm, bookish color palette
const bookColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7, 0xa29bfe, 0xfd79a8, 0xe17055];

// Create a realistic book shape
function createBook() {
    const group = new THREE.Group();
    
    // Book cover (main body)
    const coverGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.15);
    const coverMaterial = new THREE.MeshStandardMaterial({
        color: bookColors[Math.floor(Math.random() * bookColors.length)],
        metalness: 0.2,
        roughness: 0.8
    });
    const cover = new THREE.Mesh(coverGeometry, coverMaterial);
    group.add(cover);
    
    // Book pages (white interior)
    const pagesGeometry = new THREE.BoxGeometry(0.75, 1.15, 0.12);
    const pagesMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        metalness: 0.1,
        roughness: 0.9
    });
    const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
    pages.position.z = 0.02;
    group.add(pages);
    
    // Book spine (darker edge)
    const spineGeometry = new THREE.BoxGeometry(0.15, 1.2, 0.15);
    const spineMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.3,
        roughness: 0.7
    });
    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.position.x = -0.325;
    group.add(spine);
    
    // Random rotation for visual interest
    group.rotation.x = Math.random() * 0.3;
    group.rotation.y = Math.random() * 0.5;
    group.rotation.z = Math.random() * 0.2;
    
    // Animation properties
    group.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
    };
    group.userData.floatSpeed = 0.002 + Math.random() * 0.003;
    group.userData.floatAmplitude = 0.3 + Math.random() * 0.4;
    group.userData.initialY = (Math.random() - 0.5) * 8;
    
    return group;
}

// Create floating page (single sheet)
function createPage() {
    const pageGeometry = new THREE.PlaneGeometry(0.6, 0.8);
    const pageMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        metalness: 0.1,
        roughness: 0.95
    });
    const page = new THREE.Mesh(pageGeometry, pageMaterial);
    
    // Slight curl/bend effect
    page.rotation.x = Math.random() * 0.5;
    page.rotation.y = Math.random() * 0.5;
    page.rotation.z = Math.random() * 0.3;
    
    page.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.01
    };
    page.userData.floatSpeed = 0.003 + Math.random() * 0.004;
    page.userData.floatAmplitude = 0.4 + Math.random() * 0.5;
    page.userData.initialY = (Math.random() - 0.5) * 8;
    
    return page;
}

// Create floating objects
const floatingObjects = [];

// Add 8-10 books
for (let i = 0; i < 8; i++) {
    const book = createBook();
    book.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(book);
    floatingObjects.push(book);
}

// Add 6-8 floating pages
for (let i = 0; i < 6; i++) {
    const page = createPage();
    page.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(page);
    floatingObjects.push(page);
}

// Warm, cozy lighting (library-like)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffd700, 0.8, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff6b6b, 0.5, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    floatingObjects.forEach((obj, index) => {
        // Floating motion
        obj.position.y = obj.userData.initialY + Math.sin(time * obj.userData.floatSpeed + index) * obj.userData.floatAmplitude;
        
        // Gentle rotation
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.rotation.z += obj.userData.rotationSpeed.z;
        
        // Slow drift
        obj.position.x += Math.sin(time * 0.005 + index) * 0.001;
        obj.position.z += Math.cos(time * 0.005 + index) * 0.001;
    });
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

