const settingsContainer = document.getElementById("settingsPanel");
const downloadsContainer = settingsContainer.querySelector(".downloadContainer");
/**
 * Constructs the LLM Download UI components and manages the start of the downloading process. 
 * 
 * The HTML is structured in to taskContainers, which each is displaying a downloading process. 
 */
class DownloadsManager {
    /**
     * Constructs the LLM Download UI component.
     *
     * @param {HTMLElement} container The container element where the UI will be appended.
     * @returns {void}  This function does not return a value. It initializes the UI component.
     */
    constructor (container) {
        this.container = container;

        this.heading = document.createElement("h2");
        this.heading.innerText = "Download a LLM";

        this.informationElement = document.createElement("div");
        this.informationElement.innerHTML = `Inoder to use the Ollama Client, you need to download a LLM. A list of LLM:s can be found on Ollamas website. Enter the model name, for example 'gemma3:1b' and press enter to install.`
        this.informationElement.classList = "informationElement";

        this.viewModelsButton = document.createElement("button");
        this.viewModelsButton.classList = "viewModels";
        this.viewModelsButton.textContent = "View models";
        this.viewModelsButton.addEventListener("click", () => {
            window.electronAPI.openLink("https://www.ollama.com/library/");
        });
        
        this.modelInputElement = document.createElement("input");
        this.modelInputElement.className = "modelInputElement";
        this.modelInputElement.placeholder = "Input model name here..."
        this.modelInputElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter") this.onEnterKeyPressed();
        });
        
        this.container.appendChild(this.heading);
        this.container.appendChild(this.informationElement);
        this.container.appendChild(this.viewModelsButton);
        this.container.appendChild(this.modelInputElement);

        this.isDownloading = false;



        this.currentTaskContainer = undefined;
        this.currentPullElement = undefined;
        this.currentDataProgressElement = undefined;
        this.currentPercentElement = undefined;
        //this.createTaskContainer();


    };


    /**
     * Creates a new task container element and appends it to the download process container.
     * This function initializes the structure for a single task within the download process.
     * Each downloading process has it's own container that shows the progress of file downloads etc 
     * 
     * @returns {void}  This function does not return a value. It modifies the `this` object's properties.
     */
    createTaskContainer() {
        const taskContainer = document.createElement("div");
        taskContainer.className = "taskContainer";
        this.currentTaskNumber++;

        this.currentDownloadProcessContainer.appendChild(taskContainer);
        this.currentTaskContainer = taskContainer;

        this.currentProgressElement = document.createElement("div");
        this.currentProgressElement.className = "progressElement";
        this.currentProgressElement.innerText = `Step ${this.currentTaskNumber}:`;
        
        this.currentPullElement = document.createElement("div");
        this.currentPullElement.className = "pullElement";
        
        this.currentDataProgressElement = document.createElement("div");
        this.currentDataProgressElement.className = "dataProgressElement";

        this.currentPercentElement = document.createElement("div");
        this.currentPercentElement.className = "percentElement";

        taskContainer.appendChild(this.currentProgressElement);
        taskContainer.appendChild(this.currentPullElement);
        taskContainer.appendChild(this.currentDataProgressElement);        
        taskContainer.appendChild(this.currentPercentElement);
    };

    /**
     * Updates the download progress based on the latest download status by 
     * changing the text in the HTML objects. 
     * @param {string} latest The latest download status (e.g., "newPull", "success").
     * @param {string} currentPull The current pull status.
     * @param {number} completedData The amount of data completed.
     * @param {number} totalData The total amount of data to download.
     */
    updateDownloadProgress(latest, currentPull, completedData, totalData) {
        let prefix;
        let prefixValue = 9;

        if (totalData > 10**9) {
            prefix = "G";
            prefixValue = 9;
        } else {
            prefix = "M";
            prefixValue = 6;
        };

        const completedDataString = Utils.formatNumber(completedData, prefixValue);
        const totalDataString = Utils.formatNumber(totalData, prefixValue);



        if (latest === "newPull") {
            this.createTaskContainer();
            this.currentPullElement.innerText = currentPull;
        }

        else if (latest === "success") {
        } else {    
            this.currentDataProgressElement.innerText = `${completedDataString}/${totalDataString} ${prefix}B`;
            this.currentPercentElement.innerText = `${Math.ceil(completedData/totalData*100)}%`;
        };
    };

    finishedDownload() {
        this.currentPullElement.innerText = "Success!";
        this.createTaskContainer();
        this.currentPullElement.innerText = "Finished downloading (restart the program to use the model)";

        this.isDownloading = false;
        this.modelInputElement.value = "";

    };

    createNewDownloadProcess(modelName) {
        this.currentTaskNumber = 0;
        this.currentDownloadProcessContainer = document.createElement("div");
        this.currentDownloadProcessContainer.className = "currentDownloadProcessContainer";
        this.container.appendChild(this.currentDownloadProcessContainer);

        this.modelNameElement = document.createElement("div");
        this.modelNameElement.className = "modelNameElement";
        this.modelNameElement.innerText = modelName;
        this.currentDownloadProcessContainer.appendChild(this.modelNameElement);
    }

    /**
     * Handles the event when the "Enter" key is pressed in the model input field.
     *
     * This function triggers the download of the model specified in the input field
     * if the user confirms the download.
     */
    onEnterKeyPressed() {
        if (!confirm(`Do you want to download the following model: ${this.modelInputElement.value}`))
            return;

        this.downloadModel(this.modelInputElement.value);
    };

     /**
     * Initiates the download of a specified Ollama model.
     *
     * This function downloads a local Ollama model using the Ollama API.
     * It handles error conditions such as already downloaded models or invalid
     * input.
     *
     * @param {string} [modelName = "gemma3:1b"] - The name of the model to download.
     *                                             Defaults to "gemma3:1b".
     */
    downloadModel(modelName = "gemma3:1b") {
        if (this.isDownloading) return;

        if (modelName === "") {
            console.error("To download a model a model name must be entered");
            return;
        };

        console.log(Ollama.getLocalModels());

        if (Ollama.getLocalModels().some(model => model.name === modelName)) {
            console.error("This model is already downloaded!");
            alert("This model is already downloaded!");
            return;
        };


        this.isDownloading = true;
        this.createNewDownloadProcess(modelName);
        Ollama.installModel(modelName, 
            (latest, currentPull, completedData, totalData) => { this.updateDownloadProgress(latest, currentPull, completedData, totalData)},
            () => { this.finishedDownload(); }
        );
    };
};

