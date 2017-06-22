module.exports = 
    class Command {
        constructor(label, desc, callback, fParams = [], displayOptions = []) {
            this.label = label;
            this.desc = desc;
            this.callback = callback;
            this.displayOptions = displayOptions;
            this.fParams = fParams;
        }

        getLabel() {
            return this.label;
        }
        
        getDesc() {
            return this.desc;
        }

        addFParams(newParams) {
            for (var key in newParams) {
                this.fParams[key] = newParams[key];
            }
        }

        execute(args) {
            return {result: this.callback(this.fParams, args), displayOptions: this.displayOptions};
        }
    }