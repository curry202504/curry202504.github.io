document.addEventListener('DOMContentLoaded', function() {
    const reportContainer = document.getElementById('report-container');
    
    const reportId = sessionStorage.getItem('currentReportId');
    if (!reportId) {
        reportContainer.innerHTML = '<div class="quiz-card"><p>错误：找不到要显示的报告ID。请返回首页重试。</p></div>';
        return;
    }

    const history = JSON.parse(localStorage.getItem('sri_history')) || [];
    const reportData = history.find(record => record.id === reportId);

    if (!reportData) {
        reportContainer.innerHTML = '<div class="quiz-card"><p>错误：在本地存储中找不到对应的报告数据。</p></div>';
        return;
    }

    // --- 【新增】报告解读数据库 ---
    const INTERPRETATIONS = {
        'level-very-low': { // 0-19分
            interpretation: "您的性压抑指数非常低。这通常表明您拥有一个开放、接纳的性态度，能够轻松地探索和享受自己的性需求与欲望，内在冲突很少。",
            suggestions: [
                "继续保持积极开放的心态，与伴侣坦诚交流，共同探索更丰富的亲密体验。",
                "您的经验非常宝贵，可以适当与信任的朋友分享，帮助他们建立更健康的性观念。",
                "探索新的情趣或知识，让您的性生活保持新鲜感和活力。"
            ]
        },
        'level-low': { // 20-39分
            interpretation: "您的性压抑指数偏低。这说明您对性的态度比较健康和放松，大部分情况下能够正视并接纳自己的性感受，但偶尔可能还会受到一些传统观念或个人顾虑的轻微影响。",
            suggestions: [
                "识别并思考那些偶尔让您感到不适或犹豫的场景，了解其背后的原因。",
                "尝试阅读一些关于性心理健康的科学读物，进一步巩固和拓宽您的认知。",
                "鼓励自己进行更多关于“性”的积极对话，无论与伴侣还是朋友。"
            ]
        },
        'level-medium': { // 40-59分
            interpretation: "您的性压抑指数处于中等水平。这表明您在性心理方面存在一定的内在矛盾，既有开放探索的渴望，又受到了一些内疚、羞耻感或焦虑情绪的束缚，这是非常普遍的现象。",
            suggestions: [
                "学习并练习正念冥想，关注并接纳自身的身体反应与性幻想，不对其进行评判。",
                "尝试记录下那些引发您负面情绪的性想法，并理性分析它们是否真的有害。",
                "可以从观看一些高质量的、以女性或情感为中心的性教育影片开始，逐步脱敏。"
            ]
        },
        'level-mid-high': { // 60-79分
            interpretation: "您的性压抑指数偏高。这可能意味着您在成长过程中内化了较多关于性的负面观念，导致您在面对性话题或自身欲望时，经常体验到显著的焦虑、羞耻或内疚感。",
            suggestions: [
                "强烈建议您系统地阅读一些权威的性心理学书籍，重塑科学的性知识体系。",
                "寻求专业的心理咨询是打破恶性循环的非常有效的途径。",
                "从小步骤开始，例如，尝试独自一人时，更开放地探索自己的身体，建立积极的身体意象。"
            ]
        },
        'level-high': { // 80-100分
            interpretation: "您的性压抑指数非常高。这表明“性”对您来说可能是一个沉重的话题，与强烈的负罪感、羞耻感或恐惧感深度绑定。您可能很难接纳自己的性需求，甚至会主动回避相关话题。",
            suggestions: [
                "请务必认识到，这不是您的错，这通常是严格的社会文化或家庭教育环境造成的结果。",
                "第一步是寻求改变。强烈建议您寻找一位擅长性心理领域的专业心理咨询师进行系统咨询。",
                "在确保安全和隐私的情况下，尝试接触一些中性、科学的性教育材料，了解“性”的生物学和心理学基础。"
            ]
        }
    };

    function getSriLevelAndInterpretation(score) {
        if (score >= 80) return { text: '很高', className: 'level-high', ...INTERPRETATIONS['level-high'] };
        if (score >= 60) return { text: '偏高', className: 'level-mid-high', ...INTERPRETATIONS['level-mid-high'] };
        if (score >= 40) return { text: '中等', className: 'level-medium', ...INTERPRETATIONS['level-medium'] };
        if (score >= 20) return { text: '偏低', className: 'level-low', ...INTERPRETATIONS['level-low'] };
        return { text: '很低', className: 'level-very-low', ...INTERPRETATIONS['level-very-low'] };
    }

    const reportDetails = getSriLevelAndInterpretation(reportData.results.sriScore);

    const reportHTML = `
        <div class="report-card">
            <!-- 1. 总分展示 -->
            <div class="report-header">
                <div class="score-display">
                    <span class="score-title">性压抑指数 (SRI)</span>
                    <strong class="score-value">${reportData.results.sriScore}</strong>
                    <span class="score-level ${reportDetails.className}">${reportDetails.text}</span>
                </div>
                <div class="score-bar-container">
                    <div class="score-bar" style="width: ${reportData.results.sriScore}%;"></div>
                </div>
                <div class="score-bar-labels">
                    <span>0 (很低)</span><span>50 (中等)</span><span>100 (很高)</span>
                </div>
            </div>

            <!-- 2. 【已修改】动态结果解释 -->
            <div class="report-block">
                <h3>结果解释</h3>
                <p>${reportDetails.interpretation}</p>
            </div>
            
            <!-- 3. 【已修改】动态个性化建议 -->
            <div class="report-block">
                <h3>个性化建议</h3>
                <ul>
                    ${reportDetails.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    <li>记住这仅是一个自我探索工具，结果仅供参考，不构成诊断。</li>
                </ul>
            </div>

            <!-- 4. 四维度分析 -->
            <div class="report-block">
                <h3>四维度分析</h3>
                <div class="dimension-grid">
                    ${Object.entries(reportData.results.dimensionScores).map(([key, value]) => `
                        <div class="dimension-item">
                            <div class="dimension-label">
                                <span>${key.toUpperCase()}</span>
                                <strong>${value.toFixed(2)}</strong>
                            </div>
                            <div class="dimension-bar-container">
                                <div class="dimension-bar" style="width: ${(value / 5) * 100}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 5. 评估信息 -->
            <div class="report-block info-footer">
                <p><strong>评估类型:</strong> ${reportData.version} ${reportData.isTeen ? '(青少年适配)' : ''}</p>
                <p><strong>完成时间:</strong> ${new Date(reportData.date).toLocaleString('zh-CN')}</p>
                <p><strong>会话ID:</strong> ${reportData.id}</p>
            </div>
            
            <div class="report-nav">
                <a href="index.html" class="button secondary">返回首页</a>
                <button id="share-btn" class="button secondary">看看朋友的</button>
                <a href="quiz.html?version=${reportData.version}" class="button primary">重新测评</a>
            </div>
        </div>
    `;

    reportContainer.innerHTML = reportHTML;

    // 分享功能逻辑 (保持不变)
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', showShareModal);
    }

    function showShareModal() {
        // ... (这部分代码保持不变) ...
    }
});