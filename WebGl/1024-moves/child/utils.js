function SfxrP() {
	this.set = function (a) {
		for (var b = 0; b < 24; b++) this[String.fromCharCode(97 + b)] = a[b] || 0;
		this.c < .01 && (this.c = .01);
		var c = this.b + this.c + this.e;
		if (c < .18) {
			var d = .18 / c;
			this.b *= d, this.c *= d, this.e *= d
		}
	}
}

function sy() {
	this._p = new SfxrP;
	var a, b, c, d, e, f, g, h, i, j, k, l;
	this.reset = function () {
		var a = this._p;
		d = 100 / (a.f * a.f + .001), e = 100 / (a.g * a.g + .001), f = 1 - a.h * a.h * a.h * .01, g = -a.i * a.i * a.i * 1e-6, a.a || (k = .5 - a.n / 2, l = 5e-5 * -a.o), h = 1 + a.l * a.l * (a.l > 0 ? -.9 : 10), i = 0, j = 1 == a.m ? 0 : (1 - a.m) * (1 - a.m) * 2e4 + 32
	}, this.totalReset = function () {
		this.reset();
		var d = this._p;
		return a = d.b * d.b * 1e5, b = d.c * d.c * 1e5, c = d.e * d.e * 1e5 + 12, 3 * ((a + b + c) / 3 | 0)
	}, this.sW = function (m, n) {
		var o = this._p,
			p = 1 != o.s || o.v,
			q = o.v * o.v * .1,
			r = 1 + 3e-4 * o.w,
			s = o.s * o.s * o.s * .1,
			t = 1 + 1e-4 * o.t,
			u = 1 != o.s,
			v = o.x * o.x,
			w = o.g,
			x = o.q || o.r,
			y = o.r * o.r * o.r * .2,
			z = o.q * o.q * (o.q < 0 ? -1020 : 1020),
			A = o.p ? ((1 - o.p) * (1 - o.p) * 2e4 | 0) + 32 : 0,
			B = o.d,
			C = o.j / 2,
			D = o.k * o.k * .01,
			E = o.a,
			F = a,
			G = 1 / a,
			H = 1 / b,
			I = 1 / c,
			J = 5 / (1 + o.u * o.u * 20) * (.01 + s);
		J > .8 && (J = .8), J = 1 - J;
		for (var Q, S, U, W, Y, Z, K = !1, L = 0, M = 0, N = 0, O = 0, P = 0, R = 0, T = 0, V = 0, X = 0, $ = 0, _ = new Array(1024), aa = new Array(32), ba = _.length; ba--;) _[ba] = 0;
		for (var ba = aa.length; ba--;) aa[ba] = 2 * Math.random() - 1;
		for (var ba = 0; ba < n; ba++) {
			if (K) return ba;
			if (A && ++X >= A && (X = 0, this.reset()), j && ++i >= j && (j = 0, d *= h), f += g, d *= f, d > e && (d = e, w > 0 && (K = !0)), S = d, C > 0 && ($ += D, S *= 1 + Math.sin($) * C), S |= 0, S < 8 && (S = 8), E || (k += l, k < 0 ? k = 0 : k > .5 && (k = .5)), ++M > F) switch (M = 0, ++L) {
				case 1:
					F = b;
					break;
				case 2:
					F = c
			}
			switch (L) {
				case 0:
					N = M * G;
					break;
				case 1:
					N = 1 + 2 * (1 - M * H) * B;
					break;
				case 2:
					N = 1 - M * I;
					break;
				case 3:
					N = 0, K = !0
			}
			x && (z += y, U = 0 | z, U < 0 ? U = -U : U > 1023 && (U = 1023)), p && r && (q *= r, q < 1e-5 ? q = 1e-5 : q > .1 && (q = .1)), Z = 0;
			for (var ca = 8; ca--;) {
				if (T++, T >= S && (T %= S, 3 == E))
					for (var da = aa.length; da--;) aa[da] = 2 * Math.random() - 1;
				switch (E) {
					case 0:
						Y = T / S < k ? .5 : -.5;
						break;
					case 1:
						Y = 1 - T / S * 2;
						break;
					case 2:
						W = T / S, W = 6.28318531 * (W > .5 ? W - 1 : W), Y = 1.27323954 * W + .405284735 * W * W * (W < 0 ? 1 : -1), Y = .225 * ((Y < 0 ? -1 : 1) * Y * Y - Y) + Y;
						break;
					case 3:
						Y = aa[Math.abs(32 * T / S | 0)]
				}
				p && (Q = R, s *= t, s < 0 ? s = 0 : s > .1 && (s = .1), u ? (P += (Y - R) * s, P *= J) : (R = Y, P = 0), R += P, O += R - Q, O *= 1 - q, Y = O), x && (_[V % 1024] = Y, Y += _[(V - U + 1024) % 1024], V++), Z += Y
			}
			Z *= .125 * N * v, m[ba] = Z >= 1 ? 1 : Z <= -1 ? -1 : Z
		}
		return n
	}
}
var synth = new sy;
window.jsfxr = function (a) {
	window._audioContext = window._audioContext || new AudioContext;
	var b = window._audioContext;
	synth._p.set(a);
	var c = synth.totalReset(),
		d = c + 1 >> 1 << 1,
		e = b.createBuffer(1, d, b.sampleRate),
		f = e.getChannelData(0);
	2 * synth.sW(f, c);
	return e
}, window.playSound = function (n) {
	if (!sound) {
		return;
	}
	jsfxr(n);
	var o = window._audioContext,
		e = o.createBufferSource();
	e.buffer = jsfxr(n), e.loop = !1, e.connect(o.destination), e.start(o.currentTime);
	return [e.buffer, o, e]
};

