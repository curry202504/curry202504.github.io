// 当整个网页的HTML结构都加载完成后，再执行我们的代码
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. 动态加载广告位 ---
    const adsContainer = document.getElementById('ads');

    if (adsContainer && adsData && adsData.length > 0) {
        adsData.forEach(ad => {
            const adButton = document.createElement('a');
            adButton.className = 'button secondary ad-button ' + (ad.className || '');
            adButton.textContent = ad.text;
            
            // 【已修改】如果广告有链接，则直接使用；否则使用 '#'
            adButton.href = ad.link || '#';

            // 给按钮添加点击事件
            adButton.addEventListener('click', function(event) {
                // 如果没有链接 (即我们想弹出图片)，才阻止默认行为
                if (!ad.link) {
                    event.preventDefault();

                    if (typeof gtag === 'function') {
                        gtag('event', 'ad_click', {
                            'event_category': 'Homepage Ads',
                            'event_label': ad.text,
                            'value': 1
                        });
                        console.log(`GA Event Sent: ad_click - ${ad.text}`);
                    }
                    showAdModal(ad.imageUrl, null); // 弹出图片
                }
                // 如果有链接，则不阻止默认行为，浏览器会自动跳转到 game.html
            });

            adsContainer.appendChild(adButton);
        });
    }

    function showAdModal(imageUrl, link) {
        // ... (这部分代码保持不变) ...
        const existingModal = document.getElementById('ad-modal');
        if (existingModal) {
            existingModal.remove();
        }
        const modal = document.createElement('div');
        modal.id = 'ad-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                ${link ? `<a href="${link}" target="_blank">` : ''}
                <img src="${imageUrl}" alt="广告图片">
                ${link ? `</a>` : ''}
            </div>
        `;
        document.body.appendChild(modal);
        const closeModalButton = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        closeModalButton.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', () => modal.remove());
    }
});