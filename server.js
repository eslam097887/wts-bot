const {default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion} = require('@whiskeysockets/baileys');
const pino = require('pino');
const {Sticker, StickerTypes} = require('wa-sticker-formatter');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
let globalClient = null;

app.get('/', (r,s)=> s.send('👑 بوت ساسكي شغال! افتح /request-code'));
app.get('/request-code', async (req,res)=>{
    if(!globalClient) return res.send('⏳ لسه بيحمل...');
    if(globalClient.authState.creds.registered) return res.send('✅ مربوط');
    try{
        const code = await globalClient.requestPairingCode('201274934730');
        console.log(`🔑 كود يدوي: ${code}`);
        res.send(`<h1 style="font-size:60px;text-align:center">${code}</h1>`);
    }catch(e){ res.send('❌ '+e.message); }
});
app.listen(PORT,'0.0.0.0',()=> console.log('🚀 '+PORT));

const OWNER_NUMBER='201274934730';
const OWNER_JID=OWNER_NUMBER+'@s.whatsapp.net';
const MENU_MAIN=`👑『 بوت القائد اسلام 』👑\n📜.قوانين\n🎮.العاب\n🛠️.ادوات\n⚙️.ادارة`;
const MENU_AL3AB=`🎮 قايمة الألعاب\n💣.قنبلة\n🕵️.حرامي\n🔫.روليت\n🎲.نرد`;
const MENU_ADWAT=`🛠️ قايمة الأدوات\n🎨.ملصق`;
const MENU_EDARA=`⚙️ قايمة الإدارة\n🛑.طرد`;
const MENU_QAWANEEN=`📜 قوانين الجروب\n1- ممنوع خاص=طرد\n2- ممنوع لينكات=بان`;
const IMG='https://i.ibb.co/3kWy9Ym/sasuke.jpg';
const SLAP='https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif';

let bombGame={};

async function startBot(){
    try{fs.rmSync('/tmp/session',{recursive:true,force:true});}catch(e){}
    fs.mkdirSync('/tmp/session',{recursive:true});
    const {state,saveCreds}=await useMultiFileAuthState('/tmp/session');
    const {version}=await fetchLatestBaileysVersion();
    const client=makeWASocket({version,logger:pino({level:'silent'}),printQRInTerminal:false,auth:state,browser:["Ubuntu","Chrome","20.0.04"]});
    globalClient=client;

    if(!client.authState.creds.registered){
        console.log('⏳ بيجهز كود بعد الريستارت...');
        await new Promise(r=>setTimeout(r,8000));
        try{
            const code=await client.requestPairingCode('201274934730');
            console.log(`\n🔑 كود جديد بعد الريستارت: ${code}\n`);
        }catch(e){ console.log('❌ فشل الكود',e.message); }
    }

    client.ev.on('creds.update',saveCreds);
    client.ev.on('connection.update',u=>{
        if(u.connection==='close'){
            const rec=u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut;
            if(rec) setTimeout(()=>startBot(),3000);
        }else if(u.connection==='open') console.log('👑 ساسكي جاهز 🔥');
    });

    client.ev.on('messages.upsert',async m=>{
        const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
        const from=msg.key.remoteJid; if(!from.endsWith('@g.us')) return;
        const body=msg.message.conversation||msg.message.extendedTextMessage?.text||'';
        const text=body.trim(); const low=text.toLowerCase();
        const sender=msg.key.participant||msg.key.remoteJid;
        const sNum=sender.split('@')[0];
        const isOwner=sender.replace(/[^0-9]/g,'')===OWNER_NUMBER;

        if(text==='.كود' || text==='.ربط'){
            if(!isOwner) return;
            try{
                const code=await client.requestPairingCode('201274934730');
                return await client.sendMessage(from,{text:`🔑 كودك يا قائد: *${code}*`},{quoted:msg});
            }catch(e){ return await client.sendMessage(from,{text:'❌ '+e.message},{quoted:msg}); }
        }
        if(['.ساسكي','ساسكي','.قايمة'].includes(low)){
            return await client.sendMessage(from,{image:{url:IMG},caption:MENU_MAIN},{quoted:msg});
        }
        if(text==='.العاب') return await client.sendMessage(from,{text:MENU_AL3AB},{quoted:msg});
        if(text==='.ادوات') return await client.sendMessage(from,{text:MENU_ADWAT},{quoted:msg});
        if(text==='.ادارة') return await client.sendMessage(from,{text:MENU_EDARA},{quoted:msg});
        if(text==='.قوانين') return await client.sendMessage(from,{text:MENU_QAWANEEN},{quoted:msg});
    });

    // رسالة الترحيب الخاصة بيك
    client.ev.on('group-participants.update', async (update) => {
        if (update.action === 'add') {
            const chat = update.id;
            const gInfo = await client.groupMetadata(chat).catch(()=>null);
            const gName = gInfo?.subject || 'الجروب';
            for (let participant of update.participants) {
                let userNum = participant.split('@')[0];
                await client.sendMessage(chat, { text: `نورت الجروب @${userNum} 👑`, mentions: [participant] });
                try{
                    await client.sendMessage(OWNER_JID, {
                        text: `👑 يا قائد في حد جديد دخل ${gName}\nرقمه: @${userNum}`,
                        mentions: [participant]
                    });
                }catch(e){}
            }
        }
    });
}
startBot();
