var scene;
var camera;
var renderer;

var woods = [];
var woodCount = [];
var cars = [];
var carCount = [];
var woodSpeed = [];
var carSpeed = [];
var onWood = false;
var trucks = [];
var truckSpeed = [];
var truckCount = 0;

var numberofCars=4;
var numberofWoods=4;
var carWidth = 1;
var frogWidth = 1;
var woodWidth = 2;
var truckWidth = 1;
var lives=3;
var score=0;
var maxscore=0;


var carCollide = frogWidth / 2 + carWidth / 2 - .1;
var truckCollide = frogWidth / 2 + truckWidth / 2 - .1;
var woodCollide = (frogWidth / 4 + woodWidth / 4) + .5;

var div = document.querySelector("#game");

scene = new THREE.Scene();
var WIDTH = window.innerWidth/16
var HEIGHT = window.innerHeight/16;

renderer = new THREE.WebGLRenderer({alpha: true, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true; // add shadows from the light position
renderer.shadowMapType = THREE.PCFSoftShadowMap;

div.appendChild(renderer.domElement);

camera = new THREE.OrthographicCamera(-WIDTH, WIDTH, HEIGHT, -HEIGHT, -30, 30);
camera.position.set(0, 0, 5);
camera.zoom = 6;
camera.updateProjectionMatrix();


var ambientLight = new THREE.AmbientLight(0xCCFFFF);
scene.add(ambientLight);

var light = new THREE.PointLight(0xCCFFFF);
light.position.set(0,0, 5);
light.castShadow = true;
light.shadowDarkness = 0.2;
light.shadowCameraVisible = true;
scene.add(light);

for(i=0;i<numberofCars;i++)
{
    cars[i]=[];
    carCount[i] = 0;
    carSpeed[i]=[];
    //woods[i]=[];
    //woodCount[i] = 0;
    //woodSpeed[i]=[];
}

for(i=0;i<numberofWoods;i++)
{
    woods[i]=[];
    woodCount[i] = 0;
    woodSpeed[i]=[];
}


var frogTexture =  new THREE.ImageUtils.loadTexture("Texture/frog.jpg");

var frogmaterial = new THREE.MeshLambertMaterial({map: frogTexture});

var player = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), frogmaterial);
player.castShadow = true;
player.receiveShadow = false;
player.position.y=-5.5;
player.position.z=0.5;
scene.add(player);


renderObj(20,-5.5,1,"Texture/grass.jpg"); // Add Grass
renderObj(20,-3,4,"Texture/road.jpg"); // Add Road
renderObj(20,-0.001,4,"Texture/road.jpg");
renderObj(20,0.5,1,"Texture/grass.jpg");
renderObj(20,3,4,"Texture/water.jpg"); // Add Water
renderObj(20,5.5,1,"Texture/grass.jpg");



function renderObj(x,y,z,text)
{
    var geometry = new THREE.PlaneGeometry(x,z);
    var ttexture = new THREE.ImageUtils.loadTexture(text);
    ttexture.wrapS = THREE.RepeatWrapping;
    ttexture.wrapT = THREE.RepeatWrapping;
    ttexture.repeat.set(4,1);
    var obj = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({map: ttexture, side: THREE.DoubleSide}));
    obj.position.y = y;
    obj.receiveShadow = true;
    scene.add(obj);

}



var truckTexture =  new THREE.ImageUtils.loadTexture("Texture/truck.jpg");
truckGeometry = new THREE.BoxGeometry(2,0.6,0.6);
truckMaterial = new THREE.MeshBasicMaterial({map: truckTexture,color:0x990000});


var carTexture;

