const canvas = document.getElementById("three-bg");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Create Floating 3D Objects
function createShape() {
            const geoTypes = [
                        new THREE.BoxGeometry(),
                        new THREE.SphereGeometry(0.7, 32, 32),
                        new THREE.TetrahedronGeometry(0.8),
                        new THREE.OctahedronGeometry(0.9)
            ];

            const material = new THREE.MeshStandardMaterial({
                        color: Math.random() * 0xffffff,
                        metalness: 0.6,
                        roughness: 0.3
            });

            const shape = new THREE.Mesh(
                        geoTypes[Math.floor(Math.random() * geoTypes.length)],
                        material
            );

            shape.position.set(
                        (Math.random() - 0.5) * 8,
                        (Math.random() - 0.5) * 8,
                        (Math.random() - 0.5) * 8
            );

            shape.rotationSpeed = (Math.random() * 0.02) + 0.005;

            scene.add(shape);
            return shape;
}

// Create 10 floating objects
const floatingObjects = Array.from({ length: 10 }, createShape);

// Lights
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(3, 3, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040, 2);
scene.add(ambient);

// Animation Loop
function animate() {
            requestAnimationFrame(animate);

            floatingObjects.forEach(obj => {
                        obj.rotation.x += obj.rotationSpeed;
                        obj.rotation.y += obj.rotationSpeed;
            });

            renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
});
