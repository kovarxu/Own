var body = document.body;
var frame = 0;
var ctxHUD, canvasHUD;
var gl;
var textureSrcs = [], textures = [];
var cTextures = {length: 0};
var cubeVertexIndexBuffer = null;
var waitingKeyStart = true;
var soundSwitch = 1;
var tutoText = '';
var totalMoves = 0;
var currentLevel = 1, levels = {}, level = [];

var camera = {};
var fov = 45;
var pMatrix = mat4.create(), mvMatrix = mat4.create();
var zoomOn = null;

var coordBuffer = {}, UVWBuffer = {};

var currentPlayer = 0, players = [];
var vitesseRotation = 0;
var levelDrawing = false;
var moveB, moveF, moveL, moveR;
var glProgram = null;
var levelExplode = false;

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

  createTextures();
  
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
	
	// handle link errors
	if ( !gl.getProgramParameter( s, gl.LINK_STATUS) ) {
		var info = gl.getProgramInfoLog(s);
		alert('Could not compile WebGL program. \n\n' + info);
		throw new Error();
	}

  gl.useProgram(s);
  s.vertexPositionAttribute = gl.getAttribLocation(s, "a_position");
  gl.enableVertexAttribArray(s.vertexPositionAttribute);
  s.textureCoordAttribute = gl.getAttribLocation(s, 'a_texture');
  gl.enableVertexAttribArray(s.textureCoordAttribute);
  s.pMatrixUniform = gl.getUniformLocation(s, "u_pmatrix");
	s.vMatrixUniform = gl.getUniformLocation(s, "u_vmatrix");
	s.uCameraPosition = gl.getUniformLocation(s, 'u_cameraPosition');
	s.uSampler = gl.getUniformLocation(s, 'u_u_sampler');
  
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
  textureSrcs.forEach(function(src) {
		var tex = gl.createTexture();
    tex.image = new Image();
    tex.image.crossOrigin = 'anonymous';
    tex.image.src = src;
    textures.push({src: src, texture: tex });
    tex.image.onload = function () {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, tex);
			setTextureParams(tex.image);
    }
	})
}

function handleLoadedTextureFromCanvas(name, textureCanvas) {
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	setTextureParams(textureCanvas);
	cTextures[name] = texture;
	if (/\d+/.test(name)) {
		cTextures.length++;
	}
}

function setTextureParams(texture) {
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
}

