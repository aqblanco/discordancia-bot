module.exports =
/** Class representing a command. */
    class Command {

        /**
         * Create a command object.
         * @constructor
         * @param {string} label - The string used to identify and call the command.
         * @param {string} desc - What does the command do.
         * @param {function} f - Function to be executed when the command is called.
         * @param {any[]} [fParams=[]] - Parameter used by the function f (Optional).
         * @param {Object[]} argumentList - Arguments that the command may accept (Optional).
         * @param {string} argumentList.tag - String used to identify the command.
         * @param {string} argumentList.desc - What is that argument for.
         * @param {boolean} argumentList.optional - Is the argument optional.
         * @param {integer} argumentList.order - Position in the command.
         */
        constructor(label, desc, f, fParams = [], argumentList = []) {
            this.label = label;
            this.desc = desc;
            this.f = f;
            //this.displayOptions = displayOptions;
            this.fParams = fParams;
            this.argumentList = argumentList;
            // Check no repeated order position
        }

        getLabel() {
            return this.label;
        }

        getDesc() {
            return this.desc;
        }

        getArgumentList() {
            //TODO: Ordenar por order
            return this.argumentList;
        }

        addFParams(newParams) {
            for (var key in newParams) {
                this.fParams[key] = newParams[key];
            }
        }

        execute(args, callback) {
            var f = this.f;
            var fParams = this.fParams;

            var res = f(fParams, args, callback);
        }
    }