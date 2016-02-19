var NotImplementedError = require("./not_implemented_error");
var Mixin = (function () {
    function Mixin() {
    }
    Mixin.prototype.getDOMNode = function () {
        throw new NotImplementedError("getDomNode");
    };
    Mixin.prototype.setState = function (nextState, callback) {
        throw new NotImplementedError("setState");
    };
    Mixin.prototype.replaceState = function (nextState, callback) {
        throw new NotImplementedError("replaceState");
    };
    Mixin.prototype.forceUpdate = function (callback) {
        throw new NotImplementedError("forceUpdate");
    };
    Mixin.prototype.isMounted = function () {
        throw new NotImplementedError("isMounted");
    };
    Mixin.prototype.setProps = function (nextProps, callback) {
        throw new NotImplementedError("setProps");
    };
    Mixin.prototype.replaceProps = function (nextProps, callback) {
        throw new NotImplementedError("replaceProps");
    };
    return Mixin;
})();
module.exports = Mixin;
