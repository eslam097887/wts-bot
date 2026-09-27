client.ev.on('group-participants.update', async (update) => {
        if (update.action === 'add') {
            const chat = update.id;
            const groupInfo = await client.groupMetadata(chat).catch(()=>null);
            const groupName = groupInfo?.subject || 'الجروب';
            for (let participant of update.participants) {
                let userNum = participant.split('@')[0];

                // 1- رسالة الترحيب في الجروب
                await client.sendMessage(chat, { text: `نورت الجروب @${userNum} 👑💖\nاكتب.قوانين`, mentions: [participant] });

                // 2- رسالة خاصة ليك انت يا قائد
                try{
                    await client.sendMessage(OWNER_JID, {
                        text: `👑 يا قائد اسلام\n\nفي حد جديد دخل ${groupName}\nرقمه: @${userNum}\nالجروب: ${chat}\n\nتاريخ الدخول: ${new Date().toLocaleString('ar-EG')}`,
                        mentions: [participant]
                    });
                }catch(e){ console.log('مقدرتش ابعت للخاص', e.message); }
            }
        }
    });
