const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const editPollMenu = (ctx) => {
	const isActive = (ctx.config.data.selected_poll == ctx.session.pollIndex)
	return Markup.inlineKeyboard([
		Markup.callbackButton(`${isActive ? '✖️' : '✔️'} Активный`, 'command:activate'),
		Markup.callbackButton('Удалить опрос', 'command:delete'),
		Markup.callbackButton('< Назад', 'command:back')
	])
}
const scene = new Scene('pollSettings')

scene.enter((ctx) => {
	ctx.editMessageText('Настройки опроса', editPollMenu(ctx).extra())
})

scene.action('command:activate', async (ctx) => {
	await ctx.answerCbQuery()
	ctx.config.data.selected_poll = ctx.session.pollIndex
	ctx.editMessageReplyMarkup(editPollMenu(ctx))
})

scene.action('command:delete', async (ctx) => {
	await ctx.answerCbQuery()
	ctx.config.data.polls.splice(ctx.session.pollIndex, 1)
	ctx.scene.enter("editPollsMenu")
})

scene.action('command:back', async (ctx) => {
	await ctx.answerCbQuery()
	ctx.scene.enter("editPollsMenu")
})
module.exports = scene