const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const editPollsMenu = (ctx) => {
	const keyboard = [[Markup.callbackButton('➕ Создать новый', 'command:new_poll')]]

	ctx.config.data.polls.forEach((e, i) => {
		keyboard.push([Markup.callbackButton(e.question, 'command:edit_poll:' + i)])
	})
	
	keyboard.push([Markup.callbackButton('< Назад', 'command:back')])

	return Markup.inlineKeyboard(keyboard)
}

const scene = new Scene('editPollsMenu')
scene.enter(async (ctx) => {
	const args =
		[
			'Выберите один из существующих опросов для редактирования или создайте новый...',
			editPollsMenu(ctx).extra()
		]

	if (ctx.updateType == 'callback_query') await ctx.editMessageText(...args)
	else await ctx.reply(...args)
	
})

scene.action('command:new_poll', async ctx => {
	await ctx.answerCbQuery()
	ctx.scene.enter("newPoll")
})

scene.action('command:edit_poll:(?<pollIndex>\d+)', async ctx => {
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

