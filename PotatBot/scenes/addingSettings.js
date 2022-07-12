const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const addingSettingsMenu = (ctx) => {
	const mode = config.data.sending_poll.mode

	return Markup.inlineKeyboard([
		[
			Markup.callbackButton(`${mode == 0 ? '✔️ ' : ''}Всегда`, 'command:change_mode:0'),
			Markup.callbackButton(`${mode == 1 ? '✔️ ' : ''}Однократно`, 'command:change_mode:1'),
			Markup.callbackButton(`${mode == 2 ? '✔️ ' : ''}Никогда`, 'command:change_mode:2'),
		],
		[
			Markup.callbackButton(`${mode == 3 ? '✔️ ' : ''}По запросу`, 'command:change_mode:3'),
			Markup.callbackButton(`${mode == 4 ? '✔️ ' : ''}Отмена по запросу`, 'command:change_mode:4'),
		],
		[Markup.callbackButton('< Назад', 'command:back')]
	])
}

const addingSettings = new Scene('addingSettings')
addingSettings.enter((ctx) => {
	const text =
		'Выберите, когда бот может прикрепить реакцию к сообщениям: \n' +
		'• Всегда: опрос будет отправлен после каждого сообщению\n' +
		'• Однократно: опрос будет отправлен только после одного нового сообщения на канале. Затем этот параметр изменится на «никогда» и вам нужно будет изменить его снова здесь\n' +
		'• Никогда: бот никогда не будет прикреплять реакции к вашим записям\n' +
		'• По запросу: будет добавленно, когда последняя строка сообщения является "!"'
	'• Отмена по запросу: не будет добавленно, когда последняя строка сообщения является "!"'

	ctx.editMessageText(text, addingSettingsMenu(ctx).extra())
})
addingSettings.action(/command:change_mode:(?<mode>\d)/, async (ctx) => {
	await ctx.answerCbQuery()
	if (config.data.sending_poll.mode == ctx.match.groups.mode) return
	config.data.sending_poll.mode = ctx.match.groups.mode
	ctx.editMessageReplyMarkup(addingSettingsMenu(ctx))
})

addingSettings.action('command:back', async (ctx) => {
	//await ctx.deleteMessage()
	await ctx.answerCbQuery()
	ctx.scene.enter("settings")
})