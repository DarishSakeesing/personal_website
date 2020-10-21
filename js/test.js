var dotsAmount = 1500;
var pointsGeometry = new THREE.Geometry();
var pointsSystem;
var particleSystem = new THREE.Group();
var segmentsGeometry;
var segments;
var renderer;
var canvas = document.getElementById('myCanvas');
var width = canvas.offsetWidth, height = canvas.offsetHeight;
console.log(width, height);
var vectorList;
var segmentsMat;

var colors = [
    new THREE.Color(0xac1122),
    new THREE.Color(0xac1122),
    new THREE.Color(0x96789f),
    new THREE.Color(0x535353),
    new THREE.Color(0x96789f),
    new THREE.Color(0x535353),
    new THREE.Color(0x535353),
    new THREE.Color(0x535353),
    new THREE.Color(0x535353)];

var vertColor;




let createDots = function() {
    for(var i = 0; i < dotsAmount; i++) {
        var posX = Math.random() * width - (width/2);
        var posY = Math.random() * height - height/2;
        var posZ = Math.random() * 300 - 150;
        
        pointsGeometry.vertices.push(new THREE.Vector3(posX, 0, posZ));

    }
    //console.log(pointsGeometry.vertices);
}


let createPointsSystem = function() {
    var pointsSystemMaterial = new THREE.PointsMaterial({ color: '#9cb5b3', size: 1, sizeAttenuation: true });
    pointsSystem = new THREE.Points(pointsGeometry, pointsSystemMaterial);

    particleSystem.add(pointsSystem);

    // console.log(pointsSystem.geometry.vertices);
}

let createSegmentsSystem = function() {

    segmentsGeometry = new THREE.Geometry();

    for (i = pointsGeometry.vertices.length - 1; i >= 0; i--) {
        vector = pointsGeometry.vertices[i];
        for (var j = pointsGeometry.vertices.length - 1; j >= 0; j--) {
            if (i !== j && vector.distanceTo(pointsGeometry.vertices[j]) < 30) {
                segmentsGeometry.vertices.push(vector);
                segmentsGeometry.vertices.push(pointsGeometry.vertices[j]);
            }
        }
    }

    lengthColorArray = segmentsGeometry.vertices.length;
    vertColor = new Array(lengthColorArray);

    for(var i = 0; i < vertColor.length; i++) {
        vertColor[i] = colors[Math.floor(Math.random() * colors.length)];
    }

    // console.log(vertColor);
    // console.log(segmentsGeometry.vertices);
    segmentsGeometry.colors = vertColor;
    
};

let createSegments = function() {

    segmentsMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        vertexColors: THREE.Vertex
    });

    segments = new THREE.LineSegments(segmentsGeometry, segmentsMat);

    particleSystem.add(segments);

    //console.log(segments.geometry.vertices);
}

let movePoint = function(vector, index) {
    velocity = vectorList[index];
    // console.log(velocity);

    vector.y += velocity/10;
    if(vector.y >= 10 || vector.y <= -10) {
        vectorList[index] *= -1;
    }


    
}


let init = function() {
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd5e0df);

    camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
    camera.position.set(0, 0, 300);

    createDots();
    createPointsSystem();
    createSegmentsSystem();
    createSegments();

    particleSystem.position.y = -100;
    scene.add(particleSystem);
    var pi = Math.PI;
    // particleSystem.rotateX(pi/2 - 0.2);


    vectorList = new Float32Array(pointsGeometry.vertices.length * 2);
    for(var i=0;i < pointsGeometry.vertices.length; i++) {
        var choose = Math.random();
        if(choose >= 0.5) {
            vectorList[2*(i)] = 1;
            var speed = Math.random();
            vectorList[2*(i)+1] = speed - 0.5;
        } else {
            vectorList[2*(i)] = 0;
            vectorList[2*(i)+ 1] = 0;
        }
        
    }
    //console.log(vectorList);
    
    
}

let animate = function() {
    
    for(var i = 0; i < particleSystem.children[0].geometry.vertices.length; i++) {
        if(vectorList[2*(i)] == 1) {
            movePoint(particleSystem.children[0].geometry.vertices[i], 2*(i) + 1);
        }
    }
    //createSegmentsSystem();
    // segmentsGeometry = new THREE.Geometry();
    // for (i = pointsGeometry.vertices.length - 1; i >= 0; i--) {
    //     vector = pointsGeometry.vertices[i];
    //     for (var j = pointsGeometry.vertices.length - 1; j >= 0; j--) {
    //         if (i !== j && vector.distanceTo(pointsGeometry.vertices[j]) < 12) {
    //             segmentsGeometry.vertices.push(vector);
    //             segmentsGeometry.vertices.push(pointsGeometry.vertices[j]);
    //         }
    //     }
    // }

    // lengthColorArray = segmentsGeometry.vertices.length;
    // vertColor = new Array(lengthColorArray);

    // for(var i = 0; i < vertColor.length; i++) {
    //     vertColor[i] = colors[Math.floor(Math.random() * colors.length)];
    // }
    // segmentsGeometry.colors = vertColor;

    // particleSystem.children[1].geometry = segmentsGeometry;

    particleSystem.children[0].geometry.verticesNeedUpdate = true;
    particleSystem.children[1].geometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

init();
animate();

