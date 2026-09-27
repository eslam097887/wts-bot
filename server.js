const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const express = require('express');

// 🌐 سيرفر Express لإبقاء البوت شغال 24/7 على Replit
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('👑 بوت ساسكي شغال بنجاح!'));
app.listen(PORT, () => console.log(`🚀 السيرفر شغال على المنفذ ${PORT}`));

// 👑 رقم القائد (صاحب البوت)
const OWNER_NUMBER = '201274934730';
const OWNER_JID = `${OWNER_NUMBER}@s.whatsapp.net`;
const SLAP_STICKER_URL = 'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif';

// 🖼️ رابط صورة قائمة ساسكي
const MENU_IMAGE_URL = 'https://i.ibb.co/3kWy9Ym/sasuke.jpg';

const MENU_MAIN = `👑『 بوت القائد اسلام 』👑

╭─ • ────────── • ─╮
│ 📜.قوانين - القوانين
│ 🎮.العاب - قايمة الالعاب
│ 🛠️.ادوات - قايمة الادوات
│ ⚙️.ادارة - قايمة الادارة
│ 🧠.معلومات - معلومات البوت
│ 👑.المطور - القائد
╰─ • ────────── • ─╯
تصميم : القائد اسلام 👑`;

const MENU_AL3AB = `🎮『 قايمة الألعاب 』🎮

╭─ • ────────── • ─╮
│ 💣.قنبلة
│ 🕵️.حرامي - مين الحرامي
│ 🔫.روليت - روليت روسي
│ ❌.اكس او
│ 💥.تفجير - فجر الجروب
│ 🎲.نرد
│ 🪜.سلم
│ 👋.صفع - صفع عضو
╰─ • ────────── • ─╯`;

const MENU_ADWAT = `🛠️『 قايمة الأدوات 』🛠️

╭─ • ────────── • ─╮
│ 🎨.ملصق - تحويل لصورة/ملصق
│ 🌐.ترجمة
│ 🌤️.طقس
╰─ • ────────── • ─╯`;

const MENU_EDARA = `⚙️『 قايمة الإدارة 』⚙️

╭─ • ────────── • ─╮
│ 🛑.طرد - طرد عضو
│ 🔒.قفل - قفل الجروب
╰─ • ────────── • ─╯`;

const MENU_QAWANEEN = `📜『 قوانين الجروب 』📜

╭─ • ────────── • ─╮
│ 1- ممنوع تدخل خاص لبنت=طرد
│ 2- ممنوع اللينكات = بان نهائي
│ 3- الاحترام فوق كل حاجة
│ 4- احترام القائد اسلام 👑
╰─ • ────────── • ─╯`;

