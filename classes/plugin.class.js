module.exports =
    class Plugin {
        constructor(name, commands = [], eventHandlers = []) {
            this.name = name;
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