module.exports =
    class Command {
        constructor(label, desc, f, fParams = [], displayOptions = []) {
            this.label = label;
            this.desc = desc;
            this.f = f;
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

        execute(args, callback) {
            var f = this.f;
            var fParams = this.fParams;

            var res = f(fParams, args, callback);
        }
    }