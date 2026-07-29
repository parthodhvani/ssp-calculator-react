import { l as globalthis_default } from "./@tanstack/router-core+[...].mjs";
//#region node_modules/seroval/dist/esm/production/index.mjs
var L = ((i) => (i[i.AggregateError = 1] = "AggregateError", i[i.ArrowFunction = 2] = "ArrowFunction", i[i.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i[i.ObjectAssign = 8] = "ObjectAssign", i[i.BigIntTypedArray = 16] = "BigIntTypedArray", i[i.RegExp = 32] = "RegExp", i))(L || {});
var v = Symbol.asyncIterator;
var dr = Symbol.hasInstance;
var R = Symbol.isConcatSpreadable;
var C = Symbol.iterator;
var gr = Symbol.match;
var yr = Symbol.matchAll;
var Nr = Symbol.replace;
var br = Symbol.search;
var vr = Symbol.species;
var Cr = Symbol.split;
var Ar = Symbol.toPrimitive;
var P = Symbol.toStringTag;
var Er = Symbol.unscopables;
var Ce = {
	[v]: 0,
	[dr]: 1,
	[R]: 2,
	[C]: 3,
	[gr]: 4,
	[yr]: 5,
	[Nr]: 6,
	[br]: 7,
	[vr]: 8,
	[Cr]: 9,
	[Ar]: 10,
	[P]: 11,
	[Er]: 12
};
var ot = {
	0: v,
	1: dr,
	2: R,
	3: C,
	4: gr,
	5: yr,
	6: Nr,
	7: br,
	8: vr,
	9: Cr,
	10: Ar,
	11: P,
	12: Er
};
var o = void 0;
var st = {
	2: !0,
	3: !1,
	1: o,
	0: null,
	4: -0,
	5: Number.POSITIVE_INFINITY,
	6: Number.NEGATIVE_INFINITY,
	7: NaN
};
var Ae = {
	0: "Error",
	1: "EvalError",
	2: "RangeError",
	3: "ReferenceError",
	4: "SyntaxError",
	5: "TypeError",
	6: "URIError"
};
var it = {
	0: Error,
	1: EvalError,
	2: RangeError,
	3: ReferenceError,
	4: SyntaxError,
	5: TypeError,
	6: URIError
};
function c(e, r, t, n, a, s, i, u, l, g, S, d) {
	return {
		t: e,
		i: r,
		s: t,
		c: n,
		m: a,
		p: s,
		e: i,
		a: u,
		f: l,
		b: g,
		o: S,
		l: d
	};
}
function B(e) {
	return c(2, o, e, o, o, o, o, o, o, o, o, o);
}
var J = B(2);
var Z = B(3);
var Ee = B(1);
var Ie = B(0);
var ut = B(4);
var lt = B(5);
var ct = B(6);
var ft = B(7);
function dn(e) {
	switch (e) {
		case "\"": return "\\\"";
		case "\\": return "\\\\";
		case `
`: return "\\n";
		case "\r": return "\\r";
		case "\b": return "\\b";
		case "	": return "\\t";
		case "\f": return "\\f";
		case "<": return "\\x3C";
		case "\u2028": return "\\u2028";
		case "\u2029": return "\\u2029";
		default: return o;
	}
}
function y(e) {
	let r = "", t = 0, n;
	for (let a = 0, s = e.length; a < s; a++) n = dn(e[a]), n && (r += e.slice(t, a) + n, t = a + 1);
	return t === 0 ? r = e : r += e.slice(t), r;
}
function gn(e) {
	switch (e) {
		case "\\\\": return "\\";
		case "\\\"": return "\"";
		case "\\n": return `
`;
		case "\\r": return "\r";
		case "\\b": return "\b";
		case "\\t": return "	";
		case "\\f": return "\f";
		case "\\x3C": return "<";
		case "\\u2028": return "\u2028";
		case "\\u2029": return "\u2029";
		default: return e;
	}
}
function h(e) {
	return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, gn);
}
var U = "__SEROVAL_REFS__";
var Ir = /* @__PURE__ */ new Map();
var j = /* @__PURE__ */ new Map();
function Rr(e) {
	return Ir.has(e);
}
function bn(e) {
	return j.has(e);
}
function St(e) {
	if (Rr(e)) return Ir.get(e);
	throw new Pe(e);
}
function mt(e) {
	if (bn(e)) return j.get(e);
	throw new xe(e);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof window != "undefined" ? Object.defineProperty(window, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof self != "undefined" ? Object.defineProperty(self, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof globalthis_default != "undefined" && Object.defineProperty(globalthis_default, U, {
	value: j,
	configurable: !0,
	writable: !1,
	enumerable: !1
});
function Te(e) {
	return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function vn(e) {
	let r = Ae[Te(e)];
	return e.name !== r ? { name: e.name } : e.constructor.name !== r ? { name: e.constructor.name } : {};
}
function $(e, r) {
	let t = vn(e), n = Object.getOwnPropertyNames(e);
	for (let a = 0, s = n.length, i; a < s; a++) i = n[a], i !== "name" && i !== "message" && (i === "stack" ? r & 4 && (t = t || {}, t[i] = e[i]) : (t = t || {}, t[i] = e[i]));
	return t;
}
function Oe(e) {
	return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function we(e) {
	switch (e) {
		case Number.POSITIVE_INFINITY: return lt;
		case Number.NEGATIVE_INFINITY: return ct;
	}
	return e !== e ? ft : Object.is(e, -0) ? ut : c(0, o, e, o, o, o, o, o, o, o, o, o);
}
function X(e) {
	return c(1, o, y(e), o, o, o, o, o, o, o, o, o);
}
function he(e) {
	return c(3, o, "" + e, o, o, o, o, o, o, o, o, o);
}
function dt(e) {
	return c(4, e, o, o, o, o, o, o, o, o, o, o);
}
function ze(e, r) {
	let t = r.valueOf();
	return c(5, e, t !== t ? "" : r.toISOString(), o, o, o, o, o, o, o, o, o);
}
function _e(e, r) {
	return c(6, e, o, y(r.source), r.flags, o, o, o, o, o, o, o);
}
function gt(e, r) {
	return c(17, e, Ce[r], o, o, o, o, o, o, o, o, o);
}
function yt(e, r) {
	return c(18, e, y(St(r)), o, o, o, o, o, o, o, o, o);
}
function ce(e, r, t) {
	return c(25, e, t, y(r), o, o, o, o, o, o, o, o);
}
function ke(e, r, t) {
	return c(9, e, o, o, o, o, o, t, o, o, Oe(r), o);
}
function De(e, r) {
	return c(21, e, o, o, o, o, o, o, r, o, o, o);
}
function Fe(e, r, t) {
	return c(15, e, o, r.constructor.name, o, o, o, o, t, r.byteOffset, o, r.length);
}
function Be(e, r, t) {
	return c(16, e, o, r.constructor.name, o, o, o, o, t, r.byteOffset, o, r.length);
}
function Ve(e, r, t) {
	return c(20, e, o, o, o, o, o, o, t, r.byteOffset, o, r.byteLength);
}
function Me(e, r, t) {
	return c(13, e, Te(r), o, y(r.message), t, o, o, o, o, o, o);
}
function Le(e, r, t) {
	return c(14, e, Te(r), o, y(r.message), t, o, o, o, o, o, o);
}
function Ue(e, r) {
	return c(7, e, o, o, o, o, o, r, o, o, o, o);
}
function je(e, r) {
	return c(28, o, o, o, o, o, o, [e, r], o, o, o, o);
}
function Ye(e, r) {
	return c(30, o, o, o, o, o, o, [e, r], o, o, o, o);
}
function qe(e, r, t) {
	return c(31, e, o, o, o, o, o, t, r, o, o, o);
}
function We(e, r) {
	return c(32, e, o, o, o, o, o, o, r, o, o, o);
}
function Ke(e, r) {
	return c(33, e, o, o, o, o, o, o, r, o, o, o);
}
function Ge(e, r) {
	return c(34, e, o, o, o, o, o, o, r, o, o, o);
}
function He(e, r, t, n) {
	return c(35, e, t, o, o, o, o, r, o, o, o, n);
}
var { toString: bs } = Object.prototype;
var Cn = {
	parsing: 1,
	serialization: 2,
	deserialization: 3
};
function An(e) {
	return `Seroval Error (step: ${Cn[e]})`;
}
var En = (e, r) => An(e);
var fe = class extends Error {
	constructor(t, n) {
		super(En(t, n));
		this.cause = n;
	}
};
var _ = class extends fe {
	constructor(r) {
		super("parsing", r);
	}
};
var Je = class extends fe {
	constructor(r) {
		super("deserialization", r);
	}
};
function k(e) {
	return `Seroval Error (specific: ${e})`;
}
var x = class extends Error {
	constructor(t) {
		super(k(1));
		this.value = t;
	}
};
var z = class extends Error {
	constructor(r) {
		super(k(2));
	}
};
var Q = class extends Error {
	constructor(r) {
		super(k(3));
	}
};
var V = class extends Error {
	constructor(r) {
		super(k(4));
	}
};
var Pe = class extends Error {
	constructor(t) {
		super(k(5));
		this.value = t;
	}
};
var xe = class extends Error {
	constructor(r) {
		super(k(6));
	}
};
var Ze = class extends Error {
	constructor(r) {
		super(k(7));
	}
};
var O = class extends Error {
	constructor(r) {
		super(k(8));
	}
};
var M = class extends Error {
	constructor(r) {
		super(k(9));
	}
};
var Y = class {
	constructor(r, t) {
		this.value = r;
		this.replacement = t;
	}
};
var ee = () => {
	let e = {
		p: 0,
		s: 0,
		f: 0
	};
	return e.p = new Promise((r, t) => {
		e.s = r, e.f = t;
	}), e;
};
var In = (e, r) => {
	e.s(r), e.p.s = 1, e.p.v = r;
};
var Rn = (e, r) => {
	e.f(r), e.p.s = 2, e.p.v = r;
};
ee.toString();
In.toString();
Rn.toString();
var xr = () => {
	let e = [], r = [], t = !0, n = !1, a = 0, s = (l, g, S) => {
		for (S = 0; S < a; S++) r[S] && r[S][g](l);
	}, i = (l, g, S, d) => {
		for (g = 0, S = e.length; g < S; g++) d = e[g], !t && g === S - 1 ? l[n ? "return" : "throw"](d) : l.next(d);
	}, u = (l, g) => (t && (g = a++, r[g] = l), i(l), () => {
		t && (r[g] = r[a], r[a--] = void 0);
	});
	return {
		__SEROVAL_STREAM__: !0,
		on: (l) => u(l),
		next: (l) => {
			t && (e.push(l), s(l, "next"));
		},
		throw: (l) => {
			t && (e.push(l), s(l, "throw"), t = !1, n = !1, r.length = 0);
		},
		return: (l) => {
			t && (e.push(l), s(l, "return"), t = !1, n = !0, r.length = 0);
		}
	};
};
xr.toString();
var Tr = (e) => (r) => () => {
	let t = 0, n = {
		[e]: () => n,
		next: () => {
			if (t > r.d) return {
				done: !0,
				value: void 0
			};
			let a = t++, s = r.v[a];
			if (a === r.t) throw s;
			return {
				done: a === r.d,
				value: s
			};
		}
	};
	return n;
};
Tr.toString();
var Or = (e, r) => (t) => () => {
	let n = 0, a = -1, s = !1, i = [], u = [], l = (S = 0, d = u.length) => {
		for (; S < d; S++) u[S].s({
			done: !0,
			value: void 0
		});
	};
	t.on({
		next: (S) => {
			let d = u.shift();
			d && d.s({
				done: !1,
				value: S
			}), i.push(S);
		},
		throw: (S) => {
			let d = u.shift();
			d && d.f(S), l(), a = i.length, s = !0, i.push(S);
		},
		return: (S) => {
			let d = u.shift();
			d && d.s({
				done: !0,
				value: S
			}), l(), a = i.length, i.push(S);
		}
	});
	let g = {
		[e]: () => g,
		next: () => {
			if (a === -1) {
				let G = n++;
				if (G >= i.length) {
					let tt = r();
					return u.push(tt), tt.p;
				}
				return {
					done: !1,
					value: i[G]
				};
			}
			if (n > a) return {
				done: !0,
				value: void 0
			};
			let S = n++, d = i[S];
			if (S !== a) return {
				done: !1,
				value: d
			};
			if (s) throw d;
			return {
				done: !0,
				value: d
			};
		}
	};
	return g;
};
Or.toString();
var wr = (e) => {
	let r = atob(e), t = r.length, n = new Uint8Array(t);
	for (let a = 0; a < t; a++) n[a] = r.charCodeAt(a);
	return n.buffer;
};
wr.toString();
function $e(e) {
	return "__SEROVAL_SEQUENCE__" in e;
}
function hr(e, r, t) {
	return {
		__SEROVAL_SEQUENCE__: !0,
		v: e,
		t: r,
		d: t
	};
}
function Xe(e) {
	let r = [], t = -1, n = -1, a = e[C]();
	for (;;) try {
		let s = a.next();
		if (r.push(s.value), s.done) {
			n = r.length - 1;
			break;
		}
	} catch (s) {
		t = r.length, r.push(s);
	}
	return hr(r, t, n);
}
var Pn = Tr(C);
function Pt(e) {
	return Pn(e);
}
var xt = {};
var Tt = {};
var Ot = {
	0: {},
	1: {},
	2: {},
	3: {},
	4: {},
	5: {}
};
function Qe(e) {
	return "__SEROVAL_STREAM__" in e;
}
function re() {
	return xr();
}
function er(e) {
	let r = re(), t = e[v]();
	async function n() {
		try {
			let a = await t.next();
			a.done ? r.return(a.value) : (r.next(a.value), await n());
		} catch (a) {
			r.throw(a);
		}
	}
	return n().catch(() => {}), r;
}
var xn = Or(v, ee);
function ht(e) {
	return xn(e);
}
async function zr(e) {
	try {
		return [1, await e];
	} catch (r) {
		return [0, r];
	}
}
function me(e, r) {
	return {
		plugins: r.plugins,
		mode: e,
		marked: /* @__PURE__ */ new Set(),
		features: 63 ^ (r.disabledFeatures || 0),
		refs: r.refs || /* @__PURE__ */ new Map(),
		depthLimit: r.depthLimit || 1e3
	};
}
function pe(e, r) {
	e.marked.add(r);
}
function _r(e, r) {
	let t = e.refs.size;
	return e.refs.set(r, t), t;
}
function rr(e, r) {
	let t = e.refs.get(r);
	return t != null ? (pe(e, t), {
		type: 1,
		value: dt(t)
	}) : {
		type: 0,
		value: _r(e, r)
	};
}
function q(e, r) {
	let t = rr(e, r);
	return t.type === 1 ? t : Rr(r) ? {
		type: 2,
		value: yt(t.value, r)
	} : t;
}
function I(e, r) {
	let t = q(e, r);
	if (t.type !== 0) return t.value;
	if (r in Ce) return gt(t.value, r);
	throw new x(r);
}
function D(e, r) {
	let t = rr(e, Ot[r]);
	return t.type === 1 ? t.value : c(26, t.value, r, o, o, o, o, o, o, o, o, o);
}
function tr(e) {
	let r = rr(e, xt);
	return r.type === 1 ? r.value : c(27, r.value, o, o, o, o, o, o, I(e, C), o, o, o);
}
function nr(e) {
	let r = rr(e, Tt);
	return r.type === 1 ? r.value : c(29, r.value, o, o, o, o, o, [D(e, 1), I(e, v)], o, o, o, o);
}
function or(e, r, t, n) {
	return c(t ? 11 : 10, e, o, o, o, n, o, o, o, o, Oe(r), o);
}
function ar(e, r, t, n) {
	return c(8, r, o, o, o, o, {
		k: t,
		v: n
	}, o, D(e, 0), o, o, o);
}
function _t(e, r, t) {
	return c(22, r, t, o, o, o, o, o, D(e, 1), o, o, o);
}
function sr(e, r, t) {
	let n = new Uint8Array(t), a = "";
	for (let s = 0, i = n.length; s < i; s++) a += String.fromCharCode(n[s]);
	return c(19, r, y(btoa(a)), o, o, o, o, o, D(e, 5), o, o, o);
}
function te(e, r) {
	return {
		base: me(e, r),
		child: void 0
	};
}
var Dr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return N(this._p, this.depth, r);
	}
};
async function On(e, r, t) {
	let n = [];
	for (let a = 0, s = t.length; a < s; a++) a in t ? n[a] = await N(e, r, t[a]) : n[a] = 0;
	return n;
}
async function wn(e, r, t, n) {
	return ke(t, n, await On(e, r, n));
}
async function Fr(e, r, t) {
	let n = Object.entries(t), a = [], s = [];
	for (let i = 0, u = n.length; i < u; i++) a.push(y(n[i][0])), s.push(await N(e, r, n[i][1]));
	return C in t && (a.push(I(e.base, C)), s.push(je(tr(e.base), await N(e, r, Xe(t))))), v in t && (a.push(I(e.base, v)), s.push(Ye(nr(e.base), await N(e, r, er(t))))), P in t && (a.push(I(e.base, P)), s.push(X(t[P]))), R in t && (a.push(I(e.base, R)), s.push(t[R] ? J : Z)), {
		k: a,
		v: s
	};
}
async function kr(e, r, t, n, a) {
	return or(t, n, a, await Fr(e, r, n));
}
async function hn(e, r, t, n) {
	return De(t, await N(e, r, n.valueOf()));
}
async function zn(e, r, t, n) {
	return Fe(t, n, await N(e, r, n.buffer));
}
async function _n(e, r, t, n) {
	return Be(t, n, await N(e, r, n.buffer));
}
async function kn(e, r, t, n) {
	return Ve(t, n, await N(e, r, n.buffer));
}
async function kt(e, r, t, n) {
	let a = $(n, e.base.features);
	return Me(t, n, a ? await Fr(e, r, a) : o);
}
async function Dn(e, r, t, n) {
	let a = $(n, e.base.features);
	return Le(t, n, a ? await Fr(e, r, a) : o);
}
async function Fn(e, r, t, n) {
	let a = [], s = [];
	for (let [i, u] of n.entries()) a.push(await N(e, r, i)), s.push(await N(e, r, u));
	return ar(e.base, t, a, s);
}
async function Bn(e, r, t, n) {
	let a = [];
	for (let s of n.keys()) a.push(await N(e, r, s));
	return Ue(t, a);
}
async function Dt(e, r, t, n) {
	let a = e.base.plugins;
	if (a) for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.async && u.test(n)) return ce(t, u.tag, await u.parse.async(n, new Dr(e, r), { id: t }));
	}
	return o;
}
async function Vn(e, r, t, n) {
	let [a, s] = await zr(n);
	return c(12, t, a, o, o, o, o, o, await N(e, r, s), o, o, o);
}
function Mn(e, r, t, n, a) {
	let s = [], i = t.on({
		next: (u) => {
			pe(this.base, r), N(this, e, u).then((l) => {
				s.push(We(r, l));
			}, (l) => {
				a(l), i();
			});
		},
		throw: (u) => {
			pe(this.base, r), N(this, e, u).then((l) => {
				s.push(Ke(r, l)), n(s), i();
			}, (l) => {
				a(l), i();
			});
		},
		return: (u) => {
			pe(this.base, r), N(this, e, u).then((l) => {
				s.push(Ge(r, l)), n(s), i();
			}, (l) => {
				a(l), i();
			});
		}
	});
}
async function Ln(e, r, t, n) {
	return qe(t, D(e.base, 4), await new Promise(Mn.bind(e, r, t, n)));
}
async function Un(e, r, t, n) {
	let a = [];
	for (let s = 0, i = n.v.length; s < i; s++) a[s] = await N(e, r, n.v[s]);
	return He(t, a, n.t, n.d);
}
async function jn(e, r, t, n) {
	if (Array.isArray(n)) return wn(e, r, t, n);
	if (Qe(n)) return Ln(e, r, t, n);
	if ($e(n)) return Un(e, r, t, n);
	let a = n.constructor;
	if (a === Y) return N(e, r, n.replacement);
	let s = await Dt(e, r, t, n);
	if (s) return s;
	switch (a) {
		case Object: return kr(e, r, t, n, !1);
		case o: return kr(e, r, t, n, !0);
		case Date: return ze(t, n);
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return kt(e, r, t, n);
		case Number:
		case Boolean:
		case String:
		case BigInt: return hn(e, r, t, n);
		case ArrayBuffer: return sr(e.base, t, n);
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return zn(e, r, t, n);
		case DataView: return kn(e, r, t, n);
		case Map: return Fn(e, r, t, n);
		case Set: return Bn(e, r, t, n);
		default: break;
	}
	if (a === Promise || n instanceof Promise) return Vn(e, r, t, n);
	let i = e.base.features;
	if (i & 32 && a === RegExp) return _e(t, n);
	if (i & 16) switch (a) {
		case BigInt64Array:
		case BigUint64Array: return _n(e, r, t, n);
		default: break;
	}
	if (i & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n instanceof AggregateError)) return Dn(e, r, t, n);
	if (n instanceof Error) return kt(e, r, t, n);
	if (C in n || v in n) return kr(e, r, t, n, !!a);
	throw new x(n);
}
async function Yn(e, r, t) {
	let n = q(e.base, t);
	if (n.type !== 0) return n.value;
	let a = await Dt(e, r, n.value, t);
	if (a) return a;
	throw new x(t);
}
async function N(e, r, t) {
	if (r >= e.base.depthLimit) throw new M(e.base.depthLimit);
	switch (typeof t) {
		case "boolean": return t ? J : Z;
		case "undefined": return Ee;
		case "string": return X(t);
		case "number": return we(t);
		case "bigint": return he(t);
		case "object":
			if (t) {
				let n = q(e.base, t);
				return n.type === 0 ? await jn(e, r + 1, n.value, t) : n.value;
			}
			return Ie;
		case "symbol": return I(e.base, t);
		case "function": return Yn(e, r, t);
		default: throw new x(t);
	}
}
async function ne(e, r) {
	try {
		return await N(e, 0, r);
	} catch (t) {
		throw t instanceof _ ? t : new _(t);
	}
}
var oe = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(oe || {});
function Ft(e, r) {
	for (let t = 0, n = r.length; t < n; t++) {
		let a = r[t];
		e.has(a) || (e.add(a), a.extends && Ft(e, a.extends));
	}
}
function A(e) {
	if (e) {
		let r = /* @__PURE__ */ new Set();
		return Ft(r, e), [...r];
	}
}
function Bt(e) {
	switch (e) {
		case "Int8Array": return Int8Array;
		case "Int16Array": return Int16Array;
		case "Int32Array": return Int32Array;
		case "Uint8Array": return Uint8Array;
		case "Uint16Array": return Uint16Array;
		case "Uint32Array": return Uint32Array;
		case "Uint8ClampedArray": return Uint8ClampedArray;
		case "Float32Array": return Float32Array;
		case "Float64Array": return Float64Array;
		case "BigInt64Array": return BigInt64Array;
		case "BigUint64Array": return BigUint64Array;
		default: throw new Ze(e);
	}
}
function de(e) {
	switch (e) {
		case "constructor":
		case "__proto__":
		case "prototype":
		case "__defineGetter__":
		case "__defineSetter__":
		case "__lookupGetter__":
		case "__lookupSetter__": return !1;
		default: return !0;
	}
}
function Vt(e) {
	switch (e) {
		case v:
		case R:
		case P:
		case C: return !0;
		default: return !1;
	}
}
var qn = 1e6;
var Wn = 1e4;
var Kn = 2e4;
function Lt(e, r) {
	switch (r) {
		case 3: return Object.freeze(e);
		case 1: return Object.preventExtensions(e);
		case 2: return Object.seal(e);
		default: return e;
	}
}
var Gn = 1e3;
function Ut(e, r) {
	var n;
	let t = r.refs || /* @__PURE__ */ new Map();
	return "types" in t || Object.assign(t, { types: /* @__PURE__ */ new Map() }), {
		mode: e,
		plugins: r.plugins,
		refs: t,
		features: (n = r.features) != null ? n : 63 ^ (r.disabledFeatures || 0),
		depthLimit: r.depthLimit || Gn
	};
}
function jt(e) {
	return {
		mode: 1,
		base: Ut(1, e),
		child: o,
		state: { marked: new Set(e.markedRefs) }
	};
}
var Br = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	deserialize(r) {
		return p(this._p, this.depth, r);
	}
};
function qt(e, r) {
	if (r < 0 || !Number.isFinite(r) || !Number.isInteger(r)) throw new O({
		t: 4,
		i: r
	});
	if (e.refs.has(r)) throw new Error("Conflicted ref id: " + r);
}
function Hn(e, r, t) {
	return qt(e.base, r), e.state.marked.has(r) && e.base.refs.set(r, t), t;
}
function Jn(e, r, t) {
	return qt(e.base, r), e.base.refs.set(r, t), t;
}
function b(e, r, t) {
	return e.mode === 1 ? Hn(e, r, t) : Jn(e, r, t);
}
function Vr(e, r, t) {
	if (Object.hasOwn(r, t)) return r[t];
	throw new O(e);
}
function Zn(e, r) {
	return b(e, r.i, mt(h(r.s)));
}
function $n(e, r, t) {
	let n = t.a, a = n.length, s = b(e, t.i, new Array(a));
	for (let i = 0, u; i < a; i++) u = n[i], u && (s[i] = p(e, r, u));
	return Lt(s, t.o), s;
}
function Mt(e, r, t) {
	de(r) ? e[r] = t : Object.defineProperty(e, r, {
		value: t,
		configurable: !0,
		enumerable: !0,
		writable: !0
	});
}
function Xn(e, r, t, n, a) {
	if (typeof n == "string") Mt(t, h(n), p(e, r, a));
	else {
		let s = p(e, r, n);
		switch (typeof s) {
			case "string":
				Mt(t, s, p(e, r, a));
				break;
			case "symbol":
				Vt(s) && (t[s] = p(e, r, a));
				break;
			default: throw new O(n);
		}
	}
}
function Wt(e, r, t) {
	e.base.refs.types.set(r, t);
}
function ge(e, r, t, n) {
	if (e.base.refs.types.get(t) !== n) throw new O(r);
}
function Kt(e, r, t, n) {
	let a = t.k;
	if (a.length > 0) for (let i = 0, u = t.v, l = a.length; i < l; i++) Xn(e, r, n, a[i], u[i]);
	return n;
}
function Qn(e, r, t) {
	let n = b(e, t.i, t.t === 10 ? {} : Object.create(null));
	return Kt(e, r, t.p, n), Lt(n, t.o), n;
}
function eo(e, r) {
	return b(e, r.i, new Date(r.s));
}
function ro(e, r) {
	if (e.base.features & 32) {
		let t = h(r.c);
		if (t.length > Kn) throw new O(r);
		return b(e, r.i, new RegExp(t, r.m));
	}
	throw new z(r);
}
function to(e, r, t) {
	let n = b(e, t.i, /* @__PURE__ */ new Set());
	for (let a = 0, s = t.a, i = s.length; a < i; a++) n.add(p(e, r, s[a]));
	return n;
}
function no(e, r, t) {
	let n = b(e, t.i, /* @__PURE__ */ new Map());
	for (let a = 0, s = t.e.k, i = t.e.v, u = s.length; a < u; a++) n.set(p(e, r, s[a]), p(e, r, i[a]));
	return n;
}
function oo(e, r) {
	if (r.s.length > qn) throw new O(r);
	return b(e, r.i, wr(h(r.s)));
}
function ao(e, r, t) {
	var u;
	let n = Bt(t.c), a = p(e, r, t.f), s = (u = t.b) != null ? u : 0;
	if (s < 0 || s > a.byteLength) throw new O(t);
	return b(e, t.i, new n(a, s, t.l));
}
function so(e, r, t) {
	var i;
	let n = p(e, r, t.f), a = (i = t.b) != null ? i : 0;
	if (a < 0 || a > n.byteLength) throw new O(t);
	return b(e, t.i, new DataView(n, a, t.l));
}
function Gt(e, r, t, n) {
	if (t.p) {
		let a = Kt(e, r, t.p, {});
		Object.defineProperties(n, Object.getOwnPropertyDescriptors(a));
	}
	return n;
}
function io(e, r, t) {
	return Gt(e, r, t, b(e, t.i, new AggregateError([], h(t.m))));
}
function uo(e, r, t) {
	let n = Vr(t, it, t.s);
	return Gt(e, r, t, b(e, t.i, new n(h(t.m))));
}
function lo(e, r, t) {
	let n = ee(), a = b(e, t.i, n.p), s = p(e, r, t.f);
	return t.s ? n.s(s) : n.f(s), a;
}
function co(e, r, t) {
	return b(e, t.i, Object(p(e, r, t.f)));
}
function fo(e, r, t) {
	let n = e.base.plugins;
	if (n) {
		let a = h(t.c);
		for (let s = 0, i = n.length; s < i; s++) {
			let u = n[s];
			if (u.tag === a) return b(e, t.i, u.deserialize(t.s, new Br(e, r), { id: t.i }));
		}
	}
	throw new Q(t.c);
}
function So(e, r) {
	let t = b(e, r.i, b(e, r.s, ee()).p);
	return Wt(e, r.s, 22), t;
}
function mo(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n) return ge(e, t, t.i, 22), n.s(p(e, r, t.a[1])), o;
	throw new V("Promise");
}
function po(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n) return ge(e, t, t.i, 22), n.f(p(e, r, t.a[1])), o;
	throw new V("Promise");
}
function go(e, r, t) {
	p(e, r, t.a[0]);
	return Pt(p(e, r, t.a[1]));
}
function yo(e, r, t) {
	p(e, r, t.a[0]);
	return ht(p(e, r, t.a[1]));
}
function No(e, r, t) {
	let n = b(e, t.i, re());
	Wt(e, t.i, 31);
	let a = t.a, s = a.length;
	if (s) for (let i = 0; i < s; i++) p(e, r, a[i]);
	return n;
}
function bo(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n) return ge(e, t, t.i, 31), n.next(p(e, r, t.f)), o;
	throw new V("Stream");
}
function vo(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n) return ge(e, t, t.i, 31), n.throw(p(e, r, t.f)), o;
	throw new V("Stream");
}
function Co(e, r, t) {
	let n = e.base.refs.get(t.i);
	if (n) return ge(e, t, t.i, 31), n.return(p(e, r, t.f)), o;
	throw new V("Stream");
}
function Ao(e, r, t) {
	return p(e, r, t.f), o;
}
function Eo(e, r, t) {
	return p(e, r, t.a[1]), o;
}
function Io(e, r, t) {
	let n = b(e, t.i, hr([], t.s, t.l));
	for (let a = 0, s = t.a.length; a < s; a++) n.v[a] = p(e, r, t.a[a]);
	return n;
}
function p(e, r, t) {
	if (r > e.base.depthLimit) throw new M(e.base.depthLimit);
	switch (r += 1, t.t) {
		case 2: return Vr(t, st, t.s);
		case 0: return Number(t.s);
		case 1: return h(String(t.s));
		case 3:
			if (String(t.s).length > Wn) throw new O(t);
			return BigInt(t.s);
		case 4: return e.base.refs.get(t.i);
		case 18: return Zn(e, t);
		case 9: return $n(e, r, t);
		case 10:
		case 11: return Qn(e, r, t);
		case 5: return eo(e, t);
		case 6: return ro(e, t);
		case 7: return to(e, r, t);
		case 8: return no(e, r, t);
		case 19: return oo(e, t);
		case 16:
		case 15: return ao(e, r, t);
		case 20: return so(e, r, t);
		case 14: return io(e, r, t);
		case 13: return uo(e, r, t);
		case 12: return lo(e, r, t);
		case 17: return Vr(t, ot, t.s);
		case 21: return co(e, r, t);
		case 25: return fo(e, r, t);
		case 22: return So(e, t);
		case 23: return mo(e, r, t);
		case 24: return po(e, r, t);
		case 28: return go(e, r, t);
		case 30: return yo(e, r, t);
		case 31: return No(e, r, t);
		case 32: return bo(e, r, t);
		case 33: return vo(e, r, t);
		case 34: return Co(e, r, t);
		case 27: return Ao(e, r, t);
		case 29: return Eo(e, r, t);
		case 35: return Io(e, r, t);
		default: throw new z(t);
	}
}
function ir(e, r) {
	try {
		return p(e, 0, r);
	} catch (t) {
		throw new Je(t);
	}
}
var Ro = () => T;
var Po = Ro.toString();
/=>/.test(Po);
var Hr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return E(this._p, this.depth, r);
	}
};
var Jr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return E(this._p, this.depth, r);
	}
	parseWithError(r) {
		return K(this._p, this.depth, r);
	}
	isAlive() {
		return this._p.state.alive;
	}
	pushPendingState() {
		et(this._p);
	}
	popPendingState() {
		ve(this._p);
	}
	onParse(r) {
		se(this._p, r);
	}
	onError(r) {
		Xr(this._p, r);
	}
	addCleanup(r) {
		this._p.state.cleanups.push(r);
	}
};
function va(e) {
	return {
		alive: !0,
		pending: 0,
		initial: !0,
		buffer: [],
		onParse: e.onParse,
		onError: e.onError,
		onDone: e.onDone,
		cleanups: []
	};
}
function Zr(e) {
	return {
		type: 2,
		base: me(2, e),
		state: va(e)
	};
}
function Ca(e, r, t) {
	let n = [];
	for (let a = 0, s = t.length; a < s; a++) a in t ? n[a] = E(e, r, t[a]) : n[a] = 0;
	return n;
}
function Aa(e, r, t, n) {
	return ke(t, n, Ca(e, r, n));
}
function $r(e, r, t) {
	let n = Object.entries(t), a = [], s = [];
	for (let i = 0, u = n.length; i < u; i++) a.push(y(n[i][0])), s.push(E(e, r, n[i][1]));
	return C in t && (a.push(I(e.base, C)), s.push(je(tr(e.base), E(e, r, Xe(t))))), v in t && (a.push(I(e.base, v)), s.push(Ye(nr(e.base), E(e, r, e.type === 1 ? re() : er(t))))), P in t && (a.push(I(e.base, P)), s.push(X(t[P]))), R in t && (a.push(I(e.base, R)), s.push(t[R] ? J : Z)), {
		k: a,
		v: s
	};
}
function Gr(e, r, t, n, a) {
	return or(t, n, a, $r(e, r, n));
}
function Ea(e, r, t, n) {
	return De(t, E(e, r, n.valueOf()));
}
function Ia(e, r, t, n) {
	return Fe(t, n, E(e, r, n.buffer));
}
function Ra(e, r, t, n) {
	return Be(t, n, E(e, r, n.buffer));
}
function Pa(e, r, t, n) {
	return Ve(t, n, E(e, r, n.buffer));
}
function fn(e, r, t, n) {
	let a = $(n, e.base.features);
	return Me(t, n, a ? $r(e, r, a) : o);
}
function xa(e, r, t, n) {
	let a = $(n, e.base.features);
	return Le(t, n, a ? $r(e, r, a) : o);
}
function Ta(e, r, t, n) {
	let a = [], s = [];
	for (let [i, u] of n.entries()) a.push(E(e, r, i)), s.push(E(e, r, u));
	return ar(e.base, t, a, s);
}
function Oa(e, r, t, n) {
	let a = [];
	for (let s of n.keys()) a.push(E(e, r, s));
	return Ue(t, a);
}
function wa(e, r, t, n) {
	let a = qe(t, D(e.base, 4), []);
	return e.type === 1 || (et(e), n.on({
		next: (s) => {
			if (e.state.alive) {
				let i = K(e, r, s);
				i && se(e, We(t, i));
			}
		},
		throw: (s) => {
			if (e.state.alive) {
				let i = K(e, r, s);
				i && se(e, Ke(t, i));
			}
			ve(e);
		},
		return: (s) => {
			if (e.state.alive) {
				let i = K(e, r, s);
				i && se(e, Ge(t, i));
			}
			ve(e);
		}
	})), a;
}
function ha(e, r, t) {
	if (this.state.alive) {
		let n = K(this, r, t);
		n && se(this, c(23, e, o, o, o, o, o, [D(this.base, 2), n], o, o, o, o)), ve(this);
	}
}
function za(e, r, t) {
	if (this.state.alive) {
		let n = K(this, r, t);
		n && se(this, c(24, e, o, o, o, o, o, [D(this.base, 3), n], o, o, o, o));
	}
	ve(this);
}
function _a(e, r, t, n) {
	let a = _r(e.base, {});
	return e.type === 2 && (et(e), n.then(ha.bind(e, a, r), za.bind(e, a, r))), _t(e.base, t, a);
}
function ka(e, r, t, n, a) {
	for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.sync && u.test(n)) return ce(t, u.tag, u.parse.sync(n, new Hr(e, r), { id: t }));
	}
	return o;
}
function Da(e, r, t, n, a) {
	for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.stream && u.test(n)) return ce(t, u.tag, u.parse.stream(n, new Jr(e, r), { id: t }));
	}
	return o;
}
function Sn(e, r, t, n) {
	let a = e.base.plugins;
	return a ? e.type === 1 ? ka(e, r, t, n, a) : Da(e, r, t, n, a) : o;
}
function Fa(e, r, t, n) {
	let a = [];
	for (let s = 0, i = n.v.length; s < i; s++) a[s] = E(e, r, n.v[s]);
	return He(t, a, n.t, n.d);
}
function Ba(e, r, t, n, a) {
	switch (a) {
		case Object: return Gr(e, r, t, n, !1);
		case o: return Gr(e, r, t, n, !0);
		case Date: return ze(t, n);
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return fn(e, r, t, n);
		case Number:
		case Boolean:
		case String:
		case BigInt: return Ea(e, r, t, n);
		case ArrayBuffer: return sr(e.base, t, n);
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return Ia(e, r, t, n);
		case DataView: return Pa(e, r, t, n);
		case Map: return Ta(e, r, t, n);
		case Set: return Oa(e, r, t, n);
		default: break;
	}
	if (a === Promise || n instanceof Promise) return _a(e, r, t, n);
	let s = e.base.features;
	if (s & 32 && a === RegExp) return _e(t, n);
	if (s & 16) switch (a) {
		case BigInt64Array:
		case BigUint64Array: return Ra(e, r, t, n);
		default: break;
	}
	if (s & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n instanceof AggregateError)) return xa(e, r, t, n);
	if (n instanceof Error) return fn(e, r, t, n);
	if (C in n || v in n) return Gr(e, r, t, n, !!a);
	throw new x(n);
}
function Va(e, r, t, n) {
	if (Array.isArray(n)) return Aa(e, r, t, n);
	if (Qe(n)) return wa(e, r, t, n);
	if ($e(n)) return Fa(e, r, t, n);
	let a = n.constructor;
	if (a === Y) return E(e, r, n.replacement);
	return Sn(e, r, t, n) || Ba(e, r, t, n, a);
}
function Ma(e, r, t) {
	let n = q(e.base, t);
	if (n.type !== 0) return n.value;
	let a = Sn(e, r, n.value, t);
	if (a) return a;
	throw new x(t);
}
function E(e, r, t) {
	if (r >= e.base.depthLimit) throw new M(e.base.depthLimit);
	switch (typeof t) {
		case "boolean": return t ? J : Z;
		case "undefined": return Ee;
		case "string": return X(t);
		case "number": return we(t);
		case "bigint": return he(t);
		case "object":
			if (t) {
				let n = q(e.base, t);
				return n.type === 0 ? Va(e, r + 1, n.value, t) : n.value;
			}
			return Ie;
		case "symbol": return I(e.base, t);
		case "function": return Ma(e, r, t);
		default: throw new x(t);
	}
}
function se(e, r) {
	e.state.initial ? e.state.buffer.push(r) : Qr(e, r, !1);
}
function Xr(e, r) {
	if (e.state.onError) e.state.onError(r);
	else throw r instanceof _ ? r : new _(r);
}
function mn(e) {
	e.state.onDone && e.state.onDone();
	for (let r = 0, t = e.state.cleanups.length; r < t; r++) e.state.cleanups[r]();
}
function Qr(e, r, t) {
	try {
		e.state.onParse(r, t);
	} catch (n) {
		Xr(e, n);
	}
}
function et(e) {
	e.state.pending++;
}
function ve(e) {
	--e.state.pending <= 0 && mn(e);
}
function K(e, r, t) {
	try {
		return E(e, r, t);
	} catch (n) {
		return Xr(e, n), o;
	}
}
function rt(e, r) {
	let t = K(e, 0, r);
	t && (Qr(e, t, !0), e.state.initial = !1, La(e, e.state), e.state.pending <= 0 && mr(e));
}
function La(e, r) {
	for (let t = 0, n = r.buffer.length; t < n; t++) Qr(e, r.buffer[t], !1);
}
function mr(e) {
	e.state.alive && (mn(e), e.state.alive = !1);
}
async function lu(e, r = {}) {
	return await ne(te(2, {
		plugins: A(r.plugins),
		disabledFeatures: r.disabledFeatures,
		refs: r.refs
	}), e);
}
function cu(e, r) {
	let n = Zr({
		plugins: A(r.plugins),
		refs: r.refs,
		disabledFeatures: r.disabledFeatures,
		depthLimit: r.depthLimit,
		onParse: r.onParse,
		onError: r.onError,
		onDone: r.onDone
	});
	return rt(n, e), mr.bind(null, n);
}
function Ou(e, r = {}) {
	var i;
	let t = A(r.plugins), n = r.disabledFeatures || 0, a = (i = e.f) != null ? i : 63;
	return ir(jt({
		plugins: t,
		markedRefs: e.m,
		features: a & ~n,
		disabledFeatures: n
	}), e.t);
}
//#endregion
export { cu as n, lu as r, Ou as t };
