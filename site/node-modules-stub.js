window.require = (name) => {
	const key = name.replace(/\/|\.?\.\//g, "");
	return window[key];
}
window.module = {
	set exports(fn) {
		window[fn.name] = fn
	}
};