const messages = [
    "*`♡ يا مُقلب القلوب ثبّت قلبي على دينك.`*",
    "*`♡ سبحان الله وبحمده، سبحان الله العظيم.`*",
    "*`♡ ربنا آتنا في الدنيا حسنة، وفي الآخرة حسنة، وقنا عذاب النار.`*",
    "*`♡ اللهم اغفر لنا ذنوبنا.`*",
    "*`♡ اللهم ارحمنا برحمتك.`*",
    "*`♡ اللهم ارزقنا رزقًا حلالًا.`*",
    "*`♡ اللهم اهدنا إلى صراطك المستقيم.`*",
    "*`♡ اللهم أعنا على ذكرك وشكرك وحسن عبادتك.`*",
    "*`♡ اللهم استرنا فوق الأرض وتحت الأرض ويوم العرض عليك.`*",
    "*`♡ اللهم إنا نسألك العفو والعافية في الدنيا والآخرة.`*",
    "*`♡ اللهم إنا نعوذ بك من عذاب القبر ومن عذاب النار.`*",
    "*`♡ اللهم إنا نسألك الجنة وما قرب إليها من قول أو عمل.`*",
    "*`♡ اللهم إنا نعوذ بك من الهم والحزن والعجز والكسل.`*",
    "*`♡ اللهم ثبت قلوبنا على دينك.`*",
    "*`♡ اللهم يسر لنا أمورنا.`*",
    "*`♡ اللهم اشفنا شفاءً لا يغادر سقمًا.`*",
    "*`♡ اللهم فرج همومنا ويسر أمورنا.`*",
    "*`♡ اللهم اجعلنا من عبادك الصالحين.`*",
    "*`♡ اللهم إنا نسألك من فضلك ورحمتك.`*",
    "*`♡ اللهم إنا نسألك الهدى والتقى والعفاف والغنى.`*",
    "*`♡ اللهم اجعل القرآن ربيع قلوبنا.`*",
    "*`♡ اللهم ارزقنا حسن الخاتمة.`*",
    "*`♡ اللهم إنا نسألك التوفيق والسداد.`*",
    "*`♡ اللهم إنا نعوذ بك من شر أنفسنا وشر الشيطان.`*",
    "*`♡ اللهم اجعلنا من أهل الجنة.`*",
    "*`♡ اللهم إنا نسألك علما نافعا ورزقا طيبا وعملا متقبلا.`*",
    "*`♡ اللهم إنا نسألك الثبات في الأمر والعزيمة على الرشد.`*",
    "*`♡ اللهم إنا نسألك موجبات رحمتك وعزائم مغفرتك.`*",
    "*`♡ اللهم إنا نسألك قلوبا سليمة وألسنة صادقة.`*",
    "*`♡ اللهم إنا نسألك خير ما سألك به عبادك وأنبياؤك.`*",
    "*`♡ اللهم إنا نعوذ بك من شر ما استعاذ منه عبادك وأنبياؤك.`*",
    "*`♡ اللهم إنا نسألك الجنة وما قرب إليها من قول أو عمل، ونعوذ بك من النار وما قرب إليها من قول أو عمل.`*",
    "*`♡ اللهم إنا نسألك أن تجعل كل قضاء قضيته لنا خيرا.`*",
    "*`♡ اللهم إنا نسألك من الخير كله عاجله وآجله، ما علمنا منه وما لم نعلم، ونعوذ بك من الشر كله عاجله وآجله، ما علمنا منه وما لم نعلم.`*",
    "*`♡ اللهم إنا نسألك فواتح الخير وخواتمه وجوامعه وأوله وآخره وظاهره وباطنه والدرجات العلى من الجنة آمين.`*",
    "*`♡ اللهم إنا نسألك خير المسألة وخير الدعاء وخير النجاح وخير العمل وخير الثواب وخير الحياة وخير الممات وثبتنا وثقل موازيننا وحقق إيماننا وارفع درجاتنا وتقبل صلاتنا واغفر خطيئاتنا ونسألك الدرجات العلى من الجنة آمين.`*",
    "*`♡ ربنا لا تؤاخذنا إن نسينا أو أخطأنا.`*",
    "*`♡ ربنا هب لنا من أزواجنا وذرياتنا قرة أعين واجعلنا للمتقين إماما.`*",
    "*`♡ رب اشرح لي صدري ويسر لي أمري.`*",
    "*`♡ لا إله إلا أنت سبحانك إني كنت من الظالمين.`*",
];

