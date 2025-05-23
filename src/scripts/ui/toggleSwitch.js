

class ToggleSwitch extends Callbacks {
    constructor (container) {
        super();
        this.container = container;
        this.container.classList.add("toggleSwitch");
        this.marker = document.createElement("div");
        this.marker.className = "marker";
        this.container.appendChild(this.marker);
        this.checked = false;

        this.container.addEventListener("click", () => { this.toggle(); })
    };

    setState(checked, callCallbacks = true) {
        const previousState = this.checked;
        this.checked = checked;

        if (this.checked === previousState)
            return;        
        
        this.update(callCallbacks);
    };

    update(callCallbacks = true) {
        if (this.checked)
            this.container.classList.add("active");

        else
            this.container.classList.remove("active");

        if (callCallbacks) { 
            this.callCallbacks("changed");
        };

    }

    toggle() {
        this.checked = !this.checked;
        this.update();
    };
};