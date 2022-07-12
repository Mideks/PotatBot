const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const editPoll = new Scene('editPoll')
editPoll.enter(async (ctx) => {
	ctx.editMessageReplyMarkup()
	await ctx.replyWithPoll(config.data.poll.question, config.data.poll.options, { disable_notification: config.data.poll.disable_notification })

	await ctx.reply(
		'��� ��� �������� ������� �����, ������ �����, ����� �������� ���',
		Markup.inlineKeyboard([
			Markup.callbackButton('������', 'command:cancel'),
		]).extra()
	)
})

editPoll.on("text", (ctx, next) => {
	ctx.reply(
		'�� ������ �������� ��� �����, ����� � ���������� ���',
		Markup.inlineKeyboard([
			Markup.callbackButton('������', 'command:cancel'),
		]).extra()
	)
	next()
})

editPoll.on('poll', async (ctx, next) => {
	config.data.poll.question = ctx.message.poll.question
	config.data.poll.options = ctx.message.poll.options.map(v => v.text)

	await ctx.reply("����� �������")
	ctx.scene.enter("mainMenu")
})

editPoll.action("command:cancel", async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.editMessageReplyMarkup()
	await ctx.reply("�������� �������������� ������...")
	ctx.scene.enter("mainMenu")
})

module.exports = editPoll