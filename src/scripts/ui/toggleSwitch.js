

class ToggleSwitch {
    constructor (container) {
        console.log("TESS!")
        this.container = container;
        this.container.classList.add("toggleSwitch");
        this.marker = document.createElement("div");
        this.marker.className = "marker";
        this.container.appendChild(this.marker);
        this.checked = false;

        this.container.addEventListener("click", () => { this.toggle(); })
    };

    toggle() {
        this.checked = !this.checked;
        if (this.checked)
            this.container.classList.add("active");

        else
            this.container.classList.remove("active");
    };
};