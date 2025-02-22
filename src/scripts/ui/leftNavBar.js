const leftNavBar = document.querySelector(".left-nav-bar");
const leftNavBarWindowsContainer = document.querySelector(".left-nav-bar .windowsContainer")


class LeftNavBarButton extends Callbacks {
    constructor (parent, className, text) {
        super();
        this.container = document.createElement("div");
        this.container.className = className;
        this.container.innerText = text;
        parent.appendChild(this.container);
        this.container.addEventListener("click", () => { this.callCallbacks("click"); })
    };
};


const leftNavBarWindowButtons = {
    Chat: {
        "onClick": () => { console.log("Chat"); }
    },

    Translate: {
        "onClick": () => { console.log("Translate"); }
    },

    Task: {
        "onClick": () => { console.log("Task"); }
    },

    Settings: {
        "onClick": () => { console.log("Settings"); }
    },
    
};


function generateNavBarButtons (parent, data) {
    let buttons = [];
    for (buttonName in data) {
        const button = new LeftNavBarButton(parent, "label", buttonName);
        buttons.push(button);
        if (data[buttonName].hasOwnProperty("onClick"))
            button.addCallback("click", data[buttonName].onClick);
    }
}

generateNavBarButtons(leftNavBarWindowsContainer, leftNavBarWindowButtons);