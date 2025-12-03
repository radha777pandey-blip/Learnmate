// 💻 CODING 3D Background - Code Blocks & Terminal Elements Theme
const canvas = document.getElementById("three-bg");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Tech/coding color palette (matrix green, terminal blue, etc.)
const codeColors = [0x00ff41, 0x00d4ff, 0x7f5dff, 0xff6b6b, 0xffd700, 0xff00ff, 0x00ffff];

// Create code block (like a code snippet box)
function createCodeBlock() {
    const group = new THREE.Group();
    
    // Main code block (dark terminal-like)
    const blockGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.2);
    const blockMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.3,
        roughness: 0.8,
        emissive: 0x00ff41,
        emissiveIntensity: 0.1
    });
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    group.add(block);
    
    // Code lines (glowing rectangles)
    for (let i = 0; i < 4; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.9, 0.08, 0.05);
        const lineColor = codeColors[Math.floor(Math.random() * codeColors.length)];
        const lineMaterial = new THREE.MeshStandardMaterial({
            color: lineColor,
            metalness: 0.8,
            roughness: 0.2,
            emissive: lineColor,
            emissiveIntensity: 0.3
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, 0.25 - i * 0.2, 0.11);
        group.add(line);
    }
    
    group.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.008
    };
    group.userData.floatSpeed = 0.002 + Math.random() * 0.003;
    group.userData.floatAmplitude = 0.3 + Math.random() * 0.4;
    group.userData.initialY = (Math.random() - 0.5) * 8;
    
    return group;
}

// Create brackets/parentheses (coding symbols)
function createBracket() {
    const group = new THREE.Group();
    
    // Left bracket
    const leftBracketGeometry = new THREE.BoxGeometry(0.15, 1, 0.1);
    const bracketMaterial = new THREE.MeshStandardMaterial({
        color: codeColors[Math.floor(Math.random() * codeColors.length)],
        metalness: 0.7,
        roughness: 0.3,
        emissive: codeColors[Math.floor(Math.random() * codeColors.length)],
        emissiveIntensity: 0.4
    });
    
    const leftBracket = new THREE.Mesh(leftBracketGeometry, bracketMaterial);
    leftBracket.position.x = -0.3;
    group.add(leftBracket);
    
    // Right bracket
    const rightBracket = new THREE.Mesh(leftBracketGeometry, bracketMaterial);
    rightBracket.position.x = 0.3;
    group.add(rightBracket);
    
    // Top and bottom curves (simplified)
    const topCurve = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.15, 0.1),
        bracketMaterial
    );
    topCurve.position.y = 0.4;
    group.add(topCurve);
    
    const bottomCurve = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.15, 0.1),
        bracketMaterial
    );
    bottomCurve.position.y = -0.4;
    group.add(bottomCurve);
    
    group.rotation.z = Math.random() * Math.PI * 2;
    
    group.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.012
    };
    group.userData.floatSpeed = 0.003 + Math.random() * 0.004;
    group.userData.floatAmplitude = 0.4 + Math.random() * 0.5;
    group.userData.initialY = (Math.random() - 0.5) * 8;
    
    return group;
}

// Create binary numbers (0s and 1s)
function createBinaryDigit() {
    const digitGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1);
    const digitMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0x00ff41 : 0x00d4ff,
        metalness: 0.6,
        roughness: 0.4,
        emissive: Math.random() > 0.5 ? 0x00ff41 : 0x00d4ff,
        emissiveIntensity: 0.5
    });
    const digit = new THREE.Mesh(digitGeometry, digitMaterial);
    
    // Add text-like appearance (simple geometric pattern)
    const innerGeometry = new THREE.BoxGeometry(0.25, 0.4, 0.05);
    const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff41,
        emissiveIntensity: 0.8
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    inner.position.z = 0.06;
    digit.add(inner);
    
    digit.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.015
    };
    digit.userData.floatSpeed = 0.004 + Math.random() * 0.005;
    digit.userData.floatAmplitude = 0.5 + Math.random() * 0.6;
    digit.userData.initialY = (Math.random() - 0.5) * 8;
    
    return digit;
}

// Create terminal window
function createTerminal() {
    const group = new THREE.Group();
    
    // Terminal frame
    const frameGeometry = new THREE.BoxGeometry(1.5, 1, 0.15);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.4,
        roughness: 0.6
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    group.add(frame);
    
    // Terminal screen (dark with green glow)
    const screenGeometry = new THREE.BoxGeometry(1.3, 0.7, 0.05);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff41,
        emissiveIntensity: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.06;
    group.add(screen);
    
    // Terminal prompt lines
    for (let i = 0; i < 3; i++) {
        const lineGeometry = new THREE.BoxGeometry(1, 0.05, 0.02);
        const lineMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff41,
            emissive: 0x00ff41,
            emissiveIntensity: 0.6
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, 0.2 - i * 0.2, 0.09);
        group.add(line);
    }
    
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

// Add code blocks
for (let i = 0; i < 6; i++) {
    const block = createCodeBlock();
    block.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(block);
    floatingObjects.push(block);
}

// Add brackets
for (let i = 0; i < 5; i++) {
    const bracket = createBracket();
    bracket.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(bracket);
    floatingObjects.push(bracket);
}

// Add binary digits
for (let i = 0; i < 8; i++) {
    const digit = createBinaryDigit();
    digit.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(digit);
    floatingObjects.push(digit);
}

// Add terminal windows
for (let i = 0; i < 3; i++) {
    const terminal = createTerminal();
    terminal.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
    );
    scene.add(terminal);
    floatingObjects.push(terminal);
}

// Cyberpunk/tech lighting (neon green, blue)
const ambientLight = new THREE.AmbientLight(0x00ff41, 0.3);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00ff41, 1.2, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00d4ff, 0.8, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0x7f5dff, 0.6, 100);
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

