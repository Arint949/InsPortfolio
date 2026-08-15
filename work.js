// work.js
// ===============================
// 歌曲配置
// ===============================
const tracks = [
    { id:1, file:"song/1.光阴独白.m4a", cover:"song/SongCover/1.jpg", title:"光阴独白" },
    { id:2, file:"song/2.夏夜最后的烟火.m4a", cover:"song/SongCover/2.jpg", title:"夏夜最后的烟火" },
    { id:3, file:"song/3.给电影人的情书.mp3", cover:"song/SongCover/3.jpg", title:"给电影人的情书" },
    { id:4, file:"song/4.送你一朵小红花.m4a", cover:"song/SongCover/4.jpg", title:"送你一朵小红花" },
    { id:5, file:"song/5.追光者.mp3", cover:"song/SongCover/5.jpg", title:"追光者" },
    { id:6, file:"song/6.私奔.m4a", cover:"song/SongCover/6.jpg", title:"私奔" },
    { id:7, file:"song/7.时光正好.mp3", cover:"song/SongCover/7.jpg", title:"时光正好" },
];

// DOM 元素
const audio = document.getElementById("audio");
const miniPlayer = document.getElementById("miniPlayer");
const miniOuterDisc = miniPlayer.querySelector(".outer-disc");
const miniInnerDisc = miniPlayer.querySelector(".inner-disc");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const hoverSongList = document.getElementById("hoverSongList");
const logo = document.querySelector(".logo");

let currentTrackIndex = 0;
let maskUpdatePending = false;

// ----- 垂直居中相关变量 -----
let isCentered = false;
let originalPaddingTop = null;
let resizeObserver = null;

// ===============================
// 跨页面状态管理
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

function syncCover() {
    const coverUrl = `url('${tracks[currentTrackIndex].cover}')`;
    miniInnerDisc.style.backgroundImage = coverUrl;
}

function updateSpinState() {
    miniOuterDisc.style.animationPlayState = audio.paused ? "paused" : "running";
}

function loadTrack(index) {
    const t = tracks[index];
    if (!t) return;
    audio.src = t.file;
    audio.volume = 0.06;
    syncCover();
    updateSpinState();
    const hoverItems = hoverSongList.querySelectorAll('li');
    hoverItems.forEach((li, idx) => {
        if (idx === index) li.classList.add('active');
        else li.classList.remove('active');
    });
    savePlayerState();
}

function togglePlayPause() {
    if (audio.paused) {
        audio.play().catch(e => console.warn("播放失败:", e));
    } else {
        audio.pause();
    }
}

function buildHoverSongList() {
    hoverSongList.innerHTML = '';
    tracks.forEach((track, idx) => {
        const li = document.createElement('li');
        li.textContent = track.title;
        li.dataset.index = idx;
        if (idx === currentTrackIndex) li.classList.add('active');
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            currentTrackIndex = idx;
            loadTrack(currentTrackIndex);
            audio.play().catch(console.warn);
            hoverSongList.classList.remove('visible');
        });
        hoverSongList.appendChild(li);
    });
}

let hoverTimeout = null;
function showHoverSongList() {
    clearTimeout(hoverTimeout);
    const items = hoverSongList.querySelectorAll('li');
    items.forEach((li, idx) => {
        if (idx === currentTrackIndex) li.classList.add('active');
        else li.classList.remove('active');
    });
    hoverSongList.classList.add('visible');
}
function hideHoverSongList() {
    hoverTimeout = setTimeout(() => {
        hoverSongList.classList.remove('visible');
    }, 200);
}

// ===============================
// 渐隐效果：仅顶部区域渐隐（使用 mask），效果明显
// ===============================
function updateTopFadeMask() {
    const header = document.querySelector('.header');
    const expandItems = document.querySelectorAll('.expand-item');
    if (!header || expandItems.length === 0) return;

    const headerBottom = header.getBoundingClientRect().bottom;
    // 最大渐隐高度（像素），数值越大，越靠近顶部时越透明区域越大，效果越明显
    const maxFadeHeight = 10000;  // 明显效果

    expandItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        // 条目顶部与 header 底部的重叠距离
        const overlap = Math.max(0, headerBottom - rect.top);
        let fadeHeight = 0;
        if (overlap > 0) {
            // 重叠越多渐隐高度越大，但不超过 maxFadeHeight
            fadeHeight = Math.min(maxFadeHeight, overlap * 1.23);
        }
        if (fadeHeight <= 0) {
            item.style.maskImage = 'none';
            item.style.webkitMaskImage = 'none';
        } else {
            // 线性渐变：顶部完全透明，向下过渡到不透明
            const maskGradient = `linear-gradient(to bottom, transparent 0%, black ${fadeHeight}px)`;
            item.style.maskImage = maskGradient;
            item.style.webkitMaskImage = maskGradient;
        }
    });
}