glMatrixArrayType = "undefined" != typeof Float32Array ? Float32Array : "undefined" != typeof WebGLFloatArray ? WebGLFloatArray : Array;

var mat3 = {};
mat3.create = function (r) {
	var t = new glMatrixArrayType(9);
	return r && (t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = r[7], t[8] = r[8], t[9] = r[9]), t
}, mat3.transpose = function (r, t) {
	if (!t || r == t) {
		var a = r[1],
			n = r[2],
			e = r[5];
		return r[1] = r[3], r[2] = r[6], r[3] = a, r[5] = r[7], r[6] = n, r[7] = e, r
	}
	return t[0] = r[0], t[1] = r[3], t[2] = r[6], t[3] = r[1], t[4] = r[4], t[5] = r[7], t[6] = r[2], t[7] = r[5], t[8] = r[8], t
};

var mat4 = {};
mat4.create = function (r) {
	var t = new glMatrixArrayType(16);
	return r && (t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = r[7], t[8] = r[8], t[9] = r[9], t[10] = r[10], t[11] = r[11], t[12] = r[12], t[13] = r[13], t[14] = r[14], t[15] = r[15]), t
}, mat4.identity = function (r) {
	return r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = 1, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = 1, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r
}, mat4.toInverseMat3 = function (r, t) {
	var a = r[0],
		n = r[1],
		e = r[2],
		u = r[4],
		i = r[5],
		o = r[6],
		f = r[8],
		m = r[9],
		c = r[10],
		v = c * i - o * m,
		y = -c * u + o * f,
		l = m * u - i * f,
		s = a * v + n * y + e * l;
	return s ? (s = 1 / s, t || (t = mat3.create()), t[0] = v * s, t[1] = (-c * n + e * m) * s, t[2] = (o * n - e * i) * s, t[3] = y * s, t[4] = (c * a - e * f) * s, t[5] = (-o * a + e * u) * s, t[6] = l * s, t[7] = (-m * a + n * f) * s, t[8] = (i * a - n * u) * s, t) : null
}, mat4.translate = function (r, t, a) {
	var n = t[0],
		e = t[1];
	if (t = t[2], !a || r == a) return r[12] = r[0] * n + r[4] * e + r[8] * t + r[12], r[13] = r[1] * n + r[5] * e + r[9] * t + r[13], r[14] = r[2] * n + r[6] * e + r[10] * t + r[14], r[15] = r[3] * n + r[7] * e + r[11] * t + r[15], r;
	var u = r[0],
		i = r[1],
		o = r[2],
		f = r[3],
		m = r[4],
		c = r[5],
		v = r[6],
		y = r[7],
		l = r[8],
		s = r[9],
		M = r[10],
		p = r[11];
	return a[0] = u, a[1] = i, a[2] = o, a[3] = f, a[4] = m, a[5] = c, a[6] = v, a[7] = y, a[8] = l, a[9] = s, a[10] = M, a[11] = p, a[12] = u * n + m * e + l * t + r[12], a[13] = i * n + c * e + s * t + r[13], a[14] = o * n + v * e + M * t + r[14], a[15] = f * n + y * e + p * t + r[15], a
}, mat4.rotate = function (r, t, a, n) {
	var e = a[0],
		u = a[1];
	a = a[2];
	var i = Math.sqrt(e * e + u * u + a * a);
	if (!i) return null;
	1 != i && (e *= i = 1 / i, u *= i, a *= i);
	var o = Math.sin(t),
		f = Math.cos(t),
		m = 1 - f;
	t = r[0], i = r[1];
	var c = r[2],
		v = r[3],
		y = r[4],
		l = r[5],
		s = r[6],
		M = r[7],
		p = r[8],
		A = r[9],
		d = r[10],
		h = r[11],
		F = e * e * m + f,
		g = u * e * m + a * o,
		x = a * e * m - u * o,
		T = e * u * m - a * o,
		b = u * u * m + f,
		w = a * u * m + e * o,
		G = e * a * m + u * o;
	return e = u * a * m - e * o, u = a * a * m + f, n ? r != n && (n[12] = r[12], n[13] = r[13], n[14] = r[14], n[15] = r[15]) : n = r, n[0] = t * F + y * g + p * x, n[1] = i * F + l * g + A * x, n[2] = c * F + s * g + d * x, n[3] = v * F + M * g + h * x, n[4] = t * T + y * b + p * w, n[5] = i * T + l * b + A * w, n[6] = c * T + s * b + d * w, n[7] = v * T + M * b + h * w, n[8] = t * G + y * e + p * u, n[9] = i * G + l * e + A * u, n[10] = c * G + s * e + d * u, n[11] = v * G + M * e + h * u, n
}, mat4.frustum = function (r, t, a, n, e, u, i) {
	i || (i = mat4.create());
	var o = t - r,
		f = n - a,
		m = u - e;
	return i[0] = 2 * e / o, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = 2 * e / f, i[6] = 0, i[7] = 0, i[8] = (t + r) / o, i[9] = (n + a) / f, i[10] = -(u + e) / m, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = -u * e * 2 / m, i[15] = 0, i
}, mat4.perspective = function (r, t, a, n, e) {
	return r = a * Math.tan(r * Math.PI / 360), t *= r, mat4.frustum(-t, t, -r, r, a, n, e)
};

