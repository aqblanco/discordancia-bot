module.exports =
    class ResourceManager {
        constructor(basePath, resourceList = [{}]) {
            this.basePath = basePath;
            this.resourceList = resourceList;
        }

        addResource(resource) {
            this.resourceList.push(resource);
        }

        addResourceList(resourceL) {
            this.resourceList.push(resourceL);
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

        getResourceList() {
            var list = [];
            this.resourceList.forEach(function(e) {
                list.push(e.name);
            });

            return list;
        }
    }