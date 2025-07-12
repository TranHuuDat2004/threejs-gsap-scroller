// Đăng ký plugin
gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------------------------
// 1. THIẾT LẬP CẢNH 3D CƠ BẢN
// --------------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Vẫn giữ camera ở xa để đảm bảo thấy mô hình lúc đầu
camera.position.set(0, 5, 30); 

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 5); // Thay đổi hướng sáng một chút
scene.add(directionalLight);

// --------------------------------------------------------------------
// THÊM SKYBOX
// --------------------------------------------------------------------
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('air-skybox/'); 

// ***** THAY ĐỔI DUY NHẤT: CẬP NHẬT TÊN FILE SKYBOX MỚI *****
// Chúng ta thay đổi tên file để khớp với bộ ảnh bạn vừa tải về.
const textureCube = cubeTextureLoader.load([
    'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'
]);

// Đặt skybox làm background cho scene
scene.background = textureCube;
// ***** KẾT THÚC THAY ĐỔI *****


// --------------------------------------------------------------------
// 2. TẢI MÔ HÌNH 3D MỚI
// --------------------------------------------------------------------
const loader = new THREE.GLTFLoader();
let newModel;

loader.load(
    'models/air_ship_1K.glb',
    function (gltf) {
        newModel = gltf.scene;
        
        newModel.position.set(0, -2, 0);
        newModel.scale.set(1, 1, 1); 
        newModel.rotation.set(0, Math.PI / 2, 0);
        
        scene.add(newModel);
        setupScrollAnimation();
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    (error) => console.error('Lỗi khi tải mô hình:', error)
);

// --------------------------------------------------------------------
// 3. THIẾT LẬP LẠI HIỆU ỨNG CUỘN (GIỮ NGUYÊN)
// --------------------------------------------------------------------
function setupScrollAnimation() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            markers: false
        }
    });

    tl
    .to(camera.position, { z: 20, y: 3 })
    .to(camera.position, { x: -15 })
    .to(camera.rotation, { y: -Math.PI / 6 }, "<")
    .to(newModel.rotation, { y: Math.PI }, "<")
    .to(camera.position, { y: 20, x: 0 })
    .to(camera.rotation, { y: 0, x: -Math.PI / 4 }, "<")
    .to(newModel.rotation, { y: Math.PI * 1.75 }, "<")
    .to(camera.position, { z: 25, y: 5 })
    .to(camera.rotation, { x: 0 }, "<");
}

// --------------------------------------------------------------------
// 4. VÒNG LẶP RENDER VÀ RESIZE (GIỮ NGUYÊN)
// --------------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();