var sound = 1;
var font = [];
//font[0] = "111101101101111";
font[0] = "01110100011001110101110011000101110";
//font[1] = "010110010010111";
font[1] = "00100011000010000100001000010001110";

//font[2] = "111001111100111";
font[2] = "01110100010000100110010001000011111";
//font[3] = "111001111001111";
font[3] = "01110100010000100110000011000101110";
//font[4] = "101101111001001";
font[4] = "00010001100101010010111110001000010";
//font[5] = "111100111001111";
font[5] = "11111100001111000001000011000101110";
//font[6] = "111100111101111";
font[6] = "00110010001000011110100011000101110";
//font[7] = "111001010010010";
font[7] = "11111000010001000100010000100001000";
//font[8] = "111101111101111";
font[8] = "01110100011000101110100011000101110";
//font[9] = "111101111001111";
font[9] = "01110100011000101111000010001001100";
//font["A"] = "111101111101101";
font["A"] = "00100010101000110001111111000110001";

//font["B"] = "110101110101110";
font["B"] = "11110010010100101110010010100111110";
font["C"] = "01110100011000010000100001000101110";
font["D"] = "11110010010100101001010010100111110";
//font["E"] = "111100110100111";
font["E"] = "11111100001000011110100001000011111";
font["F"] = "11111100001000011110100001000010000";
//font["G"] = "111100101101111";
font["G"] = "01110100011000010011100011000101111";
font["H"] = "10001100011000111111100011000110001";
font["I"] = "01110001000010000100001000010001110";
font["J"] = "00111000100010000100001001001001100";
font["K"] = "10001100101010011000101001001010001";
font["L"] = "10000100001000010000100001000011111";
font["M"] = "10001110111010110101100011000110001";
font["N"] = "10001100011100110101100111000110001";
font["O"] = "01110100011000110001100011000101110";
font["P"] = "11110100011000111110100001000010000";
font["Q"] = "01110100011000110001101011001001101";
font["R"] = "11110100011000111110101001001010001";
//font["S"] = "111100111001111";
font["S"] = "01110100011000001110000011000101110";
//font["T"] = "111010010010010";
font["T"] = "11111001000010000100001000010000100";
font["U"] = "10001100011000110001100011000101110";
font["V"] = "10001100011000110001100010101000100";
font["W"] = "10001100011000110101101011010101010";
font["X"] = "10001100010101000100010101000110001";
font["Y"] = "10001100011000101010001000010000100";
font["Z"] = "11111000010001000100010001000011111";
font["-"] = "00000000000000011111000000000000000";
//font[":"] = "000010000010000";
font["."] = "00000000000000000000000000011000110";
font[","] = "00000000000000000000000110000100010";
//font["'"] = "001010000000000";
//font["?"] = "010101001010010";
//font["+"] = "000010111010000";
//font["="] = "000111000111000";
font["!"] = "00100001000010000100001000000000100";
font["("] = "00010001000100001000010000010000010";
font[")"] = "00100000100000100001000010001000100";

