module.exports =
    class EventHandler {
        constructor(event, listener) {
            this.event = event;
            this.listener = listener;
        }

        getEvent() {
            return this.event;
        }

        getListener() {
            return this.listener;
        }

        bind(client) {
            client.on(this.event, this.listener);
        }
    }