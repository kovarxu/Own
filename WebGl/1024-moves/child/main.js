var body = document.body;
var frame = 0;
var ctxHUD, canvasHUD;
var gl;
var textureSrcs = [], textures = [];
var cubeVertexIndexBuffer = null;
var waitingKeyStart = true;
var soundSwitch = 1;
var currentLevel = 1, levels = {}, level = [];

var camera = {};
var fov = 45;
var pMatrix = mat4.create(), mvMatrix = mat4.create();
var zoomOn = null;


var currentPlayer = 0, players = [];
var vitesseRotation = 0;
var levelDrawing = false;
var moveB, moveF, moveL, moveR;
var glProgram = null;

body.onload = WebGLInit();

body.resize = resize();

function WebGLInit() {
  canvasHUD = document.getElementById("HUD");
  ctxHUD = canvasHUD.getContext("2d");
  
  resize();

  if (!gl) {
    alert("Could not load WebGL sorry");
    return;
	}

  initShaders();
  initBuffers();
  initTexture();
  
  gl.clearColor(0.5, 0.25, 0.85, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // createTextures();
  
  initLevels();
	initGame();
	drawHUDHome();
}

function initShaders() {
  var vs = getShader(gl, "shader-vs");
  var fs = getShader(gl, "shader-fs");
  
  var s = gl.createProgram();
  gl.attachShader(s, vs);
  gl.attachShader(s, fs);
  gl.linkProgram(s);

  gl.useProgram(s);
  s.vertexPositionAttribute = gl.getAttribLocation(s, "a_position");
  gl.enableVertexAttribArray(s.vertexPositionAttribute);
  // s.it = gl.getUniformLocation(s, "it");
  // s.res = gl.getUniformLocation(s, "res");
  glProgram = s;

  function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
  
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }
  
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
  
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(shaderScript.type + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
}

function initBuffers() {
	cubeVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	
	var cubeVertexIndices = [0, 1, 2, 0, 2, 3];
	for (var i = 6; i < 36; i++) {
		cubeVertexIndices.push(cubeVertexIndices[i - 6] + 4);
	}
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	cubeVertexIndexBuffer.itemSize = 1;
	cubeVertexIndexBuffer.numItems = cubeVertexIndices.length;
}

function initTexture() {
  textureSrcs.forEach(getTexture);
  
  function getTexture(src) {
    var tex = gl.createTexture();
    tex.image = new Image();
    tex.image.crossOrigin = 'anonymous';
    tex.image.src = src;
    textures.push({src: src, texture: tex });
    tex.image.onload = function () {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      
      var texImg = tex.image;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
  }
}

function resize() {
  var canvas = document.getElementById("game");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gl = canvas.getContext("webgl2");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	canvasHUD.width = canvas.width;
	canvasHUD.height = canvas.height;
}

function initGame() {
  camera = {
		x: -8,
		y: 16,
		z: 23,
		rotation: {
			x: -1.3,
			y: 0,
			z: 63
		}
	};

  // init current level value
  var l = levels[currentLevel];
  var levelTmp = l.data.join("");
	vitesseRotation = 1;
	levelDrawing = true;
  
  for (var x = 0; x < l.width; x++) {
		level[x] = [];
		for (var y = 0; y < l.height; y++) {
			level[x][y] = {
				h: levelTmp[x + (y * l.width)] ? parseInt(levelTmp[x + (y * l.width)]) : false,
				o: [],
				p: [],
				t: false,
				z: 0,
				inMoveZ: -Math.round(Math.random() * 50), // this is the drop-down speed when level explode, the value is between -50 and 0
				nb: 0 // something related to trigger type
			};
		}
  }
  
  for (var i = 0; i < l.starts.length; i++) {
		players[i] = {
			x: l.starts[i].x * 2,
			y: -l.starts[i].y * 2,
			z: 22,
			rotation: {
				x: 0,
				y: 0,
				z: 0,
				xD: 0
			},
			tile: {
				x: l.starts[i].x,
				y: l.starts[i].y
			},
			inMoveY: 0,
			inMoveX: 0,
			inMoveZ: 0,
			haveControl: false
		};
		level[l.starts[i].x][l.starts[i].y].p = [players[i]];
  }
}

function initLevels() {
  levels = {
    1: {
      "width": 14,
			"height": 8,
			"starts": [{
				"x": 1,
				"y": 4
			}],
			"end": {
				"x": 11,
				"y": 4
			},
			"data": ["00000000000000", "33333333333300", "32222222222300", "32222220222300", "32222200222200", "32222220222300", "32222222222300", "33333333333300"],
			"objects": [],
			"triggers": []
    }
  }
}

function drawHUDHome() {
	frame++;
	ctxHUD.clearRect(0, 0, window.innerWidth, window.innerHeight);
	ctxHUD.fillStyle = '#7F40D9';
	ctxHUD.fillRect(0, 0, canvasHUD.width, canvasHUD.height);
	t = "1024 MOVES";
	drawText(ctxHUD, (window.innerWidth / 2) - 90 * (t.length / 2), 100, t, 15);
	t = "PRESS A KEY TO START";
	drawText(ctxHUD, (window.innerWidth / 2) - 42 * (t.length / 2), 500 + Math.sin(frame / 64) * 10, t, 7);
	rafHUD = requestAnimationFrame(drawHUDHome);
}

function tick() {
  frame++;
  drawScene();
	drawHUD();
	rafTick = requestAnimationFrame(tick);
}

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  mat4.perspective(fov, gl.viewportWidth / gl.viewportHeight, 0.001, 100, pMatrix);
	mat4.identity(mvMatrix);
  
  // player move
  var p = players[currentPlayer];
  if (p) {

  }

  // zoom on
  if (zoomOn) {

  }

  // draw players

  // draw tiles

  // put the end point ball
}

function drawHUD() {

}

// add handler
document.onkeydown = function (e) {
	if (waitingKeyStart) {
		waitingKeyStart = false;
		tick();
		cancelAnimationFrame(rafHUD);
	}
	switch (e.keyCode) {
		case 90:
		case 87:
		case 38: // up
			moveB = true;
			break;
		case 81:
		case 65:
		case 37: // left
			moveL = true;
			break;
		case 40: // down
		case 83:
			moveF = true;
			break;
		case 68:
		case 39: // right
			moveR = true;
			break;
		case 17:
		case 32: //space
			break;
	}
}

document.onkeyup = function (e) {
	switch (e.keyCode) {
		case 90:
		case 87:
		case 38: // up
			moveB = false;
			break;
		case 81:
		case 65:
		case 37: // left
			moveL = false;
			break;
		case 40: // down
		case 83:

			moveF = false;
			break;
		case 68:
		case 39: // right
			moveR = false;
			break;
		case 82: // R
			gameOver();
			break;
		case 77: // M
			soundSwitch = 1 - soundSwitch;
			break;
		case 32:
			currentPlayer = (currentPlayer + 1) % levels[levelEnCours].starts.length
			break;
		default:
			break;
	}
}
