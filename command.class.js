module.exports = 
    class Command {
        constructor(label, desc, callback, displayOptions = []) {
            this.label = label;
            this.desc = desc;
            this.callback = callback;
            this.displayOptions = displayOptions;
        }

        getLabel() {
            return this.label;
        }
        
        getDesc() {
            return this.desc;
        }

        execute(parameters) {
            return {result: this.callback(parameters), displayOptions: this.displayOptions};
        }
    }