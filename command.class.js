module.exports = 
    class Command {
        constructor(label, desc, callback) {
            this.label = label;
            this.desc = desc;
            this.callback = callback;
        }

        getLabel() {
            return this.label;
        }
        
        getDesc() {
            return this.desc;
        }

        execute(parameters) {
            return this.callback(parameters);
        }
    }