// =======================================================================
// SRI-2025 测评题库文件 (完整版 - 已扩充)
// =======================================================================

const QUESTION_DATABASE = {
    // ------------------- 快速测评版 (共39题) -------------------
    quick: [
        {
            id: 'sos_sf',
            name: '性观念量表 - 简版 (SOS-SF)',
            description: '评估您对不同性刺激的积极或消极情绪反应。',
            questions: [
                { id: 'sos_q1', text: '观看描绘情侣亲密爱抚的电影场面。', dimension: 'sos' },
                { id: 'sos_q2', text: '与伴侣进行持续、深情的亲吻。', dimension: 'sos' },
                { id: 'sos_q3', text: '想象自己参与一场“幻想中”的性爱场景。', dimension: 'sos' },
                { id: 'sos_q4', text: '阅读一本详细描写性爱细节的言情小说。', dimension: 'sos' },
                { id: 'sos_q5', text: '与伴侣进行口交。', dimension: 'sos' },
                { id: 'sos_q6', text: '与伴侣在不同寻常的、但私密的地方做爱。', dimension: 'sos' }
            ]
        },
        {
            id: 'sis_ses_sf',
            name: '性抑制/性兴奋量表 - 简版 (SIS/SES-SF)',
            description: '评估您的性兴奋和性抑制系统的敏感性。',
            questions: [
                { id: 'ses_q1', text: '当我看到有吸引力的人时，我很容易产生性幻想。', dimension: 'ses' },
                { id: 'ses_q2', text: '性的氛围或故事很容易让我兴奋。', dimension: 'ses' },
                { id: 'ses_q3', text: '仅仅是想到可以和我喜欢的人做爱就能让我兴奋。', dimension: 'ses' },
                { id: 'ses_q4', text: '当我闻到我伴侣独特的气味时，我会被唤起。', dimension: 'ses' },
                { id: 'ses_q5', text: '一想到触摸我的伴侣，我就会兴奋起来。', dimension: 'ses' },
                { id: 'sis1_q1', text: '如果我担心性表现不佳，我就很难兴奋起来。', dimension: 'sis1' },
                { id: 'sis1_q2', text: '如果我有压力，我就很难有性唤起。', dimension: 'sis1' },
                { id: 'sis1_q3', text: '当我感到焦虑或紧张时，我很难被唤起。', dimension: 'sis1' },
                { id: 'sis2_q1', text: '如果我觉得有被评价的风险，我就很难兴奋起来。', dimension: 'sis2' },
                { id: 'sis2_q2', text: '如果环境让我感到不舒服或不安全，我几乎不可能兴奋。', dimension: 'sis2' },
                { id: 'sis2_q3', text: '如果伴侣给我一种冷淡的感觉，我就很难被唤起。', dimension: 'sis2' }
            ]
        },
        {
            id: 'mosher_guilt_sf',
            name: 'Mosher性内疚量表 - 简版',
            description: '评估与性相关的内疚情绪。',
            questions: [
                { id: 'mg_q1', text: '婚前性行为是不道德的。', dimension: 'guilt' },
                { id: 'mg_q2', text: '想到“非传统”的性行为会让我感到内疚。', dimension: 'guilt' },
                { id: 'mg_q3', text: '自慰是一种不健康的行为。', dimension: 'guilt' },
                { id: 'mg_q4', text: '坦白自己的性幻想会让我觉得不舒服。', dimension: 'guilt' },
                { id: 'mg_q5', text: '如果我的性想法被别人知道了，我会感到非常尴尬。', dimension: 'guilt' },
                { id: 'mg_q6', text: '我认为过多地考虑性是不对的。', dimension: 'guilt' },
                { id: 'mg_q7', text: '公开谈论性是不恰当的。', dimension: 'guilt' },
                { id: 'mg_q8', text: '我有时会因为自己的性欲而感到罪恶。', dimension: 'guilt' }
            ]
        },
        {
            id: 'kiss_shame_sf',
            name: 'KISS性羞耻量表 - 简版',
            description: '评估与性相关的羞耻体验和自我接纳程度。',
            questions: [
                { id: 'ks_q1', text: '我对自己身体在性方面的反应感到羞耻。', dimension: 'shame' },
                { id: 'ks_q2', text: '我觉得自己的性欲望是“不正常”或“有问题”的。', dimension: 'shame' },
                { id: 'ks_q3', text: '我很难接受自己是一个有性需求的人。', dimension: 'shame' },
                { id: 'ks_q4', text: '我认为自己在性方面是有缺陷的。', dimension: 'shame' },
                { id: 'ks_q5', text: '与他人相比，我感觉自己的性经历或想法很可悲。', dimension: 'shame' },
                { id: 'ks_q6', text: '谈论我的性感受会让我觉得自己很脆弱、很差劲。', dimension: 'shame' },
                { id: 'ks_q7', text: '我担心如果伴侣知道我真实的性想法，会看不起我。', dimension: 'shame' },
                { id: 'ks_q8', text: '我觉得购买安全套或避孕产品是一件令人难为情的事。', dimension: 'shame' }
            ]
        }
    ],

    // ------------------- 完整测评版 (共61题) -------------------
    full: [
        {
            id: 'sos_full',
            name: '性观念量表 - 完整版 (SOS)',
            description: '全面评估您对不同范围性刺激的积极或消极情绪反应。',
            questions: [
                { id: 'f_sos_q1', text: '观看描绘情侣亲密爱抚的电影场面。', dimension: 'sos' },
                { id: 'f_sos_q2', text: '与伴侣进行持续、深情的亲吻。', dimension: 'sos' },
                { id: 'f_sos_q3', text: '想象自己参与一场“幻想中”的性爱场景。', dimension: 'sos' },
                { id: 'f_sos_q4', text: '阅读一本详细描写性爱细节的言情小说。', dimension: 'sos' },
                { id: 'f_sos_q5', text: '与伴侣进行口交。', dimension: 'sos' },
                { id: 'f_sos_q6', text: '与伴侣在不同寻常的、但私密的地方做爱。', dimension: 'sos' },
                { id: 'f_sos_q7', text: '讨论关于性的话题。', dimension: 'sos' },
                { id: 'f_sos_q8', text: '看到裸体艺术作品。', dimension: 'sos' },
                { id: 'f_sos_q9', text: '被一个有吸引力的陌生人搭讪。', dimension: 'sos' },
                { id: 'f_sos_q10', text: '与伴侣尝试新的性爱姿势。', dimension: 'sos' },
                { id: 'f_sos_q11', text: '为自己或伴侣购买情趣用品。', dimension: 'sos' },
                { id: 'f_sos_q12', text: '收到带有性暗示的赞美。', dimension: 'sos' },
                { id: 'f_sos_q13', text: '观看一部评价很高的色情电影。', dimension: 'sos' },
                { id: 'f_sos_q14', text: '想象与同性发生亲密行为。', dimension: 'sos' },
                { id: 'f_sos_q15', text: '与朋友开关于性的善意玩笑。', dimension: 'sos' }
            ]
        },
        {
            id: 'sis_ses_full',
            name: '性抑制/性兴奋量表 - 完整版 (SIS/SES)',
            description: '全面评估您的性兴奋和各种情境下的性抑制敏感性。',
            questions: [
                { id: 'f_ses_q1', text: '当我看到有吸引力的人时，我很容易产生性幻想。', dimension: 'ses' },
                { id: 'f_ses_q2', text: '性的氛围或故事很容易让我兴奋。', dimension: 'ses' },
                { id: 'f_ses_q3', text: '仅仅是想到可以和我喜欢的人做爱就能让我兴奋。', dimension: 'ses' },
                { id: 'f_ses_q4', text: '当我闻到我伴侣独特的气味时，我会被唤起。', dimension: 'ses' },
                { id: 'f_ses_q5', text: '一想到触摸我的伴侣，我就会兴奋起来。', dimension: 'ses' },
                { id: 'f_ses_q6', text: '与伴侣的浪漫亲吻能迅速点燃我的欲望。', dimension: 'ses' },
                { id: 'f_ses_q7', text: '当我情绪高涨时，我的性欲也更容易被激发。', dimension: 'ses' },
                { id: 'f_ses_q8', text: '一个意想不到的、充满爱意的触摸能立刻让我兴奋。', dimension: 'ses' },
                { id: 'f_ses_q9', text: '我很容易通过视觉刺激（如伴侣的身体）而被唤起。', dimension: 'ses' },
                { id: 'f_ses_q10', text: '听到伴侣的声音或特定的话语就能让我产生性冲动。', dimension: 'ses' },
                { id: 'f_sis1_q1', text: '如果我担心性表现不佳，我就很难兴奋起来。', dimension: 'sis1' },
                { id: 'f_sis1_q2', text: '如果我有压力，我就很难有性唤起。', dimension: 'sis1' },
                { id: 'f_sis1_q3', text: '当我感到焦虑或紧张时，我很难被唤起。', dimension: 'sis1' },
                { id: 'f_sis1_q4', text: '如果我太在意取悦伴侣，反而会让自己难以兴奋。', dimension: 'sis1' },
                { id: 'f_sis1_q5', text: '如果我担心无法达到高潮，我的性趣就会下降。', dimension: 'sis1' },
                { id: 'f_sis1_q6', text: '在性爱过程中分心去想别的事情，会让我立刻“冷却”下来。', dimension: 'sis1' },
                { id: 'f_sis1_q7', text: '如果身体感到疲惫，我就完全没有性欲。', dimension: 'sis1' },
                { id: 'f_sis2_q1', text: '如果我觉得有被评价的风险，我就很难兴奋起来。', dimension: 'sis2' },
                { id: 'f_sis2_q2', text: '如果环境让我感到不舒服或不安全，我几乎不可能兴奋。', dimension: 'sis2' },
                { id: 'f_sis2_q3', text: '如果伴侣给我一种冷淡的感觉，我就很难被唤起。', dimension: 'sis2' },
                { id: 'f_sis2_q4', text: '如果担心怀孕或性病，我的性欲会大大降低。', dimension: 'sis2' },
                { id: 'f_sis2_q5', text: '如果我觉得做爱可能伤害到对方的感情，我就无法投入。', dimension: 'sis2' },
                { id: 'f_sis2_q6', text: '如果我感觉自己或伴侣的卫生状况不佳，我的性欲会消失。', dimension: 'sis2' },
                { id: 'f_sis2_q7', text: '在性爱中，突然的噪音或干扰会让我完全失去兴趣。', dimension: 'sis2' },
                { id: 'f_sis2_q8', text: '如果我认为这种性行为在道德上是错误的，我就无法兴奋。', dimension: 'sis2' }
            ]
        },
        {
            id: 'mosher_guilt_full',
            name: 'Mosher性内疚量表 - 完整版',
            description: '深入评估您在性行为、性幻想和性道德观念上的内疚感。',
            questions: [
                { id: 'f_mg_q1', text: '婚前性行为是不道德的。', dimension: 'guilt' },
                { id: 'f_mg_q2', text: '想到“非传统”的性行为会让我感到内疚。', dimension: 'guilt' },
                { id: 'f_mg_q3', text: '自慰是一种不健康的行为。', dimension: 'guilt' },
                { id: 'f_mg_q4', text: '坦白自己的性幻想会让我觉得不舒服。', dimension: 'guilt' },
                { id: 'f_mg_q5', text: '如果我的性想法被别人知道了，我会感到非常尴尬。', dimension: 'guilt' },
                { id: 'f_mg_q6', text: '我认为过多地考虑性是不对的。', dimension: 'guilt' },
                { id: 'f_mg_q7', text: '公开谈论性是不恰当的。', dimension: 'guilt' },
                { id: 'f_mg_q8', text: '我有时会因为自己的性欲而感到罪恶。', dimension: 'guilt' },
                { id: 'f_mg_q9', text: '我认为禁欲是值得赞扬的。', dimension: 'guilt' },
                { id: 'f_mg_q10', text: '看色情作品会让我有负罪感。', dimension: 'guilt' },
                { id: 'f_mg_q11', text: '性行为主要是为了生育，而不是为了快乐。', dimension: 'guilt' }
            ]
        },
        {
            id: 'kiss_shame_full',
            name: 'KISS性羞耻量表 - 完整版',
            description: '全面评估您对自己身体、性行为和性身份的羞耻感与接纳度。',
            questions: [
                { id: 'f_ks_q1', text: '我对自己身体在性方面的反应感到羞耻。', dimension: 'shame' },
                { id: 'f_ks_q2', text: '我觉得自己的性欲望是“不正常”或“有问题”的。', dimension: 'shame' },
                { id: 'f_ks_q3', text: '我很难接受自己是一个有性需求的人。', dimension: 'shame' },
                { id: 'f_ks_q4', text: '我认为自己在性方面是有缺陷的。', dimension: 'shame' },
                { id: 'f_ks_q5', text: '与他人相比，我感觉自己的性经历或想法很可悲。', dimension: 'shame' },
                { id: 'f_ks_q6', text: '谈论我的性感受会让我觉得自己很脆弱、很差劲。', dimension: 'shame' },
                { id: 'f_ks_q7', text: '我担心如果伴侣知道我真实的性想法，会看不起我。', dimension: 'shame' },
                { id: 'f_ks_q8', text: '我觉得购买安全套或避孕产品是一件令人难为情的事。', dimension: 'shame' },
                { id: 'f_ks_q9', text: '在性爱中发出声音会让我感到不自在。', dimension: 'shame' },
                { id: 'f_ks_q10', text: '我害怕因为自己的性偏好而被社会排斥。', dimension: 'shame' }
            ]
        }
    ]
};