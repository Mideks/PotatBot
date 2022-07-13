const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base')

const settingsMenu = (ctx) => {
	const settings = ctx.config.data.sending_poll_settings
	const commentsText = `${settings.delete_comments ? '✖️' : '✔️'} Комментарии`
	const notificationsText = `${settings.disable_notification ? '✖️' : '✔️'} Уведомления`

	return Markup.inlineKeyboard([
		[
			Markup.callbackButton(commentsText, 'command:comments'),
			Markup.callbackButton(notificationsText, 'command:notifications')
		],
		[Markup.callbackButton('✍️ Когда добавить?', 'command:adding_settings')],
		[Markup.callbackButton('< Назад', 'command:back')]
	])
}
const settings = new Scene('settings')
settings.enter((ctx) => {
	const text = 'Настроки прикрепляемого опроса'
	ctx.editMessageText(text, settingsMenu(ctx).extra())
})

settings.action('command:comments', async (ctx) => {
	await ctx.answerCbQuery()
	ctx.config.data.sending_poll_settings.delete_comments = !ctx.config.data.sending_poll_settings.delete_comments
	ctx.editMessageReplyMarkup(settingsMenu(ctx))
})
settings.action('command:notifications', async (ctx) => {
	await ctx.answerCbQuery()
	ctx.config.data.sending_poll_settings.disable_notification = !ctx.config.data.sending_poll_settings.disable_notification
	ctx.editMessageReplyMarkup(settingsMenu(ctx))
})

settings.action('command:adding_settings', async (ctx) => {
	await ctx.answerCbQuery()
	ctx.scene.enter("addingSettings")
})

settings.action('command:back', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.deleteMessage()
	ctx.scene.enter("mainMenu")
})

module.exports = settings