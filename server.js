const {default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion} = require('@whiskeysockets/baileys');
const pino = require('pino');
const {Sticker, StickerTypes} = require('wa-sticker-formatter');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
let globalClient = null;
app.get('/', (r,s)=>s.send('👑 بوت ساسكي شغال! افتح /request-code'));
app.get('/request-code', async (req,res)=>{
    if(!globalClient) return res.send('⏳ بيحمل...');
    if(globalClient.authState.creds.registered) return res.send('✅ مربوط');
    try{
        const num=(process.env.BOT_NUMBER||'201274934730').replace(/[^0-9]/g,'');
        const code=await globalClient.requestPairingCode(num);
        console.log('🔑 كود:',code);
        res.send(`<h1>${code}</h1>`);
    }catch(e){res.send('❌ '+e.message);}
});
app.listen(PORT,'0.0.0.0',()=>console.log('🚀 '+PORT));

const OWNER_NUMBER='201274934730';
const OWNER_JID=OWNER_NUMBER+'@s.whatsapp.net';
const SLAP='https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif';
const IMG='https://i.ibb.co/3kWy9Ym/sasuke.jpg';
const MENU_MAIN=`👑『 بوت القائد اسلام 』👑\n\n📜.قوانين\n🎮.العاب\n🛠️.ادوات\n⚙️.ادارة\n🧠.معلومات\n👑.المطور`;
const MENU_AL3AB=`🎮 قايمة الألعاب\n💣.قنبلة\n🕵️.حرامي\n🔫.روليت\n🎲.نرد\n🪜.سلم\n👋.صفع`;
const MENU_ADWAT=`🛠️ قايمة الأدوات\n🎨.ملصق\n🌐.ترجمة\n🌤️.طقس`;
const MENU_EDARA=`⚙️ قايمة الإدارة\n🛑.طرد\n🔒.قفل`;
const MENU_QAWANEEN=`📜 قوانين الجروب\n1- ممنوع خاص لبنت=طرد\n2- ممنوع اللينكات=بان\n3- الاحترام\n4- احترام القائد 👑`;

const messages=["*`♡ يا مُقلب القلوب ثبّت قلبي على دينك.`*","*`♡ سبحان الله وبحمده`*","*`♡ ربنا آتنا في الدنيا حسنة`*","*`♡ اللهم اغفر لنا`*","*`♡ اللهم ارحمنا`*"];
let isEnabled=true; let bombGame={};

async function startBot(){
    try{fs.rmSync('/tmp/session',{recursive:true,force:true});}catch(e){}
    fs.mkdirSync('/tmp/session',{recursive:true});
    const {state,saveCreds}=await useMultiFileAuthState('/tmp/session');
    const {version}=await fetchLatestBaileysVersion();
    const client=makeWASocket({version,logger:pino({level:'silent'}),printQRInTerminal:false,auth:state,browser:["Ubuntu","Chrome","20.0.04"]});
    globalClient=client;
    if(!client.authState.creds.registered){
        console.log('⏳ بيجهز الكود الجديد...');
        await new Promise(r=>setTimeout(r,8000));
        try{
            const code=await client.requestPairingCode('201274934730');
            console.log(`\n🔑 كود جديد: ${code}\n`);
        }catch(e){console.log('❌ فشل',e.message);}
    }
    client.ev.on('creds.update',saveCreds);
    client.ev.on('connection.update',u=>{
        if(u.connection==='close'){
            const s=u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut;
            if(s) setTimeout(()=>startBot(),3000);
        }else if(u.connection==='open') console.log('👑 جاهز');
    });
    client.ev.on('messages.upsert',async m=>{
        const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
        const from=msg.key.remoteJid; if(!from.endsWith('@g.us')) return;
        const body=msg.message.conversation||msg.message.extendedTextMessage?.text||'';
        const text=body.trim(); const low=text.toLowerCase();
        const sender=msg.key.participant||msg.key.remoteJid;
        const sNum=sender.split('@')[0];
        const isOwner=sender.replace(/[^0-9]/g,'')===OWNER_NUMBER;
        if(['.ساسكي','ساسكي','.قايمة','قايمة'].includes(low)){
            return await client.sendMessage(from,{image:{url:IMG},caption:MENU_MAIN},{quoted:msg});
        }
        if(text==='.العاب') return await client.sendMessage(from,{text:MENU_AL3AB},{quoted:msg});
        if(text==='.ادوات') return await client.sendMessage(from,{text:MENU_ADWAT},{quoted:msg});
        if(text==='.ادارة') return await client.sendMessage(from,{text:MENU_EDARA},{quoted:msg});
        if(text==='.قوانين') return await client.sendMessage(from,{text:MENU_QAWANEEN},{quoted:msg});
        if(text==='.نرد') return await client.sendMessage(from,{text:`🎲 @${sNum} طلعلك *${Math.floor(Math.random()*6)+1}*`,mentions:[sender]},{quoted:msg});
        if(text==='.قنبلة'){bombGame[from]=true; return await client.sendMessage(from,{text:`💣 اتزرعت @${sNum}`,mentions:[sender]},{quoted:msg});}
        if(text==='.فك'&&bombGame[from]){bombGame[from]=false; return await client.sendMessage(from,{text:`😎 @${sNum} فكها`,mentions:[sender]},{quoted:msg});}
        if(text.startsWith('.صفع')){
            const ctx=msg.message.extendedTextMessage?.contextInfo;
            const target=ctx?.participant||ctx?.mentionedJid?.[0];
            if(!target) return await client.sendMessage(from,{text:'⚠️ رد على رسالة الشخص'},{quoted:msg});
            await client.sendMessage(from,{text:`👋 @${sNum} يصفع @${target.split('@')[0]}!`,mentions:[sender,target]},{quoted:msg});
            try{const st=new Sticker(SLAP,{pack:'ساسكي',author:'صفع',type:StickerTypes.FULL}); const buf=await st.toBuffer(); await client.sendMessage(from,{sticker:buf});}catch(e){}
        }
    });
}
startBot();