/**
 * @type {DownloadsManager}
 */
const downloadsManager = new DownloadsManager(downloadsContainer);


/**
 * Displays information about installed Ollama local models in a table.
 *
 * This class creates a table to display details about the locally installed
 * Ollama models. It retrieves the models from Ollama and populates the table
 * with their name, size, modified date, quantization level, parameter size,
 * and digest.
 *
 * @class InstalledModelsInformationDisplay
 */
class InstalledModelsInformationDisplay {
    constructor(container) {
        this.table = container;
    };


    /**
     * Draws a table cell with the given text content into the specified container element.
     *
     * @param {HTMLElement} container - The HTML element where the table data will be inserted.  Must be an element with a `id` attribute.
     * @param {string} text - The text content to be displayed in the table cell.
     * @returns {boolean} - True if the function was successful, false otherwise.
     */
    drawTD(container, string) {
        const td = document.createElement("td");
        td.textContent = string;
        container.appendChild(td);
    }

    /**
     * Populates the table with data from the Ollama local models.
     *
     * This function retrieves the local models from Ollama, then iterates through them,
     * creating a new table row for each model and adding the model's name, size,
     * modified date, quantization level, parameter size, and digest to the row.
     *
     * @returns {void} - This function does not return a value. It directly modifies the `this.table` element.
     */
    drawTable() {
        const models = Ollama.getLocalModels();
        console.log(models);

        models.forEach(model => {
            const row = document.createElement("tr");
            this.drawTD(row, model.name);
            this.drawTD(row, Utils.formatNumber(model.size, 9, 2));
            this.drawTD(row, model.modified_at);
            this.drawTD(row, model.details.quantization_level);
            this.drawTD(row, model.details.parameter_size);
            this.drawTD(row, model.digest);


            this.table.appendChild(row);
        });
    
    };
};

/**
 * @type {InstalledModelsInformationDisplay}
 */
const installedModelsInformationDisplay = new InstalledModelsInformationDisplay(document.getElementById("installedModelsTable"));


Ollama.addCallback("cachedLocalModels", () => {
    installedModelsInformationDisplay.drawTable();
});