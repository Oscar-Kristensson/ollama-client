


class Callbacks {
    constructor () {
        // Should use the following structure:
        // {event: [func1, func2]}
        this.callbacks = {};
    }

    addCallback(event, callback) {
        if (this.callbacks.hasOwnProperty(event))
            this.callbacks[event].push(callback);
        else
            this.callbacks[event] = [callback];
    }

    callCallbacks(event) {
        // Calls all the callbacks.
        if (!this.callbacks.hasOwnProperty(event)) return;

        this.callbacks[event].forEach(element => {
            element(this);
        });
    }


    test() { console.log("Hello World!"); }
    
}