var extractPrototype = require("./extract_prototype");
function createMixin(clazz) {
    return extractPrototype(clazz);
}
module.exports = createMixin;
