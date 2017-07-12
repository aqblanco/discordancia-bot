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

        /*executeSync(args) {
            return this.f(this.fParams, args);
        }*/

        execute(args, callback) {
            console.log("execute");
            var f = this.f;
            var fParams = this.fParams;
            
            return new Promise(function (resolve, reject) {
                /*var fWCallback = function(f, fParams, args, callback) {
                    f(fParams, args);
                };*/
console.log(f);
                var res = f(fParams, args);//executeSync(args);
                if (typeof res != 'undefined') {
                    resolve(res);
                } else {
                    reject(Error('Function is not valid.'))
                }

                /*fWCallback(f, fParams, args, function (err, res) {
                    if (err) reject(err);
                    else resolve(res);
                });*/
            });
        }
    }