function createTextures() {
	var canvas2 = document.createElement('canvas');
	canvas2.width = canvas2.height = 512;
	var ctx2 = canvas2.getContext('2d');
	var iD = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

	// tiles bottom wall
	for (var i=0; i < iD.data.length; i+=4) {
		var c = Math.floor(Math.random() * 255);
		iD.data[i+0] = 193 - c / 1500;
		iD.data[i+1] = 171 - c / 1700;
		iD.data[i+2] = 146 - c / 1900;
		iD.data[i+3] = 255;
	}

	ctx2.putImageData(iD, 0, 0);
	handleLoadedTextureFromCanvas('bottomWall', canvas2);

	{
		// test again, it's has orange border, then blur border and orange squere in the center
		let d = canvas2.toDataURL();
		let i = new Image();
		i.src = d;
		document.body.appendChild(i);
	}

	for (var j = 0; j < 23; j++) {
		var offset = 10 + Math.random() * 3;
		var c = Math.random();
		var color = {
			r: 27 - c * 60,
			g: 165 - c * 10,
			b: 211 - c * 7.5
		}
		delta = {
			r: 0,
			g: 0,
			b: 0
		};
		ctx2.clearRect(0, 0, 512, 512);
		for (var i = 0; i < iD.data.length; i += 4) {
			var x = (i / 4) % 512;
			var y = Math.floor(i / 2048);
			tileBorder = j == 21 ? 30 : offset;
			if (j == 22) {
				tileBorder = 30;
				var isBordure = (y < tileBorder || y > 512 - tileBorder || x < tileBorder || x > 512 - tileBorder);

				x2 = Math.abs(x - 256);
				y2 = Math.abs(y - 256);
				if (Math.hypot(x2, y2) < 128 || Math.hypot(128 - x2, 128 - y2) < 64 || Math.hypot(192 - x2, 192 - y2) < 32) {
					isBordure = true
				}

				if (isBordure) {
					delta.r = delta.g = delta.b = Math.hypot(256 - x, 256 - y) > 32 ? Math.hypot(256 - x, 256 - y) : 255;
				} else {
					delta = {
						r: 0,
						g: 0,
						b: 0
					}
				}

			} else {
				var isBordure = (y < tileBorder || y > 512 - tileBorder || x < tileBorder || x > 512 - tileBorder);
			}

			iD.data[i + 0] = isBordure ? color.r / 2 + delta.r : color.r;
			iD.data[i + 1] = isBordure ? color.g / 2 + delta.g : color.g;
			iD.data[i + 2] = isBordure ? color.b / 2 + delta.b : color.b;
			iD.data[i + 3] = 255;
		}
		ctx2.putImageData(iD, 0, 0);
		handleLoadedTextureFromCanvas(j, canvas2);
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
		x: -2.0,
		y: 18.0,
		z: 24.0,
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
			z: 4,
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
  for (var i=0; i < players.length; i++) {
    var p = players[i];
		var t = level[p.tile.x][p.tile.y];
    var tHeight = (t.h + t.o.length) * 2;
    
    drawCube({
      x: players[i].x,
      y: players[i].y,
      z: players[i].z,
			h: 1,
			type: "player",
			player: p,
			currentPlayer: i == currentPlayer
    })
  }

	// draw tiles
	for (var x = 0; x < levels[currentLevel].width; x++) {
		for (var y = 0; y < levels[currentLevel].height; y++) {
			var t = level[x][y];
			var h = t.h + t.o.length;
			if (!t.h) {
				h = -10;
			}

			if (t.o.length) {

			}

			// a hole
			var h = t.h;
			if (!h) {
				continue;
			}

			var decal = {
				x: 0,
				y: 0,
				z: 0
			};
			var rotation = {
				x: 0,
				y: 0,
				z: 0
			};

			if (levelExplode) {

			} else {

			}

			// two layers
			drawCube({
				x: x * 2,
				y: -y * 2,
				z: 0,
				h: h - 0.2,
				type: "normal",
				trigger: t.t,
				decal: decal,
				rotation: rotation,
				triggered: t.triggered,
			})

			drawCube({
				x: x * 2,
				y: -y * 2,
				z: (h * 2) - 0.4,
				h: 0.2,
				type: "normal2",
				trigger: t.t,
				decal: decal,
				rotation: rotation
			})
		}
	}

  //light

  // put the end point ball
}

function drawCube(obj) {
  var x = obj.x;
	var y = obj.y;
	var z = obj.z;
	var height = obj.h;
	var type = obj.type;
	var decal = obj.decal;
	var rotation = obj.rotation;
	var p = obj.player;
	var currentPlayer = obj.currentPlayer; // true or flase
	// var trigger = obj.trigger;
  // var triggered = obj.triggered;
  
  switch (type) {
		case "player":
			var geometry = getCube(height);
			for (var i = 0; i < geometry.length; i += 3) {
				geometry[i + 2]--;
			}
			break;
		default:
			var geometry = getCube(height);
			break;
  }
  
	//move and rotate accordinaly to the camera
  cam = {
		x: x + camera.x,
		y: y + camera.y,
		z: z + -1.2 - camera.z
	}
	if (decal) {
		cam.x += decal.x;
		cam.y += decal.y;
		cam.z += decal.z;
  }
  
  //cal the transform matrix
  mat4.identity(mvMatrix);
	mat4.rotate(mvMatrix, degToRad(camera.rotation.z - 90), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(camera.rotation.y), [0, 1, 0]);
  mat4.translate(mvMatrix, [cam.x, cam.y, cam.z]);
  
  //rotate player 
	if (type === "player") {
		mat4.translate(mvMatrix, [0, 0, 1]);
		// if (p.inMoveY > 0) {
		// 	p.rotation.x += degToRad(90 / vitesseRotation);
		// } else if (p.inMoveY < 0) {
		// 	p.rotation.x -= degToRad(90 / vitesseRotation);
		// }

		// if (p.inMoveX > 0) {
		// 	p.rotation.y += degToRad(90 / vitesseRotation);
		// } else if (p.inMoveX < 0) {
		// 	p.rotation.y -= degToRad(90 / vitesseRotation);
		// }

		mat4.rotate(mvMatrix, p.rotation.x, [1, 0, 0]);
		switch (p.rotation.xD) {
			case 0:
				mat4.rotate(mvMatrix, p.rotation.y, [0, 1, 0]);
				break;
			case 1:
				mat4.rotate(mvMatrix, -p.rotation.y, [0, 0, 1]);
				break;
			case 2:
				mat4.rotate(mvMatrix, -p.rotation.y, [0, 1, 0]);
				break;
			case 3:
				mat4.rotate(mvMatrix, p.rotation.y, [0, 0, 1]);
				break;
		}
  }
  
	if (rotation) {
		mat4.rotate(mvMatrix, rotation.x, [1, 0, 0]);
		mat4.rotate(mvMatrix, rotation.y, [0, 1, 0]);
		mat4.rotate(mvMatrix, rotation.z, [0, 0, 1]);
  }
  
  gl.useProgram(glProgram);

  // set geometry
  var buffer = getCoord(type, height, geometry);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(glProgram.vertexPositionAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
  
  // set uvw(texture) infos
  var buffer = getUVWBuffer(type, height);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(glProgram.textureCoordAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
  
  // set uniforms
	gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(glProgram.vMatrixUniform, false, mvMatrix);
	gl.uniform3fv(glProgram.uCameraPosition, [camera.x, camera.y, camera.z]);
	gl.uniform1i(glProgram.uSampler, 0);
  if (type === "player") {
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	} else {
		var tileIndex = (x / 2 + (-y / 2 * 10)) % 21
		gl.bindTexture(gl.TEXTURE_2D, cTextures[tileIndex]);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		
		if (type === "normal2") {
			gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 12);
		}else {
			gl.bindTexture(gl.TEXTURE_2D, cTextures['bottomWall']);
			gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 12);
		}
	}
}

function drawHUD() {
  ctxHUD.clearRect(0, 0, window.innerWidth, window.innerHeight);
	if (tutoText) {
		drawText((window.innerWidth / 2) - (12 * 3 / 2) * (tutoText.length / 2), (window.innerHeight / 2) + 144, tutoText.toUpperCase(), 3);
	} else {
		drawText(10, 10, totalMoves + " MOVE" + (totalMoves > 1 ? "S" : ""), 3);
		var t = "STAGE " + currentLevel;
		drawText((window.innerWidth / 2) - 27 * (t.length / 2), 20, t, 4.5);
		drawText(10, 100, "M - MUTE&R - RETRY", 3);
	}
}

function degToRad(d) {
  return Math.PI / 180 * d
}

function getCoord(type, height, cube) {
  if (!coordBuffer[type]) {
		coordBuffer[type] = [];
	}
	if (!coordBuffer[type][height]) {
		coordBuffer[type][height] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer[type][height]);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube), gl.STATIC_DRAW);
		coordBuffer[type][height].itemSize = 3;
		coordBuffer[type][height].numItems = cube.length / 3;
	}
	return coordBuffer[type][height];
}

function getUVWBuffer(type, height) {
	if (!UVWBuffer[type]) {
		UVWBuffer[type] = [];
	}
	if (!UVWBuffer[type][height]) {
		var data = new Float32Array(getUVW(type, height));
		UVWBuffer[type][height] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, UVWBuffer[type][height]);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		UVWBuffer[type][height].itemSize = 2;
		UVWBuffer[type][height].numItems = data.length / 2;
	}
	return UVWBuffer[type][height];
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