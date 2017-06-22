module.exports = 
    class resourceManager {
        constructor(basePath, resourceList = [{}]) {
            this.basePath = basePath;
            this.resourceList = resourceList;
        }

        addResource(resource) {
            this.resourceList.push(resource);
        }

        getResourcePath(resourceName) {
            var found = false;
            var result = "";
            var path = this.basePath
            this.resourceList.forEach(function(e) {
                if (e.name == resourceName && !found) {
                    result = path + e.file;
                    found = true;
                }
            });

            return result;
        }
    }