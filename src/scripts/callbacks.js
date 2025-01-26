


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
        this.callbacks[event].forEach(element => {
            element();
        });
    }
    
}