function drawText(ctx, posX, posY, text, scale) {
	var aa = ['#000', '#FFF'];
	scale /= 2;
	for (var j = 0; j < aa.length; j++) {
		ctx.fillStyle = aa[j];
		j != 0 && (posX -= 2);
		j != 0 && (posY -= 2);

		ctx.lineWidth = 0.5;
		ctx.strokeStyle = "#000";
		var pX = posX;
		var pY = posY;
		var decalY = 0;
		for (var i = 0; i < text.length; i++) {
			var index = 0;
			if (text[i] == "&") {
				pX = posX;
				pY += 2 * scale * 12;
				continue
			}
			for (y = 0; y < 7; y++) {
				for (x = 0; x < 5; x++) {
					if (waitingKeyStart) {
						decalY = Math.cos((frame + y + x + posY) / 32) * 5
					}
					if (text[i] == " ") {
						continue;
					}
					if (font[text[i]][index] != "0") {
						ctx.fillRect(pX + x * 2 * scale, pY + y * 2 * scale + decalY, 3 * scale, 3 * scale); //1.8 à la place de 3 pour des carrés
					}
					index++;
				}
			}
			pX += 12 * scale;
		}
	}
}

function getP (x, y, d) {
	x /= 2;
	y /= 2;
	return [
		-x, -y, d * 2,
		x, -y, d * 2,
		x, y, d * 2,
		-x, y, d * 2,
		-x, -y, 0,
		-x, y, 0,
		x, y, 0,
		x, -y, 0,
		-x, y, 0,
		-x, y, d * 2,
		x, y, d * 2,
		x, y, 0,
		-x, -y, 0,
		x, -y, 0,
		x, -y, d * 2,
		-x, -y, d * 2,
		x, -y, 0,
		x, y, 0,
		x, y, d * 2,
		x, -y, d * 2,
		-x, -y, 0,
		-x, -y, d * 2,
		-x, y, d * 2,
		-x, y, 0
	];
}

function getCube(d) {
	return getP(2, 2, d);
}

var UVW = {};
function getUVW(type, h) {
	if (UVW[type] && UVW[type][h]) {
		return UVW[type][h];
	} else if (!UVW[type]) {
		UVW[type] = [];
	}
	var data = [
		0, 0,
		1, 0,
		1, 1,
		0, 1,

		0, 1,
		0, 0,
		1, 0,
		1, 1,

		0, h,
		0, 0,
		1, 0,
		1, h,

		0, 0,
		1, 0,
		1, h,
		0, h,

		0, 0,
		1, 0,
		1, h,
		0, h,

		1, 0,
		1, h,
		0, h,
		0, 0,
	];
	UVW[type][h] = data;
	return data;
}
