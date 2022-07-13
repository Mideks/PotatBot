const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const editPoll = new Scene('editPoll')
editPoll.enter(async (ctx) => {
	await ctx.deleteMessage()
	const ind = ctx.session.pollIndex ?? 0
	ctx.session.pollIndex = ind
	let poll = ctx.config.data.polls[ind]

	ctx.session.pollMessage = await ctx.replyWithPoll(poll.question, poll.options)
	ctx.session.enterMessage = await ctx.reply(
		'Вот так выглядит текущий опрос, пришли новый, чтобы изменить его',
		Markup.inlineKeyboard([
			Markup.callbackButton('Отмена', 'command:cancel'),
		]).extra()
	)
})
editPoll.on('poll', async (ctx, next) => {
	const poll =
	{
		question: ctx.message.poll.question,
		options: ctx.message.poll.options.map(v => v.text)
	}
	ctx.config.data.polls[ctx.session.pollIndex ?? 0] = poll
	delete ctx.session.pollIndex

	const msg = await ctx.reply("Опрос сохранён")
	
	setTimeout(() => {
		const pollMessage = ctx.session.pollMessage
		const enterMessage = ctx.session.enterMessage

		ctx.deleteMessage()
		ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
		ctx.telegram.deleteMessage(pollMessage.chat.id, pollMessage.message_id)
		ctx.telegram.deleteMessage(enterMessage.chat.id, enterMessage.message_id)

		delete ctx.session.pollMessage
		delete ctx.session.enterMessage
	}, 2000)
	
	ctx.scene.enter("editPolls")
})

editPoll.on("message", async (ctx, next) => {
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


editPoll.action("command:cancel", async (ctx) => {
	await ctx.answerCbQuery()
	const pollMessage = ctx.session.pollMessage
	ctx.telegram.deleteMessage(pollMessage.chat.id, pollMessage.message_id)
	delete ctx.session.pollMessage

	ctx.scene.enter("editPolls")
})

module.exports = editPoll