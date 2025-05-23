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
        "onClick": () => { 
            if (!mainWindowSwitcher.getCurrentState("chat"))
                mainChatSelector.createNewConversation();

            mainWindowSwitcher.setCurrentState("chat"); 
        }
    },

    Translate: {
        "onClick": () => { console.log("Translate"); }
    },

    Task: {
        "onClick": () => { console.log("Task"); }
    },

    Settings: {
        "onClick": () => { mainWindowSwitcher.setCurrentState("settings"); }
    },
    
};


function generateNavBarButtons (parent, data) {
    let buttons = [];
    for (buttonName in data) {
        const button = new LeftNavBarButton(parent, "container", buttonName);
        buttons.push(button);
        if (data[buttonName].hasOwnProperty("onClick"))
            button.addCallback("click", data[buttonName].onClick);
    }
}

generateNavBarButtons(leftNavBarWindowsContainer, leftNavBarWindowButtons);