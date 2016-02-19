var ILLEGAL_KEYS = {
    constructor: true,
    refs: true,
    props: true,
    state: true,
    getDOMNode: true,
    setState: true,
    replaceState: true,
    forceUpdate: true,
    isMounted: true,
    setProps: true,
    replaceProps: true
};
function extractPrototype(clazz) {
    var proto = {};
    for (var key in clazz.prototype) {
        if (ILLEGAL_KEYS[key] === undefined) {
            proto[key] = clazz.prototype[key];
        }
    }
    return proto;
}
module.exports = extractPrototype;
