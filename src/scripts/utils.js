

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


    isNumber(str) {
        return /^\d/.test(str);
    };
    

}

const Utils = new _Utils();