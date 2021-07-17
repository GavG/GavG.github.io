let renderer
let scene
let camera
let objects = {}
let loader
let vars = {
    angle_z : 0,
    angle_x : 0,
    z_pos: 100,
}
let pi_q = Math.PI / 4
let pi_h = Math.PI / 2

function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    var geometry = new THREE.BoxGeometry(4, 4, 4)

    loader = new THREE.CubeTextureLoader();
    loader.setPath('img/textures/');

    var textureCube = loader.load([
        'g_face/px.jpg', 'g_face/px.jpg',
        'g_face/px.jpg', 'g_face/px.jpg',
        'g_face/px.jpg', 'g_face/px.jpg'
    ]);

    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube });
    
    objects.cube = new THREE.Mesh(geometry, material)
    scene.add(objects.cube)

    camera.position.z = vars.z_pos
    
    animate()
}

window.addEventListener('load', init)

window.addEventListener('mousemove', mousemove)

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

    camera.position.z = vars.z_pos

    objects.cube.rotation.x = vars.angle_x;
    objects.cube.rotation.z = vars.angle_z;
}

function mousemove(event) {
    vars.angle_z = - ((event.clientX / window.innerWidth) * Math.PI)
    vars.angle_x = ((event.clientY / window.innerHeight) * Math.PI)

    if (vars.z_pos > 3) {
        vars.z_pos -= 1
    }
}