// ===============================
// 歌曲配置
// ===============================
const tracks = [
    { id:1, file:"song/1.光阴独白.m4a", cover:"song/SongCover/1.jpg", lyrics:`<span class="line1">"风轻颂自由，<br></span><span class="line2">我倾听岁月温柔。"</span>`, title:"光阴独白" },
    { id:2, file:"song/2.夏夜最后的烟火.m4a", cover:"song/SongCover/2.jpg", lyrics:`<span class="line1">"原来不管世界多严苛，<br></span><span class="line2">可以脆弱，可以是不完美的"</span>`, title:"夏夜最后的烟火" },
    { id:3, file:"song/3.给电影人的情书.mp3", cover:"song/SongCover/3.jpg", lyrics:`<span class="line1">"何悲何哀，何必去愁与苦；<br></span><span class="line2">以身外身，做梦中梦。"</span>`, title:"给电影人的情书" },
    { id:4, file:"song/4.送你一朵小红花.m4a", cover:"song/SongCover/4.jpg", lyrics:`<span class="line1">"奖励你能感受<br></span><span class="line2">每个命运的挣扎"</span>`, title:"送你一朵小红花" },
    { id:5, file:"song/5.追光者.mp3", cover:"song/SongCover/5.jpg", lyrics:`<span class="line1">"你看我，多么渺小一个我，<br></span><span class="line2">因为你有梦可做"</span>`, title:"追光者" },
    { id:6, file:"song/6.私奔.m4a", cover:"song/SongCover/6.jpg", lyrics:`<span class="line1">"去最浪漫最动人<br></span><span class="line2">但别人不知道的地方啊"</span>`, title:"私奔" },
    { id:7, file:"song/7.时光正好.mp3", cover:"song/SongCover/7.jpg", lyrics:`<span class="line1">"我一直等在告别的那天，<br></span><span class="line2">你不来，我不老。"</span>`, title:"时光正好" },
];

const progressColors = ["#d4ffda", "#cde8ff", "#ffffff", "#ffdfe7", "#ffffff", "#d1f7ff"];

// DOM 元素
const audio = document.getElementById("audio");
const outerDisc = document.querySelector(".outer-disc");
const innerDisc = document.querySelector(".inner-disc");
const lyricsCurrent = document.getElementById("lyricsCurrent");
const songList = document.getElementById("songList");
const lyricsArea = document.getElementById("lyricsArea");
const playerContainer = document.getElementById("playerContainer");
const aboutBtn = document.getElementById("about-btn");
const aboutCard = document.getElementById("about-card");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const progressBar = document.querySelector(".progress-bar");
const gradient = document.querySelector("#progressGradient");
const playerSection = document.querySelector(".player-section");

// 状态变量
let currentTrackIndex = 0;
let lastColor = progressColors[0];
let isMini = false;
let originalParent = null;

// ===============================
// 跨页面状态管理（localStorage）
// ===============================
const STORAGE_KEY = 'yin_player_state';

function savePlayerState() {
    const state = {
        trackIndex: currentTrackIndex,
        currentTime: audio.currentTime,
        isPlaying: !audio.paused
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restorePlayerState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    try {
        const state = JSON.parse(saved);
        if (state.trackIndex !== undefined && state.trackIndex < tracks.length) {
            currentTrackIndex = state.trackIndex;
            loadTrack(currentTrackIndex);
            if (state.currentTime && isFinite(state.currentTime)) {
                audio.currentTime = state.currentTime;
            }
            if (state.isPlaying) {
                audio.play().catch(e => console.warn("自动播放恢复失败:", e));
            } else {
                audio.pause();
            }
            return true;
        }
    } catch(e) { console.warn("读取保存状态失败", e); }
    return false;
}

// 辅助函数
function updateActiveSongHighlight() {
    const allItems = songList.querySelectorAll("li");
    allItems.forEach((li, idx) => {
        if (idx === currentTrackIndex) li.classList.add("active");
        else li.classList.remove("active");
    });
}

function loadTrack(index) {
    const t = tracks[index];
    if (!t) return;
    audio.src = t.file;
    audio.volume = 0.06;
    innerDisc.style.backgroundImage = `url('${t.cover}')`;
    lyricsCurrent.innerHTML = t.lyrics;
    setProgressColor(progressColors[index % progressColors.length]);
    updateActiveSongHighlight();
    savePlayerState();
}

function setProgressColor(c) {
    if (!gradient || !gradient.children[0] || !gradient.children[1]) return;
    gradient.children[0].setAttribute("stop-color", lastColor);
    gradient.children[1].setAttribute("stop-color", c);
    lastColor = c;
}

// 播放/暂停控制旋转 + 保存状态
audio.onplay = () => {
    outerDisc.style.animationPlayState = "running";
    savePlayerState();
};
audio.onpause = () => {
    outerDisc.style.animationPlayState = "paused";
    savePlayerState();
};

audio.addEventListener("timeupdate", () => {
    savePlayerState();
    if (audio.duration && isFinite(audio.duration)) {
        const circumference = 2 * Math.PI * 195;
        const offset = circumference * (1 - audio.currentTime / audio.duration);
        progressBar.style.strokeDashoffset = offset;
    }
});
audio.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play().catch(e => console.warn("自动播放失败:", e));
});
audio.addEventListener("error", (e) => {
    console.error("音频加载失败:", audio.src);
    alert("音乐文件加载失败，请检查 song 文件夹中的文件是否存在");
});

// ===============================
// 歌单点击（从头播放）
// ===============================
songList.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(li.dataset.index);
        if (idx !== currentTrackIndex) {
            currentTrackIndex = idx;
            loadTrack(currentTrackIndex);
        }
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.warn("播放需要用户交互:", err);
            alert("请点击页面任意位置后重试播放");
        });
    });
});

// ===============================
// 歌词区域交互：鼠标悬停 vs 触摸点击
// ===============================
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    // ---------- 触摸模式 ----------
    lyricsArea.classList.add('touch-mode');

    let touchStartY = 0;
    let touchStartX = 0;
    let isSwiping = false;

    // 切换列表显示状态
    const toggleList = (show) => {
        if (show !== undefined) {
            lyricsArea.classList.toggle('show-list', show);
        } else {
            lyricsArea.classList.toggle('show-list');
        }
    };

    // 全局触摸事件：只处理列表显示时的滑动和点击
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = false;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const listVisible = lyricsArea.classList.contains('show-list');
        if (!listVisible) return;

        // 计算垂直滑动距离
        const deltaY = e.touches[0].clientY - touchStartY;
        if (Math.abs(deltaY) > 5) isSwiping = true;

        // 阻止页面滚动，并将滑动应用于歌单列表
        e.preventDefault();
        songList.scrollTop -= deltaY; // 注意方向：上滑手指下移，列表应向上滚动
        touchStartY = e.touches[0].clientY; // 更新基准点，实现连续滑动
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        // 如果是滑动操作，不触发点击
        if (isSwiping) {
            return;
        }

        const target = e.target;

        // 点击在歌词区域内
        if (lyricsArea.contains(target)) {
            // 如果点击的是歌单项，触发播放（利用已有的 click 事件）
            const li = target.closest('.song-list li');
            if (li) {
                li.click();
                return;
            }
            // 否则点击示例歌词区域，切换列表显示
            toggleList();
        } else {
            // 点击外部空白，关闭列表
            if (lyricsArea.classList.contains('show-list')) {
                toggleList(false);
            }
        }
    }, { passive: true });
} else {
    // ---------- 鼠标模式 ----------
    // 完全依赖 CSS :hover，无需 JS 干预
}

// ===============================
// 大唱片点击切换播放/暂停（保留当前位置）
// ===============================
playerContainer.addEventListener('click', function(e) {
    e.stopPropagation();
    if (audio.paused) {
        audio.play().catch(err => console.warn('播放失败', err));
    } else {
        audio.pause();
    }
});

// ===============================
// About 交互（迷你模式）
// ===============================
function toggleAbout() {
    if (!isMini) {
        originalParent = playerContainer.parentNode;
        const header = document.querySelector(".header");
        const logo = document.querySelector(".logo");
        if (header && logo && logo.nextSibling) {
            header.insertBefore(playerContainer, logo.nextSibling);
        } else if (header) {
            header.appendChild(playerContainer);
        }
        playerContainer.classList.add("mini-disc");
        isMini = true;
        aboutCard.classList.add("active");
        aboutBtn.classList.add("active");
    } else {
        aboutCard.classList.remove("active");
        if (playerSection) {
            playerSection.appendChild(playerContainer);
        } else {
            document.querySelector(".main .player-section")?.appendChild(playerContainer);
        }
        playerContainer.classList.remove("mini-disc");
        isMini = false;
        aboutBtn.classList.remove("active");
    }
    navMenu.classList.remove("active");
    savePlayerState();
}

aboutBtn.addEventListener("click", toggleAbout);

document.addEventListener("click", function(e) {
    if (!aboutCard.classList.contains("active")) return;
    if (e.target === aboutBtn || aboutBtn.contains(e.target)) return;
    if (aboutCard.contains(e.target)) return;
    const miniDisc = document.querySelector(".player-container.mini-disc");
    if (miniDisc && (e.target === miniDisc || miniDisc.contains(e.target))) return;
    toggleAbout();
});

// ===============================
// 汉堡菜单交互
// ===============================
menuToggle.onclick = () => navMenu.classList.toggle("active");
document.querySelectorAll(".nav-link").forEach(link => {
    if (link.id !== "about-btn") {
        link.addEventListener("click", () => navMenu.classList.remove("active"));
    }
});

// ===============================
// 新卡片内部的展开/折叠交互
// ===============================
function initExpandItems() {
    const expandItems = document.querySelectorAll('.expand-item');
    expandItems.forEach(item => {
        const header = item.querySelector('.expand-header');
        if (header) {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('active');
            });
        }
    });
}

// ===============================
// 页面关闭前保存状态
// ===============================
window.addEventListener("beforeunload", () => {
    savePlayerState();
});

// 初始化
const hasSavedState = restorePlayerState();
if (!hasSavedState) {
    loadTrack(0);
    audio.play().catch(e => console.log("自动播放被浏览器策略阻止，等待用户交互"));
}
initExpandItems();

// ===============================
// 名字/头像双向切换（屏幕宽度 < 1880px）
// ===============================
const myNameElement = document.querySelector('.my-name');
const avatarElement = document.querySelector('.avatar-circle');
let swapActive = false;
let resizeTimer = null;
let isInRange = false;

function isLessThan1880() { return window.innerWidth < 1880; }
function resetSwapMode() {
    if (!swapActive) return;
    swapActive = false;
    const ps = document.querySelector('.player-section');
    if (ps) ps.classList.remove('swap-mode');
    const nameArea = document.querySelector('.name-area');
    if (nameArea) nameArea.style.display = '';
    if (avatarElement) avatarElement.style.display = '';
}
function setSwapMode() {
    if (swapActive) return;
    swapActive = true;
    const ps = document.querySelector('.player-section');
    if (ps) ps.classList.add('swap-mode');
}
function onNameClick() { if (isInRange && !swapActive) setSwapMode(); }
function onAvatarClick() { if (isInRange && swapActive) resetSwapMode(); }
function bindEvents() {
    if (myNameElement) {
        myNameElement.removeEventListener('click', onNameClick);
        if (isInRange) myNameElement.addEventListener('click', onNameClick);
    }
    if (avatarElement) {
        avatarElement.removeEventListener('click', onAvatarClick);
        if (isInRange) avatarElement.addEventListener('click', onAvatarClick);
    }
}
function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const nowInRange = isLessThan1880();
        if (nowInRange !== isInRange) {
            isInRange = nowInRange;
            if (!isInRange) resetSwapMode();
            bindEvents();
        }
    }, 100);
}
function initSwapFeature() {
    isInRange = isLessThan1880();
    bindEvents();
    window.addEventListener('resize', handleResize);
}
initSwapFeature();

// ===============================
// 头像轮播（滚轮/滑动）
// ===============================
const avatarImg = document.querySelector('.avatar-circle img');
const avatarCircle = document.querySelector('.avatar-circle');
const avatarList = ['头像/头像1.jpg','头像/头像2.jpg','头像/头像3.jpg','头像/头像4.jpg','头像/头像5.jpg'];
let currentAvatarIndex = 0;
let isSwitching = false;
function isAvatarVisible() {
    if (!avatarCircle) return false;
    const style = window.getComputedStyle(avatarCircle);
    return style.display !== 'none';
}
function setAvatarImage(index) {
    if (isSwitching) return;
    isSwitching = true;
    avatarImg.style.opacity = '0';
    setTimeout(() => {
        avatarImg.src = avatarList[index];
        avatarImg.style.opacity = '1';
        setTimeout(() => { isSwitching = false; }, 300);
    }, 300);
}
function nextAvatar() { currentAvatarIndex = (currentAvatarIndex + 1) % avatarList.length; setAvatarImage(currentAvatarIndex); }
function prevAvatar() { currentAvatarIndex = (currentAvatarIndex - 1 + avatarList.length) % avatarList.length; setAvatarImage(currentAvatarIndex); }
function onWheel(e) { if (!isAvatarVisible()) return; e.preventDefault(); e.deltaY > 0 ? nextAvatar() : prevAvatar(); }
let touchStartYAvatar = 0, touchEndYAvatar = 0;
function onTouchStartAvatar(e) { if (!isAvatarVisible()) return; touchStartYAvatar = e.touches[0].clientY; }
function onTouchMoveAvatar(e) { if (!isAvatarVisible()) return; touchEndYAvatar = e.touches[0].clientY; }
function onTouchEndAvatar(e) {
    if (!isAvatarVisible()) return;
    if (touchStartYAvatar === 0) return;
    const deltaY = touchEndYAvatar - touchStartYAvatar;
    if (Math.abs(deltaY) < 30) return;
    deltaY > 0 ? prevAvatar() : nextAvatar();
    touchStartYAvatar = 0; touchEndYAvatar = 0;
}
if (avatarCircle) {
    avatarCircle.addEventListener('wheel', onWheel, { passive: false });
    avatarCircle.addEventListener('touchstart', onTouchStartAvatar);
    avatarCircle.addEventListener('touchmove', onTouchMoveAvatar);
    avatarCircle.addEventListener('touchend', onTouchEndAvatar);
}
if (avatarImg && avatarImg.src !== avatarList[0]) avatarImg.src = avatarList[0];
if (avatarImg) avatarImg.style.opacity = '1';

// ===============================
// 自动展开 About（从其他页面跳转回来）
// ===============================
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('about') === 'open') {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof toggleAbout === 'function') {
            setTimeout(() => toggleAbout(), 100);
        }
    });
}

// ============================================================
// 视频背景自动播放兜底
// ============================================================
(function() {
    var video = document.getElementById('bgVideo');
    if (video) {
        video.play().catch(function(e) {
            document.addEventListener('touchstart', function playOnce() {
                video.play().catch(function(e2) {});
                document.removeEventListener('touchstart', playOnce);
            }, { once: true });
        });
    }
})();