let isEnabled = true;
let bombGame = {};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const client = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    if (!client.authState.creds.registered) {
        const phoneNumber = await question('📱 أدخل رقم هاتف البوت مع رمز الدولة (مثال: 201274934730): ');
        const code = await client.requestPairingCode(phoneNumber.trim());
        console.log(`\n========================================`);
        console.log(`🔑 كود الاقتران المكون من 8 أرقام: \x1b[32m${code}\x1b[0m`);
        console.log(`========================================\n`);
    }

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('تم إغلاق الاتصال، جارٍ إعادة المحاولة...', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('👑 بوت ساسكي (القائد اسلام) جاهز 🔥');
        }
    });

    // الإرسال التلقائي للأدعية والصلاة على النبي
    async function sendAutoDua() {
        if (!isEnabled) return;
        try {
            const chats = await client.groupFetchAllParticipating();
            const msg = messages[Math.floor(Math.random() * messages.length)];
            for (let id in chats) {
                await client.sendMessage(id, { text: msg });
            }
        } catch (e) {}
    }

    async function sendSalatNabi() {
        if (!isEnabled) return;
        try {
            const chats = await client.groupFetchAllParticipating();
            for (let id in chats) {
                await client.sendMessage(id, { text: "*`❤️ صلي على النبي ﷺ ❤️`*" });
            }
        } catch (e) {}
    }

    setInterval(sendAutoDua, 3600000); // كل ساعة
    setInterval(sendSalatNabi, 600000); // كل 10 دقائق

    // استقبال الرسائل والأوامر
    client.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        if (!isGroup) return;

        const body = msg.message.conversation || 
                     msg.message.extendedTextMessage?.text || '';
        const text = body.trim();
        const lowerText = text.toLowerCase();
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNum = sender.split('@')[0];
        const isOwner = sender.replace(/[^0-9]/g, '') === OWNER_NUMBER;
        const title = isOwner ? 'يا قائد  سولوم 👑' : 'يا غالي ✨';

        const getTargetUser = () => {
            const contextInfo = msg.message.extendedTextMessage?.contextInfo;
            if (contextInfo?.participant) return contextInfo.participant;
            if (contextInfo?.mentionedJid && contextInfo.mentionedJid.length > 0) return contextInfo.mentionedJid[0];
            return null;
        };

        // أمر التحكم في الإرسال التلقائي
        if (['تلقائي', '.تلقائي', 'ايقاف', '.ايقاف'].includes(text)) {
            if (!isOwner) {
                return await client.sendMessage(from, { text: '👑 الأمر ده للقائد سولوم بس' }, { quoted: msg });
            }
            isEnabled = !isEnabled;
            return await client.sendMessage(from, { 
                text: isEnabled ? "✅ *تم تشغيل الإرسال التلقائي *" : "⛔ *تم إيقاف الإرسال التلقائي*" 
            }, { quoted: msg });
        }

        // الأوامر والقوائم المعتمدة على المُناداة بـ .ساسكي (صورة + القائمة في رسالة واحدة)
        if (isOwner && ['.ساسكي', 'ساسكي', '.قايمة'].includes(lowerText)) {
            return await client.sendMessage(from, { 
                image: { url: MENU_IMAGE_URL },
                caption: `نعم يا حبيبي اؤمرني 👑🔥\n\n${MENU_MAIN}` 
            }, { quoted: msg });
        }

        if (['.ساسكي', 'ساسكي', '.قايمة', 'قايمة'].includes(lowerText)) {
            return await client.sendMessage(from, { 
                image: { url: MENU_IMAGE_URL },
                caption: MENU_MAIN 
            }, { quoted: msg });
        }

        if (text === '.العاب') return await client.sendMessage(from, { text: MENU_AL3AB }, { quoted: msg });
        if (text === '.ادوات') return await client.sendMessage(from, { text: MENU_ADWAT }, { quoted: msg });
        if (text === '.ادارة') return await client.sendMessage(from, { text: MENU_EDARA }, { quoted: msg });
        if (text === '.قوانين') return await client.sendMessage(from, { text: MENU_QAWANEEN }, { quoted: msg });
        if (text === '.معلومات') {
            return await client.sendMessage(from, { 
                text: `🤖 بوت ساسكي (القائد اسلام) 👑\n⏰ شغال 24 ساعة\n👑 تصميم القائد اسلام\n💬 عدد الادعية: ${messages.length}` 
            }, { quoted: msg });
        }
        if (text === '.المطور') {
            return await client.sendMessage(from, { 
                text: `👑 القائد اسلام ملك الجروب @${OWNER_NUMBER}`, 
                mentions: [OWNER_JID] 
            }, { quoted: msg });
        }

        // التفاعل والردود التلقائية
        if (lowerText.includes('ازيك يا ساسكي') || lowerText.includes('إزيك يا ساسكي')) {
            return await client.sendMessage(from, { text: `الحمدلله يا قلب البوت، انت ازيك ${title}؟ ❤️` }, { quoted: msg });
        } else if (lowerText === 'يا ساسكي') {
            return await client.sendMessage(from, { text: `نعم ${title}! أؤمرني، لو عايز الأوامر اكتب *.ساسكي* 🤖` }, { quoted: msg });
        }

        // أمر الصفع بالملصق
        if (text.startsWith('.صفع')) {
            const target = getTargetUser();
            if (!target) {
                return await client.sendMessage(from, { text: '⚠️ يرجى استخدام الأمر بالرد على رسالة الشخص أو الإشارة إليه!' }, { quoted: msg });
            }
            try {
                await client.sendMessage(from, {
                    text: `👋 @\({senderNum} يصفع @\){target.split('@')[0]}!`,
                    mentions: [sender, target]
                }, { quoted: msg });

                const sticker = new Sticker(SLAP_STICKER_URL, {
                    pack: 'بوت ساسكي 👑',
                    author: 'صفع 💥',
                    type: StickerTypes.FULL
                });
                const buffer = await sticker.toBuffer();
                await client.sendMessage(from, { sticker: buffer });
            } catch (e) {
                await client.sendMessage(from, { text: '👋 💥 (تم الصفع!)' }, { quoted: msg });
            }
            return;
        }

        // باقي الألعاب
        if (text === '.قنبلة') {
            bombGame[from] = true;
            return await client.sendMessage(from, { 
                text: `💣 القنبلة اتزرعت @${senderNum} معاك 10 ثواني تكتب .فك والا هتنفجر 😂`, 
                mentions: [sender] 
            }, { quoted: msg });
        }

        if (text === '.فك' && bombGame[from]) {
            bombGame[from] = false;
            return await client.sendMessage(from, { 
                text: `😎 @${senderNum} فكهاا بطل 💪`, 
                mentions: [sender] 
            }, { quoted: msg });
        }

        if (text === '.نرد') {
            return await client.sendMessage(from, { 
                text: `🎲 @\({senderNum} رميت النرد طلعلك *\){Math.floor(Math.random() * 6) + 1}*`, 
                mentions: [sender] 
            }, { quoted: msg });
        }

        if (text === '.سلم') {
            return await client.sendMessage(from, { 
                text: `🪜 @\({senderNum} رميت السلم طلعلك *\){Math.floor(Math.random() * 6) + 1}*`, 
                mentions: [sender] 
            }, { quoted: msg });
        }

        if (text === '.روليت') {
            let r = Math.random() > 0.5 ? 'طاخ 💥 مت 😂💀' : 'تك 🔫 عشت يا محظوظ';
            return await client.sendMessage(from, { 
                text: `🔫 روليت روسي @\({senderNum} ->\){r}`, 
                mentions: [sender] 
            }, { quoted: msg });
        }

        if (text === '.حرامي' || text === '.مين الحرامي') {
            const groupMetadata = await client.groupMetadata(from);
            const participants = groupMetadata.participants;
            const random = participants[Math.floor(Math.random() * participants.length)];
            return await client.sendMessage(from, { 
                text: `🕵️ الحرامي هو @${random.id.split('@')[0]} 😂🔪`, 
                mentions: [random.id] 
            }, { quoted: msg });
        }

        if (text === '.تفجير') {
            return await client.sendMessage(from, { 
                text: `💥 بوووووم @${senderNum} فجر الجروب كله 😂💣`, 
                mentions: [sender] 
            }, { quoted: msg });
        }
    });

    // الترحيب بالأعضاء الجدد
    client.ev.on('group-participants.update', async (update) => {
        if (update.action === 'add') {
            const chat = update.id;
            for (let participant of update.participants) {
                let userNum = participant.split('@')[0];
                let isGirl = /ة$|سارة|مريم|ملك|نور|سما|حلا|جنا|ليلى|شهد/i.test(userNum);

                if (isGirl) {
                    await client.sendMessage(chat, { 
                        text: `نورتي الجروب يا وردة @${userNum} 👑💖\n📜 اكتبي .قوانين\n🎮 اكتبي .العاب`, 
                        mentions: [participant] 
                    });
                } else {
                    await client.sendMessage(chat, { 
                        text: `نورت الجروب يا الغالي @${userNum} 🦁🔥\n📜 اكتب .قوانين\n🎮 اكتب .العاب`, 
                        mentions: [participant] 
                    });
                }
            }
        }
    });
}

startBot();
