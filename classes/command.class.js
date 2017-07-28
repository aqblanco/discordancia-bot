module.exports =
    /** Class representing a command. */
    class Command {

        /**
         * Create a command object.
         * @constructor
         * @param {string} label - The string used to identify and call the command.
         * @param {string} desc - What does the command do.
         * @param {function} f - Function to be executed when the command is called.
         * @param {boolean} [cmdLevel=0] - Is this command only avaliable to everyone (0), bot's manager group and admins (1) or admin users (2)
         * @param {any[]} [fParams=[]] - Parameters used by the function f (Optional).
         * @param {Object[]} argumentList - Arguments that the command may accept (Optional).
         * @param {string} argumentList.tag - String used to identify the command.
         * @param {string} argumentList.desc - What is that argument for.
         * @param {boolean} argumentList.optional - Is the argument optional.
         */
        constructor(label, desc, f, cmdLevel = 0, fParams = [], argumentList = []) {
            this.label = label;
            this.desc = desc;
            this.f = f;
            this.cmdLevel = cmdLevel;
            //this.displayOptions = displayOptions;
            this.fParams = fParams;
            this.argumentList = argumentList;
        }

        getLabel() {
            return this.label;
        }

        getDesc() {
            return this.desc;
        }

        getArgumentList() {
            return this.argumentList;
        }

        /**
         * @deprecated 
         */
        isAdminOnly() {
            return this.cmdLevel;
        }

        userCanExecute(user) {
            var res = false;
            var isAdmin = user.hasPermission("ADMINISTRATOR");
            var isBotManager = false; //TODO: Check group

            switch (this.cmdLevel) {
                case 2:
                    res = isAdmin;
                    break;
                case 1:
                    res = isBotManager || isAdmin;
                    break;
                case 0:
                default:
                    res = true;
            }

            return res;
        }

        addFParams(newParams) {
            for (var key in newParams) {
                //this.fParams.push({ key: newParams[key] });
                this.fParams[key] = newParams[key];
            }

            //this.fParams.push(newParams);
        }

        execute(args, callback) {
            var f = this.f;
            var fParams = this.fParams;

            var res = f(fParams, args, callback);
        }
    }