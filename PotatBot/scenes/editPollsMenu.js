const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const editPollsMenu = (ctx) => {
	const keyboard = [[Markup.callbackButton('➕ Создать новый', 'command:comments')]]

	ctx.config.data.polls.forEach((e, i) => {
		keyboard.push([Markup.callbackButton(e.question, 'command:editPoll:' + i)])
	})
	
	keyboard.push([Markup.callbackButton('< Назад', 'command:back')])

	return Markup.inlineKeyboard(keyboard)
}

const scene = new Scene('editPollsMenu')
scene.enter(async (ctx) => {
	const args =
		[
			'Выберите один из существующих опросов для редактирования или создайте новый...',
			editPollsMenu(ctx)
		]

	if (ctx.updateType == 'callback_query') await ctx.editMessageText(...args)
	else await ctx.reply(...args)
	
})

scene.action('command:newPoll', async ctx => {
	await ctx.answerCbQuery()
	ctx.scene.enter("newPoll")
})

scene.action('command:editPoll:(?<pollIndex>\d+)', async ctx => {
	await ctx.answerCbQuery()
	ctx.session.pollIndex = ctx.match.groups.pollIndex
	ctx.scene.enter("editPoll")
})

scene.action('command:back', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.deleteMessage()
	ctx.scene.enter("mainMenu")
})

module.exports = scene

