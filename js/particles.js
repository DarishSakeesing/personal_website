//select the canvas element from HTML and assigning it to the canvas variable
var canvas = document.querySelector('canvas');

//set the variable width and height as the width and height respectively of the canvas element
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

//creating an array to hold THREE.Color objects
var colors = [
    new THREE.Color(0xac1122),
    new THREE.Color(0x96789f),
    new THREE.Color(0x535353)];

// var colors = [
//     new THREE.Color(0x1c3334),
//     new THREE.Color(0x376e6f),
//     new THREE.Color(0xda7b93)];

//create the renderer and assign the canvas as the place to render things. Also set antialiasing as True for smoother animations
var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});



renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x000000);

//create the scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xd5e0df);

//create raycasting object
// var raycaster = new THREE.Raycaster();

//set the precision of the raycasting
// raycaster.params.Points.threshold = 6;

//create the camera in perspective view for more natural animations
var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);

//set the camera position
camera.position.set(0, 0, 350);

//create an empty group and add it to the scene
var galaxy = new THREE.Group();
scene.add(galaxy);

// ------------------------->CREATE DOTS<-----------------------------

//create the texture loader object
var loader = new THREE.TextureLoader();
loader.crossOrigin = "";

//load the texture
// var dotTexture = loader.load("img/dotTexture.png");

//defines how many dots we want
var dotsAmount = 3000;

//create a dotsgeometry object (i think it has been replaced as Points)
var dotsGeometry = new THREE.Geometry();

//create an array of Floating points numbers of size 3 times dotsAmount
var positions = new Float32Array(dotsAmount * 3);

//create an array of Floating point numbers of size dotsAmount
var sizes = new Float32Array(dotsAmount);

//create an array of Floating point numbers of size 3 times dotsAmount
var colorsAttribute = new Float32Array(dotsAmount * 3);

//Loop from 0 to dotsAmount
for (var i = 0; i < dotsAmount; i++) {

    //create a vector
    var vector = new THREE.Vector3();

    //assign the color of the vector by taking a random from 0 to 1 and multiplying by the number of colors
    vector.color = Math.floor(Math.random() * colors.length);


    //randomize the position of the vector
    vector.theta = Math.random() * Math.PI * 2;
    vector.phi =
        (1 - Math.sqrt(Math.random())) *
        Math.PI /
        2 *
        (Math.random() > 0.5 ? 1 : -1);

    
    vector.x = Math.cos(vector.theta) * Math.cos(vector.phi);
    vector.y = Math.sin(vector.phi);
    vector.z = Math.sin(vector.theta) * Math.cos(vector.phi);
    vector.multiplyScalar(120 + (Math.random() - 0.5) * 5);
    vector.scaleX = 5;


    //decide randomly if the vector move or not
    if (Math.random() > 0.5) {
        moveDot(vector, i);
    }


    //add vector to geometry object
    dotsGeometry.vertices.push(vector);

    //add vector info to Positions Array
    vector.toArray(positions, i * 3);

    //add vector color info to ColorsAttribute Array
    colors[vector.color].toArray(colorsAttribute, i*3);

    //fill the Sizes Array with the number 5
    sizes[i] = 5;
}

// ------------------------->MOVE DOTS<-----------------------------
function moveDot(vector, index) {
        
        //create a copy of the vector
        var tempVector = vector.clone();

        //get a random scalar from 0.9 to 1.1
        tempVector.multiplyScalar((Math.random() - 0.5) * 0.2 + 1);

        //animate the motion of the vectors
        TweenMax.to(vector, Math.random() * 3 + 3, {
            x: tempVector.x,
            y: tempVector.y,
            z: tempVector.z,
            yoyo: true,
            repeat: -1,
            delay: -Math.random() * 3,
            ease: Power0.easeNone,
            onUpdate: function () {
                attributePositions.array[index*3] = vector.x;
                attributePositions.array[index*3+1] = vector.y;
                attributePositions.array[index*3+2] = vector.z;
            }
        });
}

var bufferWrapGeom = new THREE.BufferGeometry();
var attributePositions = new THREE.BufferAttribute(positions, 3);
bufferWrapGeom.setAttribute('position', attributePositions);

var attributeSizes = new THREE.BufferAttribute(sizes, 1);
bufferWrapGeom.setAttribute('size', attributeSizes);

var attributeColors = new THREE.BufferAttribute(colorsAttribute, 3);
bufferWrapGeom.setAttribute('color', attributeColors);


//------------------------------->TRYING DIFFERENT MATERIALS<----------------------------
var material = new THREE.PointsMaterial({ color: '#9cb5b3', size: 1.5, sizeAttenuation: true });

var wrap = new THREE.Points(bufferWrapGeom, material);
scene.add(wrap);

var segmentsGeom = new THREE.Geometry();
var segmentsMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    vertexColors: THREE.VertexColors
});
for (i = dotsGeometry.vertices.length - 1; i >= 0; i--) {
    vector = dotsGeometry.vertices[i];
    for (var j = dotsGeometry.vertices.length - 1; j >= 0; j--) {
        if (i !== j && vector.distanceTo(dotsGeometry.vertices[j]) < 12) {
            segmentsGeom.vertices.push(vector);
            segmentsGeom.vertices.push(dotsGeometry.vertices[j]);
            segmentsGeom.colors.push(colors[vector.color]);
            segmentsGeom.colors.push(colors[vector.color]);
        }
    }
}
var segments = new THREE.LineSegments(segmentsGeom, segmentsMat);
galaxy.add(segments);

function render(a) {
    var i;
    dotsGeometry.verticesNeedUpdate = true;
    segmentsGeom.verticesNeedUpdate = true;
    
   
    attributeSizes.needsUpdate = true;
    attributePositions.needsUpdate = true;
    wrap.rotateY(0.0002);
    segments.rotateY(0.0002);
    renderer.render(scene, camera);
}

TweenMax.ticker.addEventListener("tick", render);



