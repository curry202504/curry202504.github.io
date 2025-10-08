// =======================================================================
// SRI-2025 主逻辑文件 (V4.1 - 修复广告按钮GA事件跟踪)
// =======================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 模块一：首页广告逻辑 ---
    // 【页面卫士】确保这部分逻辑只在首页 (index.html) 运行
    const adsContainer = document.getElementById('ads');
    if (adsContainer) {
        if (typeof adsData !== 'undefined' && adsData.length > 0) {
            adsData.forEach(ad => {
                const adButton = document.createElement('a');
                adButton.className = 'button secondary ad-button ' + (ad.className || '');
                adButton.textContent = ad.text;
                adButton.href = ad.link || '#';

                adButton.addEventListener('click', function(event) {
                    // --- 【核心修改】把GA事件移到外面，确保每次点击都发送 ---
                    if (typeof gtag === 'function') {
                        gtag('event', 'ad_button_click', { // 创建一个统一的事件名称
                            'event_category': 'Homepage Ads',
                            'event_label': ad.text, // 用按钮的文本作为标签，这样就能区分是哪个按钮了
                        });
                    }
                    // --- 修改结束 ---

                    // 只有当没有链接时，才阻止默认跳转行为
                    if (!ad.link) {
                        event.preventDefault();
                        showAdModal(ad.imageUrl);
                    }
                });
                adsContainer.appendChild(adButton);
            });
        }

        function showAdModal(imageUrl) {
            const existingModal = document.getElementById('ad-modal');
            if (existingModal) existingModal.remove();
            
            const modal = document.createElement('div');
            modal.id = 'ad-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img src="${imageUrl}" alt="广告图片">
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        }
    }

    // --- 模块二：测评引擎逻辑 ---
    // 【页面卫士】确保这部分逻辑只在测试页 (quiz.html) 运行
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const quizVersion = urlParams.get('version') || 'quick'; 

        const STAGES = { CONSENT: 'consent', DEMOGRAPHICS: 'demographics', QUIZ: 'quiz' };
        let currentStage = STAGES.CONSENT;
        
        let userDemographics = {};
        let isTeen = false;
        let userAnswers = {};
        let totalQuestions = 0;

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
                    if (userDemographics.age === '<18') { isTeen = true; }
                    currentStage = STAGES.QUIZ; renderCurrentStage();
                } else { form.reportValidity(); }
            });
        }

        function renderQuizStage() {
            if (typeof QUESTION_DATABASE === 'undefined') {
                quizContainer.innerHTML = `<div class="quiz-card"><p>错误：题库文件 (questions.js) 加载失败，请检查文件路径或网络连接。</p></div>`;
                return;
            }
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

        function handleFinishQuiz() {
            if (Object.keys(userAnswers).length !== totalQuestions) {
                alert("您还有未完成的题目，请检查并全部作答后再提交。");
                return;
            }
            try {
                const results = calculateResults();
                const recordId = saveTestRecord(results);
                sessionStorage.setItem('currentReportId', recordId);
                window.location.href = 'report.html';
            } catch (error) {
                console.error("处理评估结果时发生错误:", error);
                quizContainer.innerHTML = `<div class="quiz-card"><p>抱歉，生成报告时发生内部错误。请尝试清除浏览器缓存后重试。</p><p>错误详情: ${error.message}</p></div>`;
            }
        }

        function calculateResults() {
            const questionSet = QUESTION_DATABASE[quizVersion];
            let allQuestions = [];
            questionSet.forEach(scale => { allQuestions = allQuestions.concat(scale.questions); });
            let dimensionTotals = {};
            let dimensionCounts = {};
            for (const questionId in userAnswers) {
                const answerValue = userAnswers[questionId];
                const question = allQuestions.find(q => q.id === questionId);
                if (question) {
                    const dimension = question.dimension;
                    if (!dimensionTotals[dimension]) {
                        dimensionTotals[dimension] = 0;
                        dimensionCounts[dimension] = 0;
                    }
                    dimensionTotals[dimension] += answerValue;
                    dimensionCounts[dimension] += 1;
                }
            }
            let dimensionScores = {};
            for (const dim in dimensionTotals) {
                dimensionScores[dim] = dimensionTotals[dim] / dimensionCounts[dim];
            }
            const shameScore = dimensionScores['shame'] || 0;
            const guiltScore = dimensionScores['guilt'] || 0;
            const sis1Score = dimensionScores['sis1'] || 0;
            const sis2Score = dimensionScores['sis2'] || 0;
            const sesScore = dimensionScores['ses'] || 0;
            const sosScore = 5 - (dimensionScores['sos'] || 5); 
            const weightedSum = (shameScore * 0.3) + (guiltScore * 0.3) + (sis1Score * 0.1) + (sis2Score * 0.1) + (sosScore * 0.2) - (sesScore * 0.1);
            let sriScore = Math.round(((weightedSum - 0.5) / (4.9 - 0.5)) * 100);
            if (sriScore < 0) sriScore = 0;
            if (sriScore > 100) sriScore = 100;
            return { sriScore: sriScore, dimensionScores: dimensionScores };
        }

        function saveTestRecord(results) {
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
            let history = JSON.parse(localStorage.getItem('sri_history')) || [];
            history.push(newRecord);
            localStorage.setItem('sri_history', JSON.stringify(history));
            return recordId;
        }
        
        // 初始化测评逻辑
        renderCurrentStage();
    }
});