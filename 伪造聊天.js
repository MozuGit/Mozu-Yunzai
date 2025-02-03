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
    var ifmsg = false
    var ifname = false
    let msgList = []
    if (!e.group) return e.reply("私聊暂不支持此操作", true)
    let text = e.msg.replace(/#?伪(造|装)(聊天)?/g, "")
    if (text == "") return e.reply("你要造什么，造空气吗", true)
    let data = text.split("|")
    if (data.length === 0) {data[0] = text}
    for (let i = 0; i < data.length; i++) {
     let msg = data[i].split(/,\s*/)
     if (msg.length > 3) ifname = true
     if (msg.length > 2) { 
        ifmsg = true
        var date = new Date(msg[2]) 
     }
     if (msg.length < 2) {
      msg[0] = `${e.user_id}`
      msg[1] = text
     }
      msgList.push({
        message: msg[1],  
        user_id: Number(msg[0]),      
        nickname: ifname ? msg[3] : await Bot.pickFriend(Number(msg[0])).getInfo().nickname,
        time: ifmsg ? Number(date) / 1000 : e.time
      })
      ifmsg = false
      ifname = false
    }
    let forwardMsg = await e.group.makeForwardMsg(msgList)
    await e.reply(forwardMsg, false, (e.isMaster) ? { recallMsg: 0 } : { recallMsg: 30 })
    return true
  }
}