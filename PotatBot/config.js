const fs = require("fs")
const path = require("path")

class Config {
    configFilePath = ""
    data = {}

    constructor(configFilePath = "./config.json") {
        this.configFilePath = path.resolve(configFilePath)
    }

    save() {
        fs.writeFileSync(this.configFilePath, JSON.stringify(this.data,null,4))
    }
    read() {
        let text = fs.readFileSync(this.configFilePath);
        this.data = JSON.parse(text)
    }
}


module.exports = Config;