for(j=0;j<numberofCars;j++) {
	
	if (j%2) {
		carTexture = new THREE.ImageUtils.loadTexture("Texture/car1.jpg");
		carGeo = new THREE.BoxGeometry(1,0.5,0.6);
		carMat = new THREE.MeshBasicMaterial({map: carTexture,color:0xCCFFCC});
	}
	else{
		carTexture = new THREE.ImageUtils.loadTexture("Texture/car2.jpg");
		carGeo = new THREE.BoxGeometry(1.5,0.7,0.6);
		carMat = new THREE.MeshBasicMaterial({map: carTexture,color:0x996699});
	}
    cars[j][0] = new THREE.Mesh(carGeo,carMat);
    cars[j][0].position.set(0,-30,-30);

    for (i = 0; i < 50; i++) {
        cars[j][i] = cars[j][0].clone();
        cars[j][i].castShadow = true;
        cars[j][i].receiveShadow = true;
        scene.add(cars[j][i]);
    }
    createObject("car",j);
}

for(j=0;j<numberofWoods;j++) {
	if(j%2){
		woodGeometry = new THREE.BoxGeometry(2, 0.5, 0.6);
		woodMaterial = new THREE.MeshBasicMaterial({color:0x654321});
	}
	else{
		woodGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.6);
		woodMaterial = new THREE.MeshBasicMaterial({color:0x654321});
	}
    woods[j][0] = new THREE.Mesh(woodGeometry,woodMaterial);
    woods[j][0].position.set(0,-30,-30);

    for (i = 0; i < 40; i++) {
        woods[j][i] = woods[j][0].clone();
        woods[j][i].castShadow = true;
        woods[j][i].receiveShadow = true;
        scene.add(woods[j][i]);
    }
    createObject("wood",j);
}


trucks[0] = new THREE.Mesh(truckGeometry,truckMaterial);
trucks[0].position.set(0,-30,-30);

for (i = 0; i < 50; i++) {
    trucks[i] = trucks[0].clone();
    trucks[i].castShadow = true;
    trucks[i].receiveShadow = true;
    scene.add(trucks[i]);
}


createObject("truck");

controls = new THREE.OrbitControls(camera, renderer.domElement);


function createObject(name,ite)
{
    speed = (Math.floor(Math.random() * 4) + 1) / 100;
    number = Math.floor(Math.random() * 4) + 1;
    direction = 1;
    if (name=="car"&&ite >= 2)
    { direction = -1;}
	if (name=="wood"&&Math.random()>0.5)
    { direction = -1;}
	if (name=="truck"&&Math.random()>0.5)
    { direction = -1;}
    pos = -6 * direction;
    for (x = 0; x < number; x++)
    {
    	if(name=="car"){
    	//speed = (Math.floor(Math.random() * 4) + 1) / 100;
    	//number = Math.floor(Math.random() * 4) + 1;
    	if (carCount[ite] < 50)
        {carCount[ite]++;}
        else
        {carCount[ite] = 0;}
        cars[ite][carCount[ite]].position.set(pos,ite-4.5,0);
        carSpeed[ite][carCount[ite]] = speed * direction;
        pos -= 5*direction;}

        if (name=="wood") {
        //speed = (Math.floor(Math.random() * 4) + 1) / 100;
    	//number = Math.floor(Math.random() * 4) + 1;
        if (woodCount[ite] < 50)
        {woodCount[ite]++;}
        else
        {woodCount[ite] = 0;}
        woods[ite][woodCount[ite]].position.set(pos,ite+1.5,0);
        woodSpeed[ite][woodCount[ite]] = speed * direction;
        pos -= 5*direction;
        }

        if (name=="truck") {
        //speed = (Math.floor(Math.random() * 4) + 1) / 100;
    	//number = Math.floor(Math.random() * 4) + 1;
        if (truckCount < 50)
        {truckCount++;}
        else
        {truckCount = 0;}
        trucks[truckCount].position.set(pos,-0.5,0);
        truckSpeed[truckCount] = speed * direction;
        pos -= 5*direction;
        }


    }
}

