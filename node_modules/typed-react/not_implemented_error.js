var NotImplementedError = (function () {
    function NotImplementedError(methodName) {
        this.name = "NotImplementedError";
        this.message = methodName + " should be implemented by React";
    }
    return NotImplementedError;
})();
module.exports = NotImplementedError;
