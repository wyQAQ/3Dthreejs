var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor(0x4584b4);           
var camera1, scene1;
var geometry1, material1, mesh1;
scene1 = new THREE.Scene();
camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.z = 7;
camera1.lookAt(scene1.position);

earthInit();
earthAnimate();  
starskyInit();
starskyAnimate();
loopcircleInit();
loopAnimate();


//背景星空初始化
var material2, meshback;
function starskyInit(){
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled=true;//允许阴影映射		
    //点
    material2 = new THREE.PointsMaterial({
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
    
    for (var t = new THREE.Geometry, e = 0; e < 2e5; e++) {//10000
    	var pointMesh = new THREE.Vector3;
        pointMesh.x = randFloatSpread(10);
        pointMesh.y = randFloatSpread(10);
        pointMesh.z = randFloat(-10000, 0); 
        var pathDeep = pointMesh.x * pointMesh.x + pointMesh.y * pointMesh.y;
        pathDeep = Math.sqrt(pathDeep);
        if(pathDeep > 1.5){
        	t.vertices.push(pointMesh);
        }	 
    }
   	meshback = new THREE.Points(t,material2);
    scene1.add(meshback);        
    
    document.body.appendChild(renderer.domElement);
}
//背景动画
function starskyAnimate() {
    requestAnimationFrame( starskyAnimate );
    meshback.position.z += 0.03;
    renderer.autoClear = false;
}

//球体初始化
function earthInit() {	
    //球体    
    geometry1 = new THREE.SphereGeometry(1.5,50,50);
    //纹理图片路径要求同域
    material1 = new THREE.MeshLambertMaterial({color:0xffffff, map:THREE.ImageUtils.loadTexture('img/earth.png')});
    mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.set(0,0,0);
    mesh1.receiveShadow=true;//平面进行接受阴影
    mesh1.rotation.x = .5;
    scene1.add( mesh1 );
     
    //环境光
    var amblight1 = new THREE.AmbientLight(0xffffff);
	scene1.add( amblight1 ); 
	
    //平行光源
    var dirtLight = new THREE.DirectionalLight(16777215,20);
    dirtLight.position.set(10,5,-10);
    dirtLight.target = mesh1;
    scene1.add(dirtLight);
    
    document.body.appendChild( renderer.domElement );
    
}

//球体旋转
function earthAnimate() {
    requestAnimationFrame( earthAnimate );
    mesh1.rotation.y += 0.005;
    renderer.render(scene1,camera1);
    renderer.autoClear = false;
}

//旋转圆环初始化
var loopMesh1,loopMesh2,loopGeo,loopMat;
function loopcircleInit(){   	
	renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled=true;//允许阴影映射
    
    loopGeo = new THREE.CircleGeometry( 2.2, 100 );
	loopMat = new THREE.MeshBasicMaterial( { map:THREE.ImageUtils.loadTexture('img/loop1.png'),transparent: !0 } );
	loopMesh1 = new THREE.Mesh( loopGeo, loopMat );
	scene1.add( loopMesh1 );
	loopGeo = new THREE.CircleGeometry( 2, 100 );
	loopMat = new THREE.MeshBasicMaterial( { map:THREE.ImageUtils.loadTexture('img/loop2.png'),transparent: !0 } );
	loopMesh2 = new THREE.Mesh( loopGeo, loopMat );
	scene1.add( loopMesh2 );
            
    document.body.appendChild( renderer.domElement );
}
//圆环旋转
function loopAnimate(){
	requestAnimationFrame( loopAnimate );
   	loopMesh1.rotation.z -= .0075;
   	loopMesh2.rotation.z += .0075;
    renderer.autoClear = false;
}


//计算圆点排列位置
function randFloatSpread(t) {
	return Math.random() * (20 - (-20) + 1) - 20
}
function randFloat(t, e) {
    return t + Math.random() * (e - t)
}