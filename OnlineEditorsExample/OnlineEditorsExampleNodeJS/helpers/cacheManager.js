var cache = {};

exports.put = function (key, value) {
    cache[key] = value;
}

exports.containsKey = function (key) {
    return typeof cache[key] != "undefined";
}

exports.get = function (key) {
    return cache[key];
}

exports.delete = function (key) {
    delete cache[key];
}

exports.clear = function () {
    cache = {};
}