const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const newPoll = new Scene('newPoll')
newPoll.enter(async (ctx) => {
	ctx.session.enterMessage = await ctx.editMessageText(
		'Пришли опрос, чтобы я мог его добавить к себе',
		Markup.inlineKeyboard([
			Markup.callbackButton('Отмена', 'command:cancel'),
		]).extra()
	)
})

newPoll.on('poll', async (ctx, next) => {
	const poll =
	{
		question: ctx.message.poll.question,
		options: ctx.message.poll.options.map(v => v.text)
	}
	ctx.config.data.polls.push(poll)

	const msg = await ctx.reply("Новый опрос создан")
	ctx.scene.enter("editPollsMenu")

	setTimeout(() => {
		const enterMessage = ctx.session.enterMessage

		ctx.deleteMessage()
		ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
		ctx.telegram.deleteMessage(enterMessage.chat.id, enterMessage.message_id)

		delete ctx.session.enterMessage
	}, 2000)


})

newPoll.on("message", async (ctx, next) => {
	const msg = await ctx.reply(
		'Ты должен прислать мне опрос, чтобы я скопировал его',
		Markup.inlineKeyboard([
			Markup.callbackButton('Отмена', 'command:cancel'),
		]).extra()
	)
	setTimeout(() => {
		ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
	}, 2000)

	next()
})

newPoll.action("command:cancel", async (ctx) => {
	await ctx.answerCbQuery()
	ctx.scene.enter("editPollsMenu")
})

module.exports = newPoll