class _UserInterface {
    updateCurrentTime() {
        this.currentTime = new Date();
    };


    updateBackgroundClass() {
        let currentHour = this.currentTime.getHours();
        let currentTimePeriod = "";
        
        if (currentHour < 8) {
            currentTimePeriod = "night";

        } else if (currentHour < 10) {
            currentTimePeriod = "morning";

        } else if (currentHour < 16) {
            currentTimePeriod = "day";

        } else if (currentHour < 20) {
            currentTimePeriod = "evening";

        } else {
            currentTimePeriod = "night";
        }

        if (currentTimePeriod === this.currentBackgroundTimePeriod)
            return;

        this.currentBackgroundTimePeriodStates.forEach((timePeriod) => {
            document.body.classList.remove(timePeriod);
        })

        this.currentBackgroundTimePeriod = currentTimePeriod;

        document.body.classList.add(this.currentBackgroundTimePeriod);        
        
    };



    updateUserInterfaceTimeBased() {
        this.updateCurrentTime();
        this.updateBackgroundClass();

    };

}

const UserInterface = new _UserInterface();

UserInterface.currentBackgroundTimePeriod = "";
UserInterface.currentBackgroundTimePeriodStates = ["night", "morning", "day", "evening", "night"];


UserInterface.updateUserInterfaceTimeBased();

setInterval(() => { UserInterface.updateUserInterfaceTimeBased(); }, 60 * 10**3)
