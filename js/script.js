//select the canvas element from HTML and assigning it to the canvas variable
let scene, camera, renderer, cube;
const geometry = new THREE.Geometry();
var points
let dotsAmount = 500
var add = 0.1;
var canvas = document.getElementById('myCanvas');
var segmentsGeom;
var segmentsMat;
var segments;



//set the variable width and height as the width and height respectively of the canvas element
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var position = new Float32Array(dotsAmount * 3);

let createdots = function() {

    for(var i = 0; i < dotsAmount; i++) {
        var posX = Math.random() * 150 - 75;
        var posY = Math.random() * 20 - 10;
        var posZ = Math.random() * 50 - 25;
        
        geometry.vertices.push(new THREE.Vector3(posX, posY, posZ));


    }
}

let movePoints = function() {
    if (points.geometry.vertices[3].y <= 5 && points.geometry.vertices[3].y >= -5) {
        points.geometry.vertices[3].y += add;
    } else  {
        add *= -1;
        points.geometry.vertices[3].y += add;
    }
}

let init =  function() {

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

    camera.position.set(0, 0, 95);


    createdots();
    var material = new THREE.PointsMaterial({ color: '#9cb5b3', size: 0.5, sizeAttenuation: true });
    points = new THREE.Points(geometry, material);

    points.position.y = -25;

    
    scene.add( points );


    segmentsGeom = new THREE.Geometry;
    segmentsMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.3,
        vertexColors: THREE.VertexColors
    });

    vector = geometry.vertices[5];
    console.log(vector, points.localToWorld(vector));
    segmentsGeom.vertices.push(points.localToWorld(vector));
    vector = geometry.vertices[6];
    segmentsGeom.vertices.push(points.localToWorld(vector));


    segments = new THREE.LineSegments(segmentsGeom);

    scene.add(segments);


}

let animate = function() {

    var count = dotsAmount;

    while(count--){



        var particle = points.geometry.vertices[count];

        // if(count == 1) {
        //     console.log(points.localToWorld(particle));
        // }

        if (particle.x > 75) {
            particle.x = -75;
        }

        particle.x += Math.random() * 0.05;

        // points.geometry.vertices[count] = particle;

        
        
        // segments.geometry.verticesNeedUpdate = true;
      
    }

    points.geometry.verticesNeedUpdate = true;
    
    // console.log(segments.geometry);
    // segments.geometry.vertices[0] = points.geometry.vertices[5];
    // segments.geometry.vertices[1] = points.geometry.vertices[6];

    

    segments.geometry.verticesNeedUpdate = true;

    //console.log("Line Vectors are : ", segmentsGeom.vertices[1]);
    // console.log("Point vectors are : ", points.geometry.vertices[6]);

    points.rotateX(0.001);

    
 
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}


init();
animate();

