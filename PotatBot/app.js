'use strict';
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup');
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

const Config = require("./Config")
const CustomContext = require('./customContext')
const sendingMode = require('./sendingMode')

const config = new Config();
config.read()

const stage = new Stage([], {"default": 'mainMenu' })
stage.register(require('./scenes/mainMenu'))

stage.register(require('./scenes/editPollsMenu'))
stage.register(require('./scenes/newPoll'))
stage.register(require('./scenes/editPoll'))

stage.register(require('./scenes/settingsMenu'))
stage.register(require('./scenes/addingSettings'))



const bot = new Telegraf(config.data.bot_token);
//const bot = new Telegraf(config.data.bot_token, { contextType: CustomContext });
bot.use(session())
bot.use((ctx, next) => {
	ctx.config = config
	next()
})
bot.use(stage.middleware())


let messageToDeleteID = null

const sendPoll = async (ctx) => {
	let p = await ctx.replyWithPoll(config.data.poll.question, config.data.poll.options, { disable_notification: config.data.poll.disable_notification })
	messageToDeleteID = p.message_id
}

const deleteEndPattern = (ctx) => {
	const pattern = config.data.end_pattern.text
	const msg = ctx.channelPost.text.replace(new RegExp(pattern + "$"), "")
	ctx.telegram.editMessageText(ctx.channelPost.chat.id, ctx.channelPost.message_id, null, msg)
}

bot.on("channel_post", async (ctx) => {
	const pattern = config.data.end_pattern.text

	const mode = config.data.sending_poll_settings.mode
	if (mode == sendingMode.never) return;
	if (mode == sendingMode.allways) await sendPoll(ctx)
	if (mode == sendingMode.once) {
		config.data.sending_poll_settings.mode = sendingMode.never
		await sendPoll(ctx)
	}

	if (mode == sendingMode.onRequest) {
		if (ctx.channelPost.text.endsWith(pattern)) {
			deleteEndPattern(ctx)
			await sendPoll(ctx)
        }
	}

	if (mode == sendingMode.cancleOnRequest) {
		if (ctx.channelPost.text.endsWith(pattern))
			deleteEndPattern(ctx)
		else await sendPoll(ctx)
    }
})

bot.on("channel_post", async (ctx) => {
	let pattern = config.data.end_pattern.text

	// если true -- значит паттерн нужен для создания опроса, false -- для его отсутствия
	let needPoll = !config.data.end_pattern.for_post_poll;
	if (ctx.channelPost.text.endsWith(pattern)) {
		let msg = ctx.channelPost.text.replace(new RegExp(pattern + "$"), "")
		ctx.telegram.editMessageText(ctx.channelPost.chat.id, ctx.channelPost.message_id, null, msg)
		needPoll = !needPoll;
	}

	if (needPoll) {
		let p = await ctx.replyWithPoll(config.data.poll.question, config.data.poll.options, { disable_notification: config.data.poll.disable_notification })
		messageToDeleteID = p.message_id
	}

})

bot.on("message", (ctx, next) => {
	if (config.data.sending_poll_settings.delete_comments &&
		ctx.message.is_automatic_forward &&
		ctx.message.forward_from_message_id == messageToDeleteID)
	{
		ctx.deleteMessage()
		messageToDeleteID = null
	}
	return next()
})

bot.start((ctx) => {
	ctx.scene.enter("mainMenu")
})


bot.launch().then(() => console.log("Bot started!"));
bot.catch((err, ctx) => {
	console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})
process.on('SIGINT', function () {
	console.log("STOPPED bot.")
	config.save()
	process.exit(1)
})

