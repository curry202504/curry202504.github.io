// =======================================================================
// SRI-2025 测评引擎核心逻辑 (最终版)
// =======================================================================
document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const quizVersion = urlParams.get('version') || 'quick'; 

    const STAGES = { CONSENT: 'consent', DEMOGRAPHICS: 'demographics', QUIZ: 'quiz' };
    let currentStage = STAGES.CONSENT;
    
    let userDemographics = {};
    let isTeen = false;
    let userAnswers = {};
    let totalQuestions = 0;

    // ... (renderCurrentStage, renderConsentStage, renderDemographicsStage 函数保持不变) ...
    function renderCurrentStage() {
        quizContainer.innerHTML = '';
        switch (currentStage) {
            case STAGES.CONSENT: renderConsentStage(); break;
            case STAGES.DEMOGRAPHICS: renderDemographicsStage(); break;
            case STAGES.QUIZ: renderQuizStage(); break;
        }
    }
    function renderConsentStage() {
        const consentHTML = `<div class="quiz-card"><h2>知情同意书</h2><p class="subtitle">在开始前，请您仔细阅读并同意以下条款。</p><div class="consent-form"><div class="consent-item"><label><input type="checkbox" name="consent" value="purpose"><strong>评估目的:</strong> 我理解本评估旨在帮助我探索和了解自己的性心理特征，是一个自我探索工具。</label></div><div class="consent-item"><label><input type="checkbox" name="consent" value="privacy"><strong>隐私保护:</strong> 我理解我的所有回答将被完全匿名化，且数据仅保存在我的本地设备上，不会上传至任何服务器。</label></div><div class="consent-item"><label><input type="checkbox" name="consent" value="voluntary"><strong>自愿参与:</strong> 我理解参与本次评估完全是自愿的，我可以在任何时候无理由退出。</label></div><div class="consent-item"><label><input type="checkbox" name="consent" value="non-diagnostic"><strong>非诊断性质:</strong> 我理解本评估结果不构成医疗或心理诊断，不能替代专业心理咨询。</label></div><div class="consent-warning"><strong>重要提醒:</strong> 如果您目前正经历严重的心理困扰、抑郁、焦虑或有自伤倾向，请立即寻求专业心理健康服务。本评估不适用于急性心理危机人群。</div></div><div class="quiz-nav"><button id="consent-agree-btn" class="button primary" disabled>我已阅读并同意</button></div></div>`;
        quizContainer.innerHTML = consentHTML;
        const agreeBtn = document.getElementById('consent-agree-btn');
        const checkboxes = document.querySelectorAll('input[name="consent"]');
        function checkAllConsented() { agreeBtn.disabled = !Array.from(checkboxes).every(cb => cb.checked); }
        checkboxes.forEach(cb => cb.addEventListener('change', checkAllConsented));
        agreeBtn.addEventListener('click', () => { currentStage = STAGES.DEMOGRAPHICS; renderCurrentStage(); });
    }
    function renderDemographicsStage() {
        const demographicsHTML = `<div class="quiz-card"><h2>基本信息</h2><p class="subtitle">请提供一些基本信息，这将帮助我们提供更准确的结果分析。</p><form id="demographics-form"><div class="form-group"><label>您的年龄段 <span class="required">*</span></label><select name="age" required><option value="">请选择</option><option value="<18">14-17岁</option><option value="18-24">18-24岁</option><option value="25-34">25-34岁</option><option value="35-44">35-44岁</option><option value="45-54">45-54岁</option><option value="55+">55岁以上</option></select></div><div class="form-group"><label>您的性别认同 <span class="required">*</span></label><select name="gender" required><option value="">请选择</option><option value="male">男性</option><option value="female">女性</option><option value="non-binary">非二元性别</option><option value="prefer_not_to_say">不愿回答</option></select></div><div class="form-group"><label>您目前的亲密关系状态 <span class="required">*</span></label><select name="relationship" required><option value="">请选择</option><option value="single">单身</option><option value="dating">恋爱中</option><option value="married_cohabiting">已婚/同居</option><option value="prefer_not_to_say">不愿回答</option></select></div><div class="form-group-privacy"><p><strong>隐私保护:</strong> 以上信息仅用于提供个性化结果分析，所有数据均在您的设备本地处理，不会上传至任何服务器。</p></div></form><div class="quiz-nav"><button id="demographics-next-btn" class="button primary">继续评估</button></div></div>`;
        quizContainer.innerHTML = demographicsHTML;
        const nextBtn = document.getElementById('demographics-next-btn');
        const form = document.getElementById('demographics-form');
        nextBtn.addEventListener('click', () => {
            if (form.checkValidity()) {
                const formData = new FormData(form);
                userDemographics = Object.fromEntries(formData.entries());
                if (userDemographics.age === '<18') { isTeen = true; console.log("用户年龄小于18，已标记为青少年用户。"); }
                currentStage = STAGES.QUIZ; renderCurrentStage();
            } else { form.reportValidity(); }
        });
    }
    
    // --- 渲染阶段 3: 问卷答题 ---
    function renderQuizStage() {
        const questionSet = QUESTION_DATABASE[quizVersion];
        if (!questionSet) { quizContainer.innerHTML = `<div class="quiz-card"><p>错误：找不到版本为 "${quizVersion}" 的题库。</p></div>`; return; }
        totalQuestions = questionSet.reduce((acc, scale) => acc + scale.questions.length, 0);
        const options = [{ text: '非常不同意', value: 1 }, { text: '不同意', value: 2 }, { text: '中性', value: 3 }, { text: '同意', value: 4 }, { text: '非常同意', value: 5 }];
        const versionLabel = isTeen ? ` <span class="teen-badge">青少年适配版</span>` : '';
        let quizHTML = `<div id="quiz-progress-stats" class="summary-cards"><div class="summary-card"><span class="label">已回答</span><strong id="answered-count">0</strong></div><div class="summary-card"><span class="label">未回答</span><strong id="unanswered-count">${totalQuestions}</strong></div><div class="summary-card"><span class="label">总题数</span><strong>${totalQuestions}</strong></div></div><form id="quiz-form">`;
        questionSet.forEach(scale => {
            quizHTML += `<div class="quiz-card scale-card"><h3>${scale.name}${versionLabel}</h3><p class="subtitle">${scale.description}</p>`;
            scale.questions.forEach((q, index) => {
                quizHTML += `<div class="question-card" id="card-${q.id}"><p class="question-text"><strong>${index + 1}.</strong> ${q.text}</p><div class="options-group">${options.map(opt => `<label class="option-label"><input type="radio" name="${q.id}" value="${opt.value}" required><span>${opt.text}</span></label>`).join('')}</div></div>`;
            });
            quizHTML += `</div>`;
        });
        quizHTML += `</form><div class="quiz-nav"><button id="finish-quiz-btn" class="button primary" disabled>完成评估并查看结果</button></div>`;
        quizContainer.innerHTML = quizHTML;
        const quizForm = document.getElementById('quiz-form');
        quizForm.addEventListener('change', (event) => {
            if (event.target.type === 'radio') {
                userAnswers[event.target.name] = Number(event.target.value);
                document.getElementById(`card-${event.target.name}`).classList.add('answered');
                updateProgress();
            }
        });
        document.getElementById('finish-quiz-btn').addEventListener('click', handleFinishQuiz);
    }

    function updateProgress() {
        const answeredCount = Object.keys(userAnswers).length;
        document.getElementById('answered-count').textContent = answeredCount;
        document.getElementById('unanswered-count').textContent = totalQuestions - answeredCount;
        const finishBtn = document.getElementById('finish-quiz-btn');
        if (finishBtn) { finishBtn.disabled = answeredCount !== totalQuestions; }
    }

    // --- [新增] 完成评估的处理函数 ---
    function handleFinishQuiz() {
        if (Object.keys(userAnswers).length !== totalQuestions) {
            alert("您还有未完成的题目，请检查并全部作答后再提交。");
            return;
        }

        // 1. 计算结果
        const results = calculateResults();

        // 2. 保存记录
        const recordId = saveTestRecord(results);

        // 3. 跳转到报告页
        // 我们将新生成的记录ID存入 sessionStorage，报告页会读取它来展示对应的报告
        sessionStorage.setItem('currentReportId', recordId);
        window.location.href = 'report.html';
    }

    // --- [新增] 结果计算函数 (目前为简化版) ---
    function calculateResults() {
        // !!重要提示!! 这里的计分逻辑是一个非常简化的示例，
        // 实际的计分算法需要根据心理测量学的严谨公式来编写。
        let totalScore = 0;
        let dimensionScores = {};

        for (const questionId in userAnswers) {
            totalScore += userAnswers[questionId];
        }

        // 简化的SRI总分，映射到0-100范围
        const maxScore = totalQuestions * 5;
        const sriScore = Math.round((totalScore / maxScore) * 100);

        // 简化的维度得分 (这里仅为示例，并未按维度计算)
        dimensionScores = {
            sos: Math.random() * 5,
            shame: Math.random() * 5,
            guilt: Math.random() * 5,
            sis_ses: Math.random() * 5,
        };

        return {
            sriScore: sriScore,
            dimensionScores: dimensionScores,
            // 更多详细的计分结果...
        };
    }

    // --- [新增] 保存测试记录到本地存储 ---
    function saveTestRecord(results) {
        // 创建一个唯一的ID
        const recordId = `sri_${new Date().getTime()}`;

        const newRecord = {
            id: recordId,
            version: quizVersion,
            isTeen: isTeen,
            date: new Date().toISOString(),
            demographics: userDemographics,
            answers: userAnswers,
            results: results
        };

        // 从本地存储获取旧的记录
        let history = JSON.parse(localStorage.getItem('sri_history')) || [];
        // 添加新记录
        history.push(newRecord);
        // 保存回本地存储
        localStorage.setItem('sri_history', JSON.stringify(history));

        console.log("新记录已保存:", newRecord);
        return recordId;
    }

    // 初始化
    renderCurrentStage();
});