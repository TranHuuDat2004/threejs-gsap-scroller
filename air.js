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

// ***** ĐOẠN CODE MỚI ĐỂ THÊM SKYBOX *****
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('skybox/'); // Chỉ định thư mục chứa ảnh

// Tải 6 ảnh theo đúng thứ tự: px, nx, py, ny, pz, nz
// Tên file phải khớp với tên file bạn đã tải về
// (posx = positive x, negx = negative x, ...)
const textureCube = cubeTextureLoader.load([
    'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'
]);

// Đặt skybox làm background cho scene
scene.background = textureCube;
// ***** KẾT THÚC ĐOẠN CODE MỚI *****


// --------------------------------------------------------------------
// 2. TẢI MÔ HÌNH 3D MỚI
// --------------------------------------------------------------------
const loader = new THREE.GLTFLoader();
let newModel; // Đổi tên biến cho rõ ràng

// ***** THAY ĐỔI 1: SỬA ĐƯỜNG DẪN TẢI FILE *****
loader.load(
    'models/air_ship_1K.glb', // Tải file cục bộ
    function (gltf) {
        newModel = gltf.scene;
        
        // ***** THAY ĐỔI 2: TINH CHỈNH VỊ TRÍ, KÍCH THƯỚC, XOAY *****
        // Đây là bước thử-và-sai. Các giá trị dưới đây là gợi ý ban đầu.
        // Bạn có thể phải thay đổi chúng để mô hình trông đẹp nhất.
        
        // Vị trí (x, y, z)
        newModel.position.set(0, -2, 0); // Di chuyển mô hình xuống một chút
        
        // Kích thước
        newModel.scale.set(1, 1, 1); // Bắt đầu với tỷ lệ 1:1, sau đó tăng/giảm nếu cần

        // Hướng xoay ban đầu (tính bằng Radian)
        // Y: xoay ngang (như đế xoay), X: ngửa lên/cúi xuống, Z: nghiêng trái/phải
        // Math.PI / 2 tương đương 90 độ.
        newModel.rotation.set(0, Math.PI / 2, 0); // Thử xoay nó 90 độ để hướng về phía trước
        
        scene.add(newModel);
        setupScrollAnimation(); // Gọi hàm animation sau khi tải xong
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    (error) => console.error('Lỗi khi tải mô hình:', error)
);

// --------------------------------------------------------------------
// 3. THIẾT LẬP LẠI HIỆU ỨNG CUỘN
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

    // ***** THAY ĐỔI 3: ĐIỀU CHỈNH LẠI ANIMATION CỦA CAMERA *****
    // Các tọa độ này cần được tinh chỉnh để phù hợp với mô hình WZ305
    tl
    // 1. Camera zoom lại gần
    .to(camera.position, { z: 25, y: 5 })
    
    // 2. Camera quay sang bên trái để xem thân xe
    .to(camera.position, { x: -15 })
    .to(camera.rotation, { y: -Math.PI / 6 }, "<")
    .to(newModel.rotation, { y: Math.PI }, "<") // Xoay mô hình để thấy góc khác

    // 3. Camera bay lên trên cao, nhìn xuống nòng pháo
    .to(camera.position, { y: 20, x: 0 })
    .to(camera.rotation, { y: 0, x: -Math.PI / 4 }, "<")
    .to(newModel.rotation, { y: Math.PI * 1.75 }, "<")

    // 4. Camera trở về vị trí cuối cùng
    .to(camera.position, { z: 20, y: 3 })
    .to(camera.rotation, { x: 0 }, "<");
}

// --------------------------------------------------------------------
// 4. VÒNG LẶP RENDER VÀ RESIZE (Không đổi)
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