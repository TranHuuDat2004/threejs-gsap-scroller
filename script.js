// Đăng ký plugin
gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------------------------
// 1. THIẾT LẬP CẢNH 3D
// --------------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 30); 

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ***** KHỞI TẠO ORBIT CONTROLS *****
// Truyền vào camera và canvas để nó biết cần điều khiển cái gì và lắng nghe sự kiện ở đâu
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Tạo ra hiệu ứng "quán tính" mượt mà khi xoay
controls.enablePan = false; // Tắt tính năng kéo (pan) để người dùng không kéo Kirov ra khỏi màn hình
controls.minDistance = 10; // Ngăn người dùng zoom quá gần
controls.maxDistance = 150; // Ngăn người dùng zoom quá xa

// Ánh sáng và Skybox (giữ nguyên)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('air-skybox/'); 
const textureCube = cubeTextureLoader.load([
    'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'
]);
scene.background = textureCube;

// --------------------------------------------------------------------
// 2. TẢI MÔ HÌNH (Giữ nguyên)
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
// 3. THIẾT LẬP HIỆU ỨNG CUỘN (CÓ THAY ĐỔI NHỎ)
// --------------------------------------------------------------------
function setupScrollAnimation() {
    // ***** THÊM ID CHO TIMELINE ĐỂ CÓ THỂ ĐIỀU KHIỂN NÓ *****
    const tl = gsap.timeline({
        id: "main-timeline", // Đặt một cái tên cho timeline
        scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            markers: false
        }
    });

    // Các animation giữ nguyên
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

// ***** GIẢI QUYẾT XUNG ĐỘT GIỮA SCROLL VÀ KÉO CHUỘT *****
controls.addEventListener('start', () => {
  // Khi người dùng bắt đầu kéo chuột, vô hiệu hóa animation cuộn
  console.log("OrbitControls started, ScrollTrigger disabled.");
  const mainTimeline = ScrollTrigger.getById("main-timeline");
  if (mainTimeline) {
    mainTimeline.disable();
  }
});

controls.addEventListener('end', () => {
  // Khi người dùng thả chuột, kích hoạt lại animation cuộn
  console.log("OrbitControls ended, ScrollTrigger enabled.");
  const mainTimeline = ScrollTrigger.getById("main-timeline");
  if (mainTimeline) {
    mainTimeline.enable();
  }
});


// --------------------------------------------------------------------
// 4. VÒNG LẶP RENDER (CÓ THAY ĐỔI)
// --------------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    // ***** CẬP NHẬT ORBIT CONTROLS TRONG MỖI FRAME *****
    // Điều này là bắt buộc nếu bạn bật `enableDamping`
    controls.update();

    renderer.render(scene, camera);
}

// Các hàm còn lại giữ nguyên
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();