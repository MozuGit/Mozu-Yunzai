//伪造聊天3343712589,123,2025/7/31 11:45:14

let QQlist = [3343712589] //防止伪造
let Grouplist = []

export class Mozu extends plugin {
  constructor() {
    super({
      name: "伪造聊天",
      dsc: "自定义伪造聊天",
      event: "message",
      priority: 1145,
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
     let time = false
     let msg = data[i].split(/,\s*/)
     if (msg.length > 2) { 
        time = true
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
     if (Grouplist.includes(this.e.group_id) && !e.isMaster) return e.reply("存在白名单群聊，无法伪造", true)
     if (QQlist.includes(Number(msg[0])) && !e.isMaster) return e.reply("存在白名单用户，无法伪造", true)
      msgList.push({
        message: bt,  
        user_id: Number(msg[0]),      
        nickname: Bot[e.self_id].pickUser(Number(msg[0])).getSimpleInfo().nickname,
        time: time ? Number(date) / 1000 : e.time
      })
      time = false
    }
    let forwardMsg = await e.group.makeForwardMsg(msgList)
    await e.reply(forwardMsg, false, (e.isMaster) ? { recallMsg: 0 } : { recallMsg: 60 })
    return true
  }
}
