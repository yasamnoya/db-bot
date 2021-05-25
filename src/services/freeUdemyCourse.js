const cron = require('node-cron')
const axios = require('axios')

const URL = 'https://vip.studycamp.tw/c/udemy/udemy-free-coupon-code/68/l/latest.json?ascending=false'
const CHANNEL_ID = '846392787871596566'

let latestTopicIdCache = 0

async function startFreeUdemyCourse(client) {
  const channel = client.channels.cache.get(CHANNEL_ID)
  const schedule = '0 */10 * * * *'

  cron.schedule(schedule, async () => {
    console.log('Getting free udemy course')
    const latestTopic = await getLatestTopic()

    const previousMessage = await getPreviousMessage(channel)
    const previousMessageTopicId = parseInt(previousMessage.content.split('/').slice(-1))
    const isNewTopic = previousMessageTopicId != latestTopic.id

    if (!isNewTopic) {
      console.log('There is no new free course\n')
      return
    }

    console.log('Sending new free course to channel')
    sendLatestTopic(channel, latestTopic)
  })
}

async function getLatestTopic() {
  try {
    const res = await axios.get(URL)
    const allTopics = res.data.topic_list.topics
    const freeCourseTopics = allTopics.filter(topic => topic.title.includes('free'))
    const latestTopic = freeCourseTopics[0]
    return latestTopic

  } catch (error) {
    console.log(error)
  }
}

async function getPreviousMessage(channel) {
  const messageList = await channel.messages.fetch({ limit: 50 })
  const myMessageList = messageList.filter(m => m.author.id == process.env.BOT_ID)
  const myPreviousMessage = myMessageList.sorted((a, b) => a.createdTimestamp - b.createdTimestamp).last(1)[0]
  return myPreviousMessage
}

function sendLatestTopic(channel, latestTopic) {
  const title = latestTopic.title
  const url = `https://vip.studycamp.tw/t/topic/${latestTopic.id}`
  const message = `${title}\n${url}`

  channel.send(message)
}

module.exports = startFreeUdemyCourse