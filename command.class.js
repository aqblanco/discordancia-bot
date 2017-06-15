module.exports = 
    class Command {
        constructor(label, desc, callback, parameters = []) {
            this.label = label;
            this.desc = desc;
            this.callback = callback;
            this.parameters = parameters;
        }

        execute() {
            return this.callback(this.parameters);
        }
    }