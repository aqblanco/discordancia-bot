module.exports = 
    class Bot {
        constructor() {}

        getRandomStr(list) {
            var item = list[Math.floor(Math.random()*list.length)];
            return(item);
        }
    }