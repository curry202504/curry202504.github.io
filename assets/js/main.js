// 当整个网页的HTML结构都加载完成后，再执行我们的代码
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. 动态加载广告位 ---
    const adsContainer = document.getElementById('ads');

    // 检查广告容器是否存在并且 adsData (来自config.js) 是否有内容
    if (adsContainer && adsData && adsData.length > 0) {
        adsData.forEach(ad => {
            // 为每个广告数据创建一个按钮 (a标签)
            const adButton = document.createElement('a');
            adButton.className = 'button secondary ad-button'; // 使用次要按钮样式
            adButton.textContent = ad.text;
            adButton.href = '#'; // 使用'#'防止页面跳转

            // 给按钮添加点击事件
            adButton.addEventListener('click', function(event) {
                event.preventDefault(); // 阻止'#'导致的页面跳动
                showAdModal(ad.imageUrl, ad.link); // 调用显示弹窗的函数
            });

            // 把创建好的按钮添加到广告容器里
            adsContainer.appendChild(adButton);
        });
    }

    // --- 2. 创建并管理广告弹窗 (Modal) ---
    function showAdModal(imageUrl, link) {
        // 检查页面上是否已经有弹窗了，有就先删掉
        const existingModal = document.getElementById('ad-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 创建弹窗的HTML结构
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

        // 把弹窗添加到网页的 body 中
        document.body.appendChild(modal);

        // 获取弹窗的关闭按钮和遮罩层
        const closeModalButton = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        // 点击关闭按钮或遮罩层时，关闭弹窗
        closeModalButton.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', () => modal.remove());
    }
});