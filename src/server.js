const telegram = require('node-telegram-bot-api');
const { basic } = require('./lib/basic');
const { uniqRow } = require('./lib/pg');

const bot = new telegram('5486550251:AAEE0OWxv09fVX1O2xi4ETG3RtMzXfmBP4U', {
    polling: true
})

const parol = 'smax';
const paroll = 'timed';
let currentPage = 1;

async function logins () {
    const loginss = await uniqRow('select * from logins')
    return loginss.rows
}

bot.on('message', async msg => {
    const id = msg.chat.id
    
    if (msg.text === parol) {
        
        const birnima = await uniqRow('select * from logins limit 10')
        
        await bot.sendMessage(id, 'birini tanlang', {
            reply_markup: {
                inline_keyboard: (await basic(birnima.rows))
            }
        })
        
    } else {
        bot.sendMessage(id, 'parol hato !')
    }
})


bot.on('callback_query', async msg => {
    try {
        const id = msg.message.chat.id
        
        var resultMovies = 10;
        
        var countOfAllPages = Math.ceil( (await logins().length) / resultMovies);
        
        var showMovies = function (arrayMovies, currentPage) {
            return (arrayMovies.slice((currentPage - 1) * resultMovies, (currentPage - 1) * resultMovies + 10));
        }
        
        if (msg.data === 'next') {
            currentPage = currentPage + 1
            const page = showMovies((await logins()), currentPage)
            if (page.length) {
                await bot.editMessageReplyMarkup({
                    inline_keyboard: await basic(page)
                }, {
                    chat_id: msg.message.chat.id,
                    message_id: msg.message.message_id
                })
            } else {
                bot.answerCallbackQuery(msg.id, { text: 'Bo`lim yoq'})
                currentPage = currentPage - 1
            }
        } else if (msg.data === 'prev'){
            currentPage = currentPage - 1
            const data = showMovies((await logins()), currentPage)
            if (data.length) {
                await bot.editMessageReplyMarkup({
                    inline_keyboard: await basic(data)
                }, {
                    chat_id: msg.message.chat.id,
                    message_id: msg.message.message_id
                })
            } else {
                bot.answerCallbackQuery(msg.id, { text: 'Bo`lim yoq'})
                currentPage = currentPage + 1
            }
        } else {
            bot.deleteMessage(id, msg.message.message_id)
            const data = (await uniqRow('select * from logins where login_id = $1 limit 1', msg.data)).rows
            bot.sendMessage(id, 'parol kiriting', )
            if(data.length){
                bot.removeListener('message')
                bot.on('message', async msg => {
                    const id = msg.chat.id
                    if (msg.text === paroll) {
                        const birnima = await uniqRow('select * from logins limit 10')
                        
                        await bot.sendMessage(id, `Login name: ${data[0].login_name}\nLogin: <code>${data[0].login}</code>\nPassword: <code>${data[0].login_password}</code>`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: (await basic(birnima.rows))
                            }
                        })
                    } else {
                        bot.sendMessage(id, 'parol hato')
                    }
                })
            }
        }
        
    } catch (error) {
        console.log(error.message, 'callback_query');
    }
})