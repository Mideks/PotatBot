const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')


const mainMenu = new Scene('mainMenu')
mainMenu.enter(async (ctx) => {
	ctx.reply(
		'׸ ������ � ���� ���?',
		Markup.inlineKeyboard([
			Markup.callbackButton('������������� �����', 'command:edit_poll'),
			Markup.callbackButton('���������', 'command:settings'),
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