main();
function main() {

    requestAnimationFrame(main);
    carMotion();
    woodMotion();
    truckMotion();
    carCollision();
    truckCollision();
    woodCollision();
    woodDrop();
    renderer.render(scene, camera);

}

document.addEventListener("keyup", keyPress);

function keyPress(e)
{
    onWood = false;
    e.preventDefault();

    switch (e.keyCode)
    {
        case 38:
            player.position.y+=1;
            break;
        case 40:
            player.position.y-=1;
            break;

        case 37:
            player.position.x-=1;
            break;

        case 39:
            player.position.x+=1;
            break;
    }
}



function carMotion() {
    for (i = 0; i < numberofCars; i++) {
        for (d = 0; d < cars[i].length; d++) {
            cars[i][d].position.x += carSpeed[i][d];
            if (cars[i][d].position.x > 9 && carSpeed[i][d] > 0) {
                cars[i][d].position.x = -9;
            }
            else if (cars[i][d].position.x < -9 && carSpeed[i][d] < 0) {
                cars[i][d].position.x = 9;
            }
        }
    }
}

function woodMotion(){


    for (i = 0; i < numberofWoods; i++) {

        for (d = 0; d < woods[i].length; d++) {

            woods[i][d].position.x += woodSpeed[i][d];

            if (woods[i][d].position.x > 9 && woodSpeed[i][d] > 0) {
                woods[i][d].position.x = -9;
            }
            else if (woods[i][d].position.x < -9 && woodSpeed[i][d] < 0) {
                woods[i][d].position.x = 9;
            }
        }
    }
}

function truckMotion(){
    for (d = 0; d < trucks.length; d++) {

        trucks[d].position.x += truckSpeed[d];

        if (trucks[d].position.x > 9 && truckSpeed[d] > 0) {
            trucks[d].position.x = -9;
        }
        else if (trucks[d].position.x < -9 && truckSpeed[d] < 0) {
            trucks[d].position.x = 9;
        }
    }

}

function woodDrop()
{
    if(player.position.y>=1.5 && player.position.y<=4.5 && onWood == false) {
        alert("Game Over!!");
        reset();
        
    }
}

function carCollision()
{
    for (c = 0; c < cars.length; c++)
    {
        for(i = 0 ;i<cars[c].length;i++) {
            if (player.position.y == cars[c][i].position.y) {
                if (player.position.x < cars[c][i].position.x + carCollide
                    && player.position.x > cars[c][i].position.x - carCollide) {
                     alert("Game Over!!");
                    reset();
                }
            }
        }

    }
}

function woodCollision() {

    for (c = 0; c < woods.length; c++) {

        for (l = 0; l < woods[c].length; l++) {
            if (player.position.y == woods[c][l].position.y) {
                if (player.position.x < woods[c][l].position.x + woodCollide &&
                    player.position.x > woods[c][l].position.x - woodCollide) {
                    onWood = true;

                    if (player.position.x > woods[c][l].position.x) {
                        player.position.x = woods[c][l].position.x + 0.5;
                    } else {
                        player.position.x = woods[c][l].position.x - 0.5;
                    }
                    if (player.position.x > 10 || player.position.x < -10) {
                    	alert("Game Over!!");
                        reset();
                    }
                }
            }
        }
    }
}

function truckCollision()
{
        for(i = 0 ;i<trucks.length;i++) {
            if (player.position.y == trucks[i].position.y) {
                if (player.position.x < trucks[i].position.x + truckCollide
                    && player.position.x > trucks[i].position.x - truckCollide) {
                	alert("Game Over!!");
                    reset();
                }
            }
        }
}



function reset()
{

    player.position.y = -5.5;
    player.position.x = 0;
    lives-=1;

    if(score >maxscore)
        maxscore=score;

    bestscoreDiv.innerHTML = "Best Score:" + maxscore;
    scoreDiv.innerHTML = "Score:" + 0;

    if(lives==0)
        alert("game over. Your best score" + maxscore);


}