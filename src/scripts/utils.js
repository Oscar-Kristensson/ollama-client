

class _Utils {
    constructor () {

    };

    max(a, b) {
        if (a > b) return a;
        return b;
    };

    getLastElement(list) {
        return list[list.length - 1];
    };

}

const Utils = new _Utils();