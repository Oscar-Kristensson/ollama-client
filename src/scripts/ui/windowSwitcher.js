/**
 * Switches witch container is visible at a once. There may only be a single 
 * container visible at once. This is done by adding the "hide" class to the 
 * containers which is controlled by the setCurrentState function.
 */
class WindowSwitcher {
    constructor (container, currentState = undefined) {
        this.container = container;
        this.currentState = currentState;
        this.setCurrentState(this.currentState);
    };

    /**
     * Sets the state of the appContainer, which then changes the apparence 
     * in the app.
     * 
     * @param {String} newState The class name of the current state  
     */
    setCurrentState(newState) {
        this.container.classList.remove(this.currentState);
        this.container.classList.add(newState)
        this.currentState = newState;
    };

    
};




const appContainer = document.querySelector(".appContainer");


/**
 * @type {WindowSwitcher}
 */
const mainWindowSwitcher = new WindowSwitcher(appContainer, "chat");