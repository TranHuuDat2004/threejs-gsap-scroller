// Đăng ký plugin ScrollTrigger với GSAP
gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------------------------
// 1. THIẾT LẬP CẢNH 3D (THREE.JS)
// --------------------------------------------------------------------

// Scene (Sân khấu)
const scene = new THREE.Scene();

// Camera (Máy quay)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(5); // Đặt camera lùi lại một chút để thấy đối tượng

// Renderer (Họa sĩ)
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true // Cho phép nền trong suốt để thấy màu của body
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Thêm một đối tượng vào cảnh (ví dụ: Khối lập phương)
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff83, roughness: 0.5 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Thêm ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ánh sáng môi trường
const pointLight = new THREE.PointLight(0xffffff, 1); // Ánh sáng điểm
pointLight.position.set(5, 5, 5);
scene.add(ambientLight, pointLight);

// --------------------------------------------------------------------
// 2. THIẾT LẬP HIỆU ỨNG CUỘN (GSAP + SCROLLTRIGGER)
// --------------------------------------------------------------------

// Tạo một "timeline" - một chuỗi các animation
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: 'main',      // Kích hoạt animation khi 'main' vào tầm nhìn
        start: 'top top',     // Bắt đầu khi đỉnh của 'main' chạm đỉnh viewport
        end: 'bottom bottom', // Kết thúc khi đáy của 'main' chạm đáy viewport
        scrub: true,          // Quan trọng: Kết nối tiến trình animation với vị trí cuộn
        markers: false        // Bật lên (true) để debug, sẽ thấy các vạch đánh dấu
    }
});

// Thêm các animation vào timeline
// Mỗi animation sẽ diễn ra tuần tự khi bạn cuộn trang
tl.to(cube.rotation, { x: 1, y: 2, z: 0.5 }) // Xoay khối cube
  .to(cube.position, { x: 3 })              // Di chuyển sang phải
  .to(cube.scale, { x: 1.5, y: 1.5 })       // Phóng to nó lên
  .to(cube.rotation, { x: -1, y: -2 })      // Xoay theo hướng khác
  .to(cube.position, { x: -3 });            // Di chuyển sang trái

// --------------------------------------------------------------------
// 3. VÒNG LẶP RENDER
// --------------------------------------------------------------------

// Hàm này được gọi liên tục để vẽ lại cảnh 3D mỗi frame
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Xử lý khi cửa sổ trình duyệt thay đổi kích thước
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Bắt đầu vòng lặp
animate();