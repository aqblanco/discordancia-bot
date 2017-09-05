module.exports =
    class ResourceManager {
        constructor(basePath, resourceList = [{}]) {
            this.basePath = basePath;
            this.resourceList = resourceList;
        }

        addResource(resource, category) {
            this.resourceList[category].push(resource);
        }

        getResourcePath(resourceName, category) {
            var found = false;
            var result = "";
            var path = this.basePath
            this.resourceList[category].forEach(function(e) {
                if (e.name == resourceName && !found) {
                    result = path + e.file;
                    found = true;
                }
            });

            return result;
        }

        getResourceList(category) {
            var list = [];
            this.resourceList[category].forEach(function(e) {
                list.push(e.name);
            });

            return list;
        }
    }