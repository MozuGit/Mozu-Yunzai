import plugin from '../../lib/plugins/plugin.js'

export class Mozu extends plugin {
  constructor() {
    super({
      name: "伪造聊天",
      dsc: "自定义伪造聊天",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#?伪(造|装)(聊天)?",
          fnc: "weizao"
        }
      ]
    })
  }

async weizao(e) {
    if (!e.group) return e.reply("私聊暂不支持此操作", true)
    let text = e.msg.replace(/#?伪(造|装)(聊天)?/g, "")
    if (text == "") return e.reply("你要造什么，造空气吗", true)
    let data = text.split("|")
    let msgList = []
    var ifmsg = false
    var ifurl = true
    if (data.length === 0) {data[0] = text}
    for (let i = 0; i < data.length; i++) {
          let msg = data[i].split(/,\s*/)
          if (msg.length > 2) { 
          ifmsg = true
          var date = new Date(msg[2]) 
          }
          if (msg.length < 2) {
          msg[0] = `${e.user_id}`
          msg[1] = text
          }
          let url = await fetch(`https://api.dzzui.com/api/qqname?qq=${msg[0]}`)
          .then(response => response.json())
          if (url.code != 200) ifurl = false
          msgList.push({
          message: msg[1],  
          user_id: Number(msg[0]),      
          nickname: ifurl ? url.name : msg[3],
          time: ifmsg ? Number(date) / 1000 : e.time
          })
          ifmsg = false
          ifurl = true
    }
          let forwardMsg = await e.group.makeForwardMsg(msgList)
          await e.reply(forwardMsg, false, (e.isMaster) ? { recallMsg: 0 } : { recallMsg: 30 })
          return true
}
}