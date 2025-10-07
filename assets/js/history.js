// =======================================================================
// SRI-2025 历史记录页面逻辑
// =======================================================================

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. 获取页面上的元素 ---
    const recordsContainer = document.getElementById('records-container');
    const noRecordsDiv = document.querySelector('.no-records');

    // 总览数据元素
    const totalTestsEl = document.getElementById('total-tests');
    const completedTestsEl = document.getElementById('completed-tests');
    const averageSriEl = document.getElementById('average-sri');
    const testTypesEl = document.getElementById('test-types');

    // 功能按钮
    const exportJsonBtn = document.getElementById('export-json');
    const exportCsvBtn = document.getElementById('export-csv');
    const clearHistoryBtn = document.getElementById('clear-history');

    // --- 2. 加载并显示历史记录 ---
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('sri_history')) || [];
        
        // 如果没有记录，则直接返回，页面会显示 "您还没有任何测评记录"
        if (history.length === 0) {
            // 确保 "无记录" 的提示是可见的
            if (noRecordsDiv) noRecordsDiv.style.display = 'block';
            return;
        }

        // 如果有记录，则隐藏 "无记录" 的提示
        if (noRecordsDiv) noRecordsDiv.style.display = 'none';
        
        // 更新顶部的总览数据
        updateSummary(history);

        // 渲染测评记录列表 (倒序，让最新的记录在最上面)
        renderRecords(history.slice().reverse());
    }

    // --- 3. 更新顶部总览数据 ---
    function updateSummary(history) {
        const totalCount = history.length;
        totalTestsEl.textContent = totalCount;
        completedTestsEl.textContent = totalCount; // 假设所有保存的都是已完成的

        // 计算平均SRI指数
        if (totalCount > 0) {
            const totalSriScore = history.reduce((sum, record) => sum + record.results.sriScore, 0);
            averageSriEl.textContent = Math.round(totalSriScore / totalCount);
        } else {
            averageSriEl.textContent = '-';
        }

        // 统计测评类型
        const quickCount = history.filter(r => r.version === 'quick').length;
        const fullCount = totalCount - quickCount;
        testTypesEl.textContent = `快速: ${quickCount} / 完整: ${fullCount}`;
    }

    // --- 4. 渲染每一条测评记录 ---
    function renderRecords(history) {
        let recordsHTML = '';
        history.forEach(record => {
            const recordDate = new Date(record.date).toLocaleString('zh-CN');
            const versionText = record.version === 'quick' ? '快速测评' : '完整测评';
            const teenText = record.isTeen ? ' (青少年适配)' : '';
            const sriLevel = getSriLevel(record.results.sriScore);

            recordsHTML += `
                <div class="history-record-card">
                    <div class="record-main">
                        <div class="record-score ${sriLevel.className}">${record.results.sriScore}</div>
                        <div class="record-details">
                            <h4>${versionText}${teenText}</h4>
                            <p>${recordDate}</p>
                        </div>
                    </div>
                    <div class="record-actions">
                        <button class="button secondary view-report-btn" data-id="${record.id}">查看报告</button>
                    </div>
                </div>
            `;
        });
        recordsContainer.innerHTML = recordsHTML;

        // 为所有 "查看报告" 按钮添加点击事件
        document.querySelectorAll('.view-report-btn').forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                sessionStorage.setItem('currentReportId', reportId);
                window.location.href = 'report.html';
            });
        });
    }

    // --- 5. 绑定功能按钮的事件 ---
    
    // 清除所有记录
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('您确定要清除所有历史记录吗？此操作不可恢复。')) {
            localStorage.removeItem('sri_history');
            location.reload(); // 刷新页面
        }
    });

    // 导出 JSON
    exportJsonBtn.addEventListener('click', function() {
        const history = localStorage.getItem('sri_history');
        if (!history || history === '[]') {
            alert('没有可导出的记录。');
            return;
        }
        const blob = new Blob([history], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sri-history-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 导出 CSV
    exportCsvBtn.addEventListener('click', function() {
        const history = JSON.parse(localStorage.getItem('sri_history')) || [];
        if (history.length === 0) {
            alert('没有可导出的记录。');
            return;
        }

        // CSV表头
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // \uFEFF for BOM
        const headers = ['ID', '日期', '测评版本', '青少年适配', 'SRI分数', '年龄段', '性别认同', '亲密关系状态'];
        csvContent += headers.join(',') + '\r\n';

        // CSV内容
        history.forEach(record => {
            const row = [
                record.id,
                new Date(record.date).toLocaleString('zh-CN'),
                record.version,
                record.isTeen,
                record.results.sriScore,
                record.demographics.age,
                record.demographics.gender,
                record.demographics.relationship
            ];
            csvContent += row.join(',') + '\r\n';
        });

        const encodedUri = encodeURI(csvContent);
        const a = document.createElement('a');
        a.href = encodedUri;
        a.download = `sri-history-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // --- 辅助函数 ---
    
    // 从报告页逻辑中借鉴，用于显示分数等级
    function getSriLevel(score) {
        if (score >= 80) return { text: '很高', className: 'level-high' };
        if (score >= 60) return { text: '偏高', className: 'level-mid-high' };
        if (score >= 40) return { text: '中等', className: 'level-medium' };
        // 为了在CSS中生效，需要添加对应的 .level-low 和 .level-very-low 样式
        if (score >= 20) return { text: '偏低', className: 'level-low' }; 
        return { text: '很低', className: 'level-very-low' };
    }

    // --- 6. 页面加载时立即执行 ---
    loadHistory();

    // --- 7. 为历史记录卡片添加一些样式 (因为CSS文件中没有) ---
    const style = document.createElement('style');
    style.innerHTML = `
        .history-record-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--white);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .record-main {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        .record-score {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: var(--light-bg);
        }
        .record-score.level-high { background-color: #f8d7da; color: #842029; }
        .record-score.level-mid-high { background-color: #fff3cd; color: #664d03; }
        .record-score.level-medium { background-color: #cff4fc; color: #055160; }
        .record-score.level-low { background-color: #d1e7dd; color: #0f5132; }
        .record-score.level-very-low { background-color: #e2e3e5; color: #41464b; }

        .record-details h4 {
            margin: 0 0 0.25rem 0;
            font-size: 1.2rem;
        }
        .record-details p {
            margin: 0;
            color: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);
});