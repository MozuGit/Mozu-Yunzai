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
    let msgList = []
    let imgUrls = []
    if (!e.group) return e.reply("私聊暂不支持此操作", true)
    let text = e.msg.replace(/#?伪(造|装)(聊天)?/g, "")
    if (text == "") return e.reply("你要造什么，造空气吗", true)
    for (let msgurl of e.message) {
        if (msgurl.type == 'image') {
            imgUrls.push(msgurl.url)
        }
    }
    imgUrls.reverse()
    let data = text.split("|")
    if (data.length === 0) {data[0] = text}
    for (let i = 0; i < data.length; i++) {
     let bt = []
     let ys = []
     let ifmsg = false
     let ifname = false
     let msg = data[i].split(/,\s*/)
     if (msg.length > 3) ifname = true
     if (msg.length > 2) { 
        ifmsg = true
        if (msg[2] !== null && msg[2] !== undefined && msg[2] !== "") {var date = new Date(msg[2])} else {var date = e.time * 1000}
     }
     if (msg.length < 2) {
      msg[0] = `${e.user_id}`
      msg[1] = text
     }
     bt.push(msg[1].replace(/=img=/g, ""))
     ys = msg[1].match(/=img=/g)
     if (ys?.length > 0) {
        for (let j = 0; j < ys.length; j++) {
            bt.push(segment.image(imgUrls[imgUrls.length - 1]))
            if (imgUrls.length !== 1) imgUrls.pop()
        }
     }
      msgList.push({
        message: bt,  
        user_id: Number(msg[0]),      
        nickname: ifname ? msg[3] : await Bot.pickFriend(Number(msg[0])).getInfo().nickname,
        time: ifmsg ? Number(date) / 1000 : e.time
      })
      ifmsg = false
      ifname = false
    }
    let forwardMsg = await e.group.makeForwardMsg(msgList)
    await e.reply(forwardMsg, false, (e.isMaster) ? { recallMsg: 0 } : { recallMsg: 60 })
    return true
  }
}