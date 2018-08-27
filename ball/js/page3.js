var worldWidth = 178, worldDepth = 178,worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor(0x4584b4);           
var camera, scene;
var foggeometry,fogmaterial, starmaterial, fogmesh,meshback,light1;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;
camera.lookAt(scene.position);

starskyInit();
starskyAnimate();
fogInit();
fogAnimate();

//雾体 初始化
function fogInit() {
	/*var geometry = new THREE.CircleBufferGeometry( 0.05, 50 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	var circle = new THREE.Mesh( geometry, material );
	scene.add( circle );*/
	
	var sphere = new THREE.SphereBufferGeometry( 0.03, 50, 50 );
	light1 = new THREE.PointLight( 0xff0040, 2, 50 );
	light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
	scene.add( light1 );
	/*var data = generateHeight( worldWidth, worldDepth );
	console.log(data);
	foggeometry = new THREE.PlaneBufferGeometry( 500, 500, worldWidth - 1, worldDepth - 1 );
	foggeometry.rotateX( - Math.PI / 2 );
	var vertices = foggeometry.attributes.position.array;
	for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
		vertices[ j + 1 ] = data[ i ] * 10;
	}
	var texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	fogmesh = new THREE.Mesh( foggeometry, new THREE.MeshBasicMaterial( { map: texture } ) );
	//fogmesh.position.set(0,0,0);
	//scene.add( fogmesh );*/
    
    document.body.appendChild( renderer.domElement );
    
}

//雾体旋转

function fogAnimate() {	
    requestAnimationFrame( fogAnimate );
    var time = Date.now() * 0.0005 / 100000000;
    //fogmesh.rotation.y += 0.001; 
    light1.position.x = Math.sin( time * 0.7 ) * 3;
	light1.position.y = Math.cos( time * 0.5 ) * 4;
	light1.position.z = Math.cos( time * 0.3 ) * 3;
    renderer.render(scene,camera);
    renderer.autoClear = false;
}

//星空初始化
function starskyInit(){
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled=true;//允许阴影映射	
    //环境光
    /*var amblight1 = new THREE.AmbientLight(0xffffff);
	scene.add( amblight1 ); */
    document.body.appendChild(renderer.domElement);
    //点
    starmaterial = new THREE.PointsMaterial({
            color: "white",
            size: .1,
            map: function() {
                var t = document.createElement("canvas");
                t.width = 40,
                t.height = 40;
                var e = t.getContext("2d");
                e.fillStyle = "#fff",
                e.arc(20, 20, 15, 0, 2 * Math.PI),
                e.fill();
                var i = new THREE.Texture(t);
                return i.needsUpdate = !0,
                i
            }()
        });
    
    for (var t = new THREE.Geometry, e = 0; e < 2000; e++) {//10000
    	var pointMesh = new THREE.Vector3;
        pointMesh.x = randFloatSpread(10);
        pointMesh.y = randFloatSpread(10);
        pointMesh.z = randFloat(-100, 0); 
        t.vertices.push(pointMesh); 
    }
   	meshback = new THREE.Points(t,starmaterial);
   	meshback.receiveShadow = true;
    scene.add(meshback);        
    
    document.body.appendChild( renderer.domElement );
}
//星空动画
function starskyAnimate() {
    requestAnimationFrame( starskyAnimate );
    //meshback.position.z += 0.03;
    renderer.autoClear = false;
}


/*function generateHeight( width, height ) {
	var size = width * height, 
	data = new Uint8Array( size ),
	perlin = new ImprovedNoise(), 
	quality = 1, 
	z = Math.random() * 100;
	for ( var j = 0; j < 4; j ++ ) {
		for ( var i = 0; i < size; i ++ ) {
			var x = i % width, y = ~~ ( i / width );
			data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
		}
		quality *= 5;
	}
	return data;
}
function generateTexture( data, width, height ) {
	var canvas, canvasScaled, context, image, imageData,
	level, diff, vector3, sun, shade;
	vector3 = new THREE.Vector3( 0, 0, 0 );
	sun = new THREE.Vector3( 1, 1, 1 );
	sun.normalize();
	canvas = document.createElement( 'canvas' );
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext( '2d' );
	context.fillStyle = '#000';
	context.fillRect( 0, 0, width, height );
	image = context.getImageData( 0, 0, canvas.width, canvas.height );
	imageData = image.data;
	for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
		vector3.x = data[ j - 2 ] - data[ j + 2 ];
		vector3.y = 2;
		vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
		vector3.normalize();
		shade = vector3.dot( sun );
		imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
	}
	context.putImageData( image, 0, 0 );
	
	canvasScaled = document.createElement( 'canvas' );
	canvasScaled.width = width * 4;
	canvasScaled.height = height * 4;
	context = canvasScaled.getContext( '2d' );
	context.scale( 4, 4 );
	context.drawImage( canvas, 0, 0 );
	image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
	imageData = image.data;
	for ( var i = 0, l = imageData.length; i < l; i += 4 ) {
		var v = ~~ ( Math.random() * 5 );
		imageData[ i ] += v;
		imageData[ i + 1 ] += v;
		imageData[ i + 2 ] += v;
	}
	context.putImageData( image, 0, 0 );
	return canvasScaled;
}*/
//计算圆点排列位置
function randFloatSpread(t) {
	return Math.random() * (20 - (-20) + 1) - 20
}
function randFloat(t, e) {
    return t + Math.random() * (e - t)
}
