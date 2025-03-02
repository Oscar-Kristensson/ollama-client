class AdvancedIterator {
    constructor (iteratable) {
        this.iteratable = iteratable;
        this.iterationCount = 0;
    };

    /**
     * Checks if a given string represents a numbered list item.
     * 
     * A numbered list item consists of numbers followed by optional decimal points.
     *
     * @param {Number} delta - The integer that has the offset
     * @returns {any} Returns the iterated element
     */

    getIteration(delta = 0) {
        const index = this.iterationCount + delta;
        let outOfRange = !this.checkIfInRange(this.iteratable.length, index);

        let element = undefined;    

        if (!outOfRange)
            element = this.iteratable[index];

        return {
            outOfRange: outOfRange,
            element: element,
            index: index
        };
    };

    forEach(callbackFunction = () => {} ) {
        for (this.iterationCount = 0; this.iterationCount < this.iteratable.length; this.iterationCount++) {
            callbackFunction();
        };
    };


    continue() {
        return this.moveIterator(1);
    };

    
    moveIterator(delta) {
        const index = this.iterationCount + delta;

        if (!this.checkIfInRange(this.iteratable.length, index))
            return false;

        this.iterationCount = index;
        return true;
    };
    
    
    checkIfInRange(length, index) { return (index < length) && !(index < 0); }
    getLength() { return this.iteratable.length; }
    getElementsLeft() { return this.iteratable.length - this.iterationCount - 1; }

}



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