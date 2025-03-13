const modelImages = [];
const realImages = [];



for (let i = 1; i <= 1211; i++) {
    let index = String(i).padStart(8, "0"); // 转换成 4 位数，如 0001, 0002
    modelImages.push(`frames/${index}.jpg`);
}

for (let i = 0; i <= 1211; i++) {
    let index = String(i).padStart(8, "0"); // 转换成 8 位数，如 00000001
    realImages.push(`real_frames/${index}.jpg`);
}

const Audio = ["audio/new.wav"];


let currentIndex = 0;
const totalFrames = modelImages.length;
const imgElement = document.getElementById("image-display");
const audioPlayer = document.getElementById("audio-player");

let scrollTimeout = null;
let isRealImageVisible = false;





// preload
function preloadImages(imageArray) {
    imageArray.forEach(src => {
        const img = new Image();
        img.src = src;  // 让浏览器后台加载
    });
}


preloadImages(modelImages);
preloadImages(realImages);

// 初始图片
imgElement.style.Image = `url(${realImages[0]})`;


function glitchEffect() {
    // 确保音频被播放
    audioPlayer.play().catch((error) => console.log("音频播放失败:", error));

    let volume = 1;
    const glitchInterval = setInterval(() => {
        volume = (Math.random() > 0.5) ? 1 : 0.8; // 随机音量模拟 glitch
        audioPlayer.volume = volume;
        console.log('glitch')
    }, 50); // 每50ms改变一次音量

    // 停止 glitch 效果
    setTimeout(() => {
        clearInterval(glitchInterval);
        audioPlayer.volume = 0.1; // 恢复正常音量
    }, 2000); // 2秒后停止 glitch
}

function updateAudio() {
    if (!isRealImageVisible) {
        // Add glitch effect for model images
        glitchEffect();
    } else {
        audioPlayer.play().catch((error) => console.log("音频播放失败:", error)); // 播放正常音频
    }
}

window.addEventListener("click", () => {
    audioPlayer.play().catch(error => console.log("音频播放失败:", error));
}, { once: true }); // 确保只执行一次


// scroll
window.addEventListener("wheel", (event) => {
    clearTimeout(scrollTimeout);

    if (event.deltaY > 0 && currentIndex < totalFrames - 1) {
        currentIndex++;
    } else if (event.deltaY < 0 && currentIndex > 0) {
        currentIndex--;
    }

    // !!先加载新图片，确保不白屏
    const newImage = new Image();
    newImage.src = modelImages[currentIndex];
    newImage.onload = () => {
        imgElement.src = modelImages[currentIndex]; // 只有加载完才替换，避免闪烁
    };

    // **滚动停止后，插入真实图像**
    scrollTimeout = setTimeout(() => {
        if (!isRealImageVisible) {
            let realIndex = currentIndex % realImages.length;
            const realImage = new Image();
            realImage.src = realImages[realIndex];
            realImage.onload = () => {
                imgElement.src = realImages[realIndex];
                isRealImageVisible = true;
                updateAudio()
            };
        }
    }, 40); //wait seconds
    updateAudio()
});

// back to model
window.addEventListener("wheel", () => {
    if (isRealImageVisible) {
        const aiImage = new Image();
        aiImage.src = modelImages[currentIndex];
        aiImage.onload = () => {
            imgElement.src = modelImages[currentIndex];
            isRealImageVisible = false;

        };
    }
});