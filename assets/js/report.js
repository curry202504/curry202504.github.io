document.addEventListener('DOMContentLoaded', function() {
    const reportContainer = document.getElementById('report-container');
    
    // 从 sessionStorage 获取当前要展示的报告ID
    const reportId = sessionStorage.getItem('currentReportId');
    if (!reportId) {
        reportContainer.innerHTML = '<div class="quiz-card"><p>错误：找不到要显示的报告ID。请返回首页重试。</p></div>';
        return;
    }

    // 从 localStorage 获取完整的历史记录
    const history = JSON.parse(localStorage.getItem('sri_history')) || [];
    const reportData = history.find(record => record.id === reportId);

    if (!reportData) {
        reportContainer.innerHTML = '<div class="quiz-card"><p>错误：在本地存储中找不到对应的报告数据。</p></div>';
        return;
    }

    // 根据分数获取评级
    function getSriLevel(score) {
        if (score >= 80) return { text: '很高', className: 'level-high' };
        if (score >= 60) return { text: '偏高', className: 'level-mid-high' };
        if (score >= 40) return { text: '中等', className: 'level-medium' };
        if (score >= 20) return { text: '偏低', className: 'level-low' };
        return { text: '很低', className: 'level-very-low' };
    }

    const sriLevel = getSriLevel(reportData.results.sriScore);

    const reportHTML = `
        <div class="report-card">
            <!-- 1. 总分展示 -->
            <div class="report-header">
                <div class="score-display">
                    <span class="score-title">性压抑指数 (SRI)</span>
                    <strong class="score-value">${reportData.results.sriScore}</strong>
                    <span class="score-level ${sriLevel.className}">${sriLevel.text}</span>
                </div>
                <div class="score-bar-container">
                    <div class="score-bar" style="width: ${reportData.results.sriScore}%;"></div>
                </div>
                <div class="score-bar-labels">
                    <span>0 (很低)</span><span>50 (中等)</span><span>100 (很高)</span>
                </div>
            </div>

            <!-- 2. 结果解释 -->
            <div class="report-block">
                <h3>结果解释</h3>
                <p>您的性压抑指数为 ${reportData.results.sriScore} 分，处于「${sriLevel.text}」水平。这表明您在性相关的心理体验方面可能存在一定程度的压抑。（此解释为示例，未来需根据真实分数范围填充更详细内容）</p>
            </div>
            
            <!-- 3. 个性化建议 -->
            <div class="report-block">
                <h3>个性化建议</h3>
                <ul>
                    <li>尝试阅读一些关于性心理健康的科学读物。</li>
                    <li>探索并接纳自身的性幻想与身体反应。</li>
                    <li>学习放松技巧，减少在性方面的焦虑和过度控制。</li>
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
                <a href="quiz.html?version=${reportData.version}" class="button primary">重新测评</a>
            </div>
        </div>
    `;

    reportContainer.innerHTML = reportHTML;
});