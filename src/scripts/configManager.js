// Load config file
let config = {};


function checkAndFillOptions(element, key, defaultValue) {
    if (!element.hasOwnProperty(key)) {
        element[key] = defaultValue;
        return true;
    };
    return false;
};

function validateConfig(config) {
    if (config === undefined) config = {};


    const defaultValues = [
        ["ipAddress", "http://127.0.0.1:11434/"], 
        ["favoriteModel", "?"],
        ["autoLaunchOllama", false],
        ["allowAutoRelaunch", false]
    ]

    let hasChanged = false;

    for (let i = 0; i < defaultValues.length; i++) {
        const rv = checkAndFillOptions(config, defaultValues[i][0], defaultValues[i][1]);
        if (rv) hasChanged = true;
    };

    if (hasChanged) saveConfigFile();
};

function loadConfigFile() {
    if (!window.electronAPI) {
        validateConfig(config);
        return Promise.resolve();
    };

    return window.electronAPI.loadFile("save/config.json")
        .then(text => {
            config = JSON.parse(text);
            validateConfig(config);

    })
    .catch(error => {
        config = {};
        validateConfig(config);
    })
};

document.addEventListener("DOMContentLoaded", () => {
    loadConfigFile()
        .then(() => {
            Ollama.configure(config.ipAddress);

            // Starts Ollama automatically
            if (config.autoLaunchOllama)
                Ollama.sendStart();
        })
        .then(() => {
            // Checks if the Ollama API is accessible
            return Ollama.ping();
        })

        .then(result => {
            if (!result) {
                // Restarts the Ollama server
                let couldNotStart = false;
                console.warn("Could not reach Ollama, trying by restarting Ollama");

                if (config.allowAutoRelaunch) {
                    console.log("Sending start");
                    Ollama.sendStart();
                    console.log("Pining Ollama");
                    Ollama.ping()
                    .then(result => {
                        console.log("Pinged Ollama")
                        if (!result) {
                            couldNotStart = true;
                            console.error("Could not start Ollama")
                        } else {
                            Ollama.initalize();
                        }
                    })
                    .catch(error => {
                        console.error("Could not reach Ollama. Error: " + error.message);
                    });
                    if (couldNotStart)
                        return;

                } else {
                    return;
                }
            } else {
                Ollama.initalize();
            };
        })
        .catch(error => {
            console.log("An error occured: ", error.message);
        })
})

function saveConfigFile() {
    if (!window.electronAPI) {
        return Promise.resolve();
    };

    return window.electronAPI.writeFile("save/config.json", JSON.stringify(config, null, 4));
};