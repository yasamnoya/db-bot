const discordjs = require('discord.js')
const client = new discordjs.Client()
const startFreeUdemyCourse = require('./services/freeUdemyCourse')

client.once('ready', () => {
  process.env.BOT_ID = client.user.id
  console.log('Ready!')
  console.log(`Logged in as ${process.env.BOT_ID}`)
  startFreeUdemyCourse(client)
})

client.login(process.env.BOT_TOKEN)
