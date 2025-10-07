// === 广告位配置文件 ===
// 您未来只需要修改这里的内容，就可以更新网站上的广告
// text: 按钮上显示的文字
// imageUrl: 点击按钮后弹出的图片的路径 (图片需要放在 assets/images/ 文件夹里)
// link: (可选) 如果您希望弹出的图片本身可以点击跳转，请在这里填写网址
// className: (新增) 用于定义按钮特殊样式的CSS类名

const adsData = [
    {
        text: "♂️ 男生分数大于60点击",
        imageUrl: "assets/images/ad-image-1.jpeg",
        link: "",
        className: "ad-male" // 男生按钮的专属类名
    },
    {
        text: "♀️ 女生分数大于60点击",
        imageUrl: "assets/images/ad-image-2..jpeg", // 注意这里依然是两个点，匹配您上传的文件
        link: "",
        className: "ad-female" // 女生按钮的专属类名
    },
    {
        text: "☕ 制作不易感谢打赏",
        imageUrl: "assets/images/ad-image-3.jpeg",
        link: "",
        className: "ad-donate" // 打赏按钮的专属类名
    }
];