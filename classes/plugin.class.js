module.exports =
    class Plugin {
        constructor(commands = [], eventHandlers = []) {
            this.commands = commands;
            this.eventHandlers = eventHandlers;
        }

        addCommand(command) {
            this.commands.push(command);
        }

        addEventHandler(eventHandler) {
            this.eventHandlers.push(eventHandler);
        }

        getCommands() {
            return this.commands;
        }

        getEventHandlers() {
            return this.eventHandlers;
        }
    }