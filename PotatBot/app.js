'use strict';
const Telegraf = require('telegraf')
const config = require("./config.json")

const bot = new Telegraf(config.bot_token);

let messageToDeleteID = -1
bot.on("channel_post", async (ctx) => {
	let pattern = config.end_pattern.text

	// если true -- значит паттерн нужен для создания опроса, false -- для его отсутствия
	let needPoll = !config.end_pattern.for_post_poll;
	if (ctx.channelPost.text.endsWith(pattern)) {
		let msg = ctx.channelPost.text.replace(new RegExp(pattern + "$"), "")
		ctx.telegram.editMessageText(ctx.channelPost.chat.id, ctx.channelPost.message_id, null, msg)
		needPoll = !needPoll;
	}

	if (needPoll) {
		let p = await ctx.replyWithPoll(config.poll.question, config.poll.options, { disable_notification: config.poll.disable_notification })
		messageToDeleteID = p.message_id
	}

})
bot.on("message", (ctx, next) => {
	if (config.poll.delete_comments &&
		ctx.message.is_automatic_forward &&
		ctx.message.forward_from_message_id == messageToDeleteID)
	{
		ctx.deleteMessage()
		messageToDeleteID = -1
	}
	return next()
})

bot.launch().then(() => console.log("Bot started!"));
bot.catch((err, ctx) => {
	console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})
process.on('SIGINT', function () {
	console.log("STOPPED bot.")
	process.exit(1)
})