// 滚动时更新 mask（节流）
function handleMaskScroll() {
    if (maskUpdatePending) return;
    maskUpdatePending = true;
    requestAnimationFrame(() => {
        updateTopFadeMask();
        maskUpdatePending = false;
    });
}

// ===============================
// 垂直居中（仅全部折叠时生效，响应式）
// ===============================
function isAnyExpandActive() {
    return document.querySelectorAll('.expand-item.active').length > 0;
}

function centerWorkList() {
    const workMain = document.querySelector('.work-main');
    const workContainer = document.querySelector('.work-container');
    const header = document.querySelector('.header');
    if (!workMain || !workContainer || !header) return;
    
    if (isAnyExpandActive()) return; // 有展开条目时不居中

    const containerHeight = workContainer.scrollHeight;
    const headerHeight = header.offsetHeight;
    const viewportHeight = window.innerHeight;

    let paddingTop = (viewportHeight - headerHeight - containerHeight) / 2;
    if (paddingTop < 0) paddingTop = 20;

    if (originalPaddingTop === null) {
        originalPaddingTop = getComputedStyle(workMain).paddingTop;
    }
    workMain.style.paddingTop = paddingTop + 'px';
    isCentered = true;

    if (resizeObserver) window.removeEventListener('resize', resizeObserver);
    resizeObserver = () => {
        if (!isAnyExpandActive()) centerWorkList();
    };
    window.addEventListener('resize', resizeObserver);
}

function disableCenter() {
    if (!isCentered) return;
    const workMain = document.querySelector('.work-main');
    if (workMain) {
        workMain.style.paddingTop = '';
    }
    isCentered = false;
    if (resizeObserver) {
        window.removeEventListener('resize', resizeObserver);
        resizeObserver = null;
    }
}

function updateCenterState() {
    if (isAnyExpandActive()) {
        if (isCentered) disableCenter();
    } else {
        if (!isCentered) centerWorkList();
    }
}

// ===============================
// 音频事件
// ===============================
audio.onplay = () => {
    updateSpinState();
    savePlayerState();
};
audio.onpause = () => {
    updateSpinState();
    savePlayerState();
};
audio.addEventListener("timeupdate", () => savePlayerState());
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
// 迷你唱片交互
// ===============================
miniPlayer.addEventListener("click", togglePlayPause);
miniPlayer.addEventListener("mouseenter", showHoverSongList);
miniPlayer.addEventListener("mouseleave", hideHoverSongList);
hoverSongList.addEventListener("mouseenter", () => {
    clearTimeout(hoverTimeout);
});
hoverSongList.addEventListener("mouseleave", () => {
    hideHoverSongList();
});

logo.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = "home.html";
});

window.addEventListener("beforeunload", () => {
    savePlayerState();
});

// 汉堡菜单
menuToggle.onclick = () => navMenu.classList.toggle("active");
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
});

// ===============================
// 工作经历展开/折叠交互
// ===============================
function initExpandItems() {
    const expandItems = document.querySelectorAll('.expand-item');
    
    expandItems.forEach(item => {
        const header = item.querySelector('.expand-header');
        if (header) {
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            const freshHeader = item.querySelector('.expand-header');
            
            freshHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('active');
                // 更新居中状态
                updateCenterState();
                // 重新计算 mask（因为展开后内容高度变化，影响重叠判断）
                handleMaskScroll();
                // 延迟重新检测附件溢出（等待内容渲染完成）
                setTimeout(() => {
                    checkAttachmentsOverflow();
                }, 100);
            });
        }
    });
    
    // 初始全部折叠
    document.querySelectorAll('.expand-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 键盘可访问性
    const headers = document.querySelectorAll('.expand-header');
    headers.forEach(header => {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', 'false');
        
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
                const parentItem = header.closest('.expand-item');
                const expanded = parentItem?.classList.contains('active');
                header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            }
        });
        
        const parentItem = header.closest('.expand-item');
        if (parentItem) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const expanded = parentItem.classList.contains('active');
                        header.setAttribute('aria-expanded', expanded);
                    }
                });
            });
            observer.observe(parentItem, { attributes: true });
        }
    });
}

