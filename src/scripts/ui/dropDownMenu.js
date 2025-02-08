


class CustomDropdown extends Callbacks {
    constructor (parent, options, values, CSS_Classes = [], parentIsContainer = false) {
        super();

        this.dropDownWidth = 0;
        this.CSS_Classes = CSS_Classes;
        this.parentIsContainer = parentIsContainer;

        this.optionsContainers = [];
        
        this.generateHTMLObjects(parent);

        this.setOptions(options, values);


    }

    generateHTMLObjects(parent) {
        if (this.parentIsContainer) {
            this.container = parent;
            this.container.classList.add("dropdownContainer");
        }
        else {
            this.container = document.createElement("div");
            parent.appendChild(this.container);
            this.container.className = "dropdownContainer";
        };
            
        
        this.button = document.createElement("div");
        this.button.className = "button";
        this.button.addEventListener("click", () => { this.toggleContainerVisibility();});
        this.container.appendChild(this.button);
        
        this.dropDownContainer = document.createElement("div");
        this.dropDownContainer.className = "dropdownElementsContainer";
        this.container.appendChild(this.dropDownContainer);

        this.CSS_Classes.forEach((CSS_Class) => {
            this.container.classList.add(CSS_Class);
        });

        

    };

    addOption(optionName) {
        let i = this.optionsContainers.length;

        const htmlElement = document.createElement("div");
        htmlElement.innerText = optionName;
        htmlElement.className = "dropdownElement";
        this.dropDownContainer.appendChild(htmlElement);
        this.optionsContainers.push(htmlElement);

        htmlElement.addEventListener("click", () => { this.uiSelectElement(i); });

        this.dropDownWidth = Utils.max(htmlElement.scrollWidth, this.dropDownWidth);
        console.log(htmlElement.scrollWidth)


    }

    removeAllOptions() {
        this.optionsContainers = [];
        
        while (this.dropDownContainer.length >= 0) this.dropDownContainer.children[0].remove();
    }

    setOptions(options, values) {
        this.selectedOption = 0;

        this.removeAllOptions();
        if (options == [] || values == []) return;


        this.options = options;
        this.values = values;
        this.button.innerText = this.options[this.selectedOption];

        this.options.forEach((element, i) => {
            this.addOption(element);
        });


        if (this.optionsContainers.length !== 0)
            this.optionsContainers[this.selectedOption].classList.add("selected");





    }

    toggleContainerVisibility() {
        this.container.classList.toggle("opened");
    };


    convertValueToID(value) { return this.values.indexOf(value); };

    uiSelectElement(id) {
        console.log(id);
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


    getValue() { return this.values[this.selectedOption]; };
};