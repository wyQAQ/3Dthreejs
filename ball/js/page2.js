var width = 150;
var length = 150;
var pointSize = 0.05;
var spheres = [];
var spheresIndex = 0;

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor(0x4584b4);           
var camera, scene;
var geometry, material, pcBuffer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set( 2, 0, 0 );
camera.lookAt(scene.position);

curveInit();
var bool = false;
animateInit();

//曲面初始化
function curveInit(){
	renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled=true;//允许阴影映射	
    
    pcBuffer = generatePointcloud( new THREE.Color( 34,70,125 ), width, length );
	pcBuffer.scale.set( 20,20,20 );
	pcBuffer.position.set( 1,0,0 );
	pcBuffer.rotation.x -= 0.2;
	pcBuffer.rotation.z += 0.1;
	scene.add( pcBuffer );
    	
	//环境光
    var amblight = new THREE.AmbientLight(0x000000);
	scene.add( amblight );	
	document.body.appendChild( renderer.domElement );
}

//曲线动画渲染
function animateInit(){
	requestAnimationFrame( animateInit );
	if(camera.position.x >=2 && camera.position.x <= 3 && bool == false){			
		curveAnimate();
		if(camera.position.x >= 3){
			camera.position.x = 3;
			bool = true;
		}
	}else if(bool == true){
		recurveAnimate();
		if(camera.position.x <= 2){
			camera.position.x = 2;
			bool = false;
		}
	}
	renderer.render(scene,camera);
    renderer.autoClear = false;
}
function curveAnimate(){
	camera.position.x +=0.003;
}
function recurveAnimate(){
	camera.position.x -=0.003;
}

function generatePointCloudGeometry(color, width, length) {
	var geometry = new THREE.BufferGeometry();
	var numPoints = width * length;
	var positions = new Float32Array(numPoints * 2);
	var colors = new Float32Array(numPoints * 2);
	var k = 0;
	for(var i = 0; i < width; i++) {
		for(var j = 0; j < length; j++) {
			var u = i / width;
			var v = j / length;
			var x = u - 0.5;
			var y = (Math.cos(u * Math.PI * 2) + Math.sin(v * Math.PI * 2)) / 5;
			var z = v - 0.5;
			positions[3 * k] = x;
			positions[3 * k + 1] = y;
			positions[3 * k + 2] = z;
			var intensity = 1;//(y + 0.1) * 5;
			colors[3 * k] = color.r * intensity;
			colors[3 * k + 1] = color.g * intensity;
			colors[3 * k + 2] = color.b * intensity;
			k++;
		}
	}
	
	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
	geometry.computeBoundingSphere();// computeBoundingBox	
	return geometry;
}

function generatePointcloud(color, width, length) {
	var geometry = generatePointCloudGeometry(color, width, length);
	var material = new THREE.PointsMaterial({
		color: '#01f',//blue
		size : pointSize,
		opacity : 0.5,
		vertexColors : THREE.VertexColors//,
		/*map: function() {
            var t = document.createElement("canvas");
            t.width = 40,
            t.height = 40;
            var e = t.getContext("2d");
            e.fillStyle = "#fff",
            e.arc(20, 20, 20, 0, 2 * Math.PI),
            e.fill();
            var i = new THREE.Texture(t);
            return i.needsUpdate = !0,
            i
        }()*/
	});
	var pointcloud = new THREE.Points(geometry, material);
	return pointcloud;
}