// ===============================
// 附件折叠/展开交互
// ===============================
function initAttachmentsToggle() {
    const toggleButtons = document.querySelectorAll('.attachments-toggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();   // 防止冒泡到 expand-header
            const wrapper = this.closest('.attachments').querySelector('.attachments-wrapper');
            if (wrapper) {
                wrapper.classList.toggle('expanded');
                this.classList.toggle('expanded');
            }
        });
    });
    // 初始时所有条目折叠，不检测，等展开时再检测
}

// 检测每个附件列表是否超过一行，若不超过则隐藏箭头（仅当条目展开时）
function checkAttachmentsOverflow() {
    const expandItems = document.querySelectorAll('.expand-item.active');
    expandItems.forEach(item => {
        const wrappers = item.querySelectorAll('.attachments-wrapper');
        wrappers.forEach(wrapper => {
            const toggle = wrapper.closest('.attachments').querySelector('.attachments-toggle');
            if (!toggle) return;
            // 确保折叠状态
            wrapper.classList.remove('expanded');
            toggle.classList.remove('expanded');
            
            const list = wrapper.querySelector('.attachments-list');
            if (!list) {
                toggle.style.display = 'none';
                return;
            }
            const firstItem = list.querySelector('.attachment-item');
            if (!firstItem) {
                toggle.style.display = 'none';
                return;
            }
            // 计算单行高度：第一个 item 的高度 + list 的上下内边距
            const itemHeight = firstItem.offsetHeight;
            const listStyle = getComputedStyle(list);
            const paddingTop = parseFloat(listStyle.paddingTop) || 0;
            const paddingBottom = parseFloat(listStyle.paddingBottom) || 0;
            const singleRowHeight = itemHeight + paddingTop + paddingBottom;
            
            // 如果列表实际高度大于单行高度，说明有多行 → 显示箭头
            if (list.scrollHeight > singleRowHeight + 2) { // 2px 容差
                toggle.style.display = 'block';
            } else {
                toggle.style.display = 'none';
            }
        });
    });
}

// ===============================
// 初始化所有功能
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    buildHoverSongList();
    const hasSavedState = restorePlayerState();
    if (!hasSavedState) {
        loadTrack(0);
        audio.pause();
    }
    initExpandItems();
    initAttachmentsToggle();   // 新增附件折叠功能
    
    // 滚动 mask 更新
    window.addEventListener('scroll', handleMaskScroll, { passive: true });
    window.addEventListener('resize', () => {
        handleMaskScroll();
        if (!isAnyExpandActive()) centerWorkList();
        // 窗口大小变化时重新检测附件溢出（仅对已展开条目）
        setTimeout(checkAttachmentsOverflow, 200);
    });
    
    // 初始居中
    centerWorkList();
    // 初始 mask 更新
    handleMaskScroll();
});

// ===============================
// 可选：自动获取链接标题（需解决跨域，建议手动填写）
// ===============================
// 如果希望自动获取网页标题，可以启用下方代码（但受 CORS 限制，仅部分站点可用）
// 更推荐的方式是手动在 .attachment-name 中填写标题缩略
/*
document.querySelectorAll('.attachment-item[data-type="link"]').forEach(item => {
    const url = item.href;
    if (url && !url.startsWith('#')) {
        fetch(url, { mode: 'no-cors' })
            .then(res => res.text())
            .then(html => {
                const title = html.match(/<title>([^<]*)<\/title>/);
                if (title && title[1]) {
                    const short = title[1].slice(0, 12) + '...';
                    item.querySelector('.attachment-name').textContent = short;
                }
            })
            .catch(() => {});
    }
});
*/
