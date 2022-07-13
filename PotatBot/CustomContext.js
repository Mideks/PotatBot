const Telegraf = require('telegraf')

class CustomContext extends Telegraf.Context {
    constructor(update, telegram, options) {
        super(update, telegram, options)
    }

}

module.exports = CustomContext
