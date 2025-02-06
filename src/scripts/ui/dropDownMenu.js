


class CustomDropdown extends Callbacks {
    constructor (parent, options, values) {
        super();

        this.options = options;
        this.values = values;
        this.dropDownWidth = 0;

        this.optionsContainers = [];
        
        this.selectedOption = 0;

        this.generateHTMLObjects(parent);
    }

    generateHTMLObjects(parent) {
        this.container = document.createElement("div");
        this.container.className = "dropdownContainer";
        parent.appendChild(this.container);
        
        this.button = document.createElement("div");
        this.button.className = "button";
        this.button.innerText = this.options[this.selectedOption];
        this.button.addEventListener("click", () => { this.toggleContainerVisibility();});
        this.container.appendChild(this.button);
        
        this.dropDownContainer = document.createElement("div");
        this.dropDownContainer.className = "dropdownElementsContainer";
        this.container.appendChild(this.dropDownContainer);


        this.options.forEach((element, i) => {
            const htmlElement = document.createElement("div");
            htmlElement.innerText = element;
            htmlElement.className = "dropdownElement";
            this.dropDownContainer.appendChild(htmlElement);
            this.optionsContainers.push(htmlElement);

            htmlElement.addEventListener("click", () => { this.uiSelectElement(i);});

            this.dropDownWidth = Utils.max(htmlElement.scrollWidth, this.dropDownWidth);
            console.log(htmlElement.scrollWidth)
        });

        this.optionsContainers[this.selectedOption].classList.add("selected");



        

    };

    addOption() {
        console.error("TBD");
        
    }

    setOptions() {
        console.error("TBD");

    }

    toggleContainerVisibility() {
        this.container.classList.toggle("opened");
    };


    convertValueToID(value) { return this.values.indexOf(value); };

    uiSelectElement(id) {
        this.selectElement(id);
        this.container.classList.remove("opened");

    };

    selectElement(id) {
        if (id === this.selectedOption) return;
        this.optionsContainers[this.selectedOption].classList.remove("selected");
        
        this.selectedOption = id;
        this.optionsContainers[this.selectedOption].classList.add("selected");
        this.button.innerText = this.options[this.selectedOption];

        this.callCallbacks("changed");

    };
};