const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')


const mainMenu = new Scene('mainMenu')
mainMenu.enter(async (ctx) => {
	ctx.reply(
		'Чё пришёл в этот раз?',
		Markup.inlineKeyboard([
			Markup.callbackButton('Редактировать опрос', 'command:edit_poll'),
			Markup.callbackButton('Настройки', 'command:settings'),
		]).extra()
	)
})

mainMenu.action("command:settings", async (ctx) => {
	await ctx.answerCbQuery()
	ctx.scene.enter('settings')
})

mainMenu.action("command:edit_poll", async (ctx) => {
	await ctx.answerCbQuery()
	ctx.scene.enter('editPoll')
})

module.exports = mainMenu