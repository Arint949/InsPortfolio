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

// ===============================
// 项目数据（示例包含 PDF）
// ===============================
const projects = [
    { id:1, name:"基于轻量LLM的音乐情绪感知可视化", title:"基于轻量 LLM（GPT-style Transformer）的音乐情绪感知可视化", date:"2022.1-2022.3",
        tasks:["<b>研究痛点与模型构建</b>：针对“短视频盛行下图文内容为何仍具生命力”的行业悖论，提出“感知控制”为核心中介变量。构建“内容形式 → 感知控制 → 用户参与意愿”的理论模型，旨在解析用户对“信息掌控权”的心理需求。",
            "<b>A/B Test 实验设计</b>：主导设计组间对照实验，控制内容变量，仅改变“图文 vs. 视频”形式。利用 Qualtrics 采集数据，回收有效样本 170 份，并完成信效度检验。",
            "<b>Python统计分析与AI协作</b>：①利用 Python 进行数据清洗与预处理，并结合AI辅助编程 完成复杂统计模型的代码实现；②将课堂所学的统计原理（t 检验、相关分析、中介效应）转化为 Python 代码逻辑；③成功运行 Bootstrap 中介效应检验（5000次抽样），解读出中介效应值为 0.319 (p<0.05)，验证了感知控制在内容形式影响用户行为中的关键传导作用。",
            "<b>成果与策略输出</b>：统筹全组完成符合 ICA 投稿标准的学术论文。研究证实图文形式能显著提升用户的“感知控制”，进而提升点赞、评论等互动意愿，为短视频/图文的内容分发策略及交互设计（如进度条拖拽、倍速播放）提供了心理学依据与数据支持。"],
        images:["proj/7045miniproj.pdf"],
        cover:"project素材/01-音乐LLM/封面.png", polarImg:"project素材/01-音乐LLM/封面.png" },
    { id:2, name:"小红书文案生成器：AI Agent产品设计", title:"小红书文案生成器：AI Agent产品设计", date:"2021.6-2021.8",
        tasks:["主导媒体心理学方向用户A/B测试实验设计与数据采集","负责团队进度统筹、实验流程标准化与成员分工协调","完成数据清洗与统计分析，输出实验报告并形成可复用模板"],
        images:["proj/miniproj1.png","proj/miniproj2.png"],
        cover:"project素材/02-小红书文案/XT.png", polarImg:"project素材/02-小红书文案/xhsDify封面.png" },
    { id:3, name:"媒体心理学：帖子类型对用户参与意愿的影响", title:"媒体心理学课题：帖子类型对用户参与意愿的影响（感知控制的中介作用）", date:"2022.4-2022.6",
        tasks:["负责APP界面交互原型设计与用户测试","组织团队进行设计评审和迭代优化","输出高保真原型和设计规范文档"],
        images:["proj/llmFM.png", "proj/7045miniproj.pdf"],
        cover:"project素材/03-媒体心理学/XT.jpg", polarImg:"project素材/03-媒体心理学/perceivedcontrolFM.png" },
    { id:4, name:"《云锦云景》：AIGC视觉创作", title:"《云锦云景》：AIGC视觉创作", date:"2022.7-2022.9",
        tasks:["使用D3.js构建动态数据仪表板","处理大规模数据集并优化渲染性能","实现多维度数据筛选与交互功能"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/04-云锦/云锦XT.jpg", polarImg:"project素材/04-云锦/云锦FM.jpg" },
    { id:5, name:"尔木萄新品上市整合营销策划方案", title:"尔木萄新品上市整合营销策划方案", date:"2022.10-2022.12",
        tasks:["参与组件库搭建与文档编写","实现响应式布局与跨浏览器兼容","优化页面加载速度提升30%"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/05-尔木萄/XT.jpg", polarImg:"project素材/05-尔木萄/FM.jpg" },
    { id:6, name:"对话式新闻AI Agent产品实践", title:"对话式新闻AI Agent产品实践：美国密苏里大学新闻学院交流周", date:"2023.1-2023.3",
        tasks:["主导产品需求分析与功能规划","完成竞品分析报告和用户旅程地图","协同开发团队推动产品上线"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/06-新闻/XT.jpg", polarImg:"project素材/06-新闻/XT.jpg" },
    { id:7, name:"ClimaXtreme：极端天气信息服务网站", title:"ClimaXtreme：极端天气信息服务网站", date:"2023.4-2023.6",
        tasks:["负责品牌视觉系统设计与规范制定","完成宣传物料和UI界面设计","设计并维护设计系统组件库"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/07-Climaxtreme/XT.png", polarImg:"project素材/07-Climaxtreme/FM.png" },
    { id:8, name:"课程实践：电影信息服务网站", title:"电影信息服务网站课程实践", date:"2023.7-2023.9",
        tasks:["使用After Effects制作交互动效","输出Lottie动画供开发使用","设计品牌宣传视频动画"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/08-电影网/FM.png", polarImg:"project素材/08-电影网/Movie.png" },
    { id:9, name:"《纳百戏》：线上预定点单UI设计+点茶机器设计+沉浸式空间", title:"纳百戏：线上预定点单UI设计+点茶机器设计+沉浸式空间", date:"2023.10-2023.12",
        tasks:["设计可用性测试方案并招募用户","分析测试数据提出改进建议","撰写测试报告并进行团队分享"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/09-纳百戏/XT.jpg", polarImg:"project素材/09-纳百戏/FM.png" },
    { id:10, name:"溯洄·山海：《山海经》国风文化策展", title:"溯洄·山海：《山海经》国风文化展", date:"2024.1-2024.3",
        tasks:["统筹项目进度与资源分配","组织团队会议并管理风险","确保项目按时高质量交付"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/10-山海经/XT.png", polarImg:"project素材/10-山海经/FM.png" },
    { id:11, name:"《有人在下雨时说爱我》：AI音乐创作", title:"《有人在下雨时说爱我》：AI音乐创作", date:"2024.1-2024.3",
        tasks:["统筹项目进度与资源分配","组织团队会议并管理风险","确保项目按时高质量交付"],
        images:["11/133-1.jpg","11/133-2.jpg"],
        cover:"project素材/11-AI音乐/XT.png", polarImg:"moments素材/23.10.20/1.jpg" }
];

// ===============================
// DOM 元素
// ===============================
const audio = document.getElementById("audio");
const miniPlayer = document.getElementById("miniPlayer");
const miniOuterDisc = miniPlayer.querySelector(".outer-disc");
const miniInnerDisc = miniPlayer.querySelector(".inner-disc");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const hoverSongList = document.getElementById("hoverSongList");
const logo = document.querySelector(".logo");
const mainWrap = document.getElementById('mainWrap');
const detailPage = document.getElementById('detailPage');
const polaroidImg = document.getElementById('polaroidImg');
const polaroidCaption = document.getElementById('polaroidCaption');
const slider = document.getElementById('projectSlider');
const sliderContainer = document.getElementById('projectSliderContainer');
const backBtn = document.getElementById('backBtn');

let currentIndex = 0;

// ===============================
// 音乐播放器
// ===============================
let currentTrackIndex = 0;
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
    miniInnerDisc.style.backgroundImage = `url('${tracks[currentTrackIndex].cover}')`;
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

miniPlayer.addEventListener("click", togglePlayPause);
miniPlayer.addEventListener("mouseenter", showHoverSongList);
miniPlayer.addEventListener("mouseleave", hideHoverSongList);
hoverSongList.addEventListener("mouseenter", () => clearTimeout(hoverTimeout));
hoverSongList.addEventListener("mouseleave", hideHoverSongList);

logo.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = "home.html";
});
window.addEventListener("beforeunload", () => savePlayerState());
menuToggle.onclick = () => navMenu.classList.toggle("active");
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
});

// ===============================
// 拍立得核心功能
// ===============================

function syncRightHeight() {
    if (window.innerWidth > 800) {
        const polaroid = document.querySelector('.polaroid');
        if (polaroid) {
            const height = polaroid.offsetHeight;
            if (height > 0) {
                sliderContainer.style.height = height + 'px';
                sliderContainer.style.maxHeight = height + 'px';
            }
        }
    } else {
        sliderContainer.style.height = '';
        sliderContainer.style.maxHeight = '';
    }
}

function updatePolaroid() {
    const p = projects[currentIndex];
    polaroidImg.innerHTML = `<img src="${p.polarImg}">`;
    polaroidCaption.textContent = p.name;
    const cards = slider.querySelectorAll('.project-card');
    cards.forEach((card, idx) => {
        if (idx === currentIndex) card.classList.add('active');
        else card.classList.remove('active');
    });
    const activeCard = cards[currentIndex];
    if (activeCard && sliderContainer) {
        const containerRect = sliderContainer.getBoundingClientRect();
        const cardRect = activeCard.getBoundingClientRect();
        if (cardRect.top < containerRect.top || cardRect.bottom > containerRect.bottom) {
            activeCard.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
    const img = polaroidImg.querySelector('img');
    if (img) {
        if (img.complete) {
            syncRightHeight();
        } else {
            img.onload = syncRightHeight;
            img.onerror = syncRightHeight;
        }
    } else {
        syncRightHeight();
    }
    setTimeout(syncRightHeight, 150);
}

function initSlider() {
    slider.innerHTML = '';
    projects.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (idx === currentIndex) card.classList.add('active');
        card.innerHTML = `<img src="${p.cover}"><div class="overlay">${p.name}</div>`;
        card.dataset.index = idx;
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedIdx = parseInt(card.dataset.index);
            if (clickedIdx !== currentIndex) {
                currentIndex = clickedIdx;
                updatePolaroid();
            }
        });
        slider.appendChild(card);
    });
    setTimeout(syncRightHeight, 50);
}

function reinitSlider() {
    const oldIndex = currentIndex;
    initSlider();
    currentIndex = oldIndex;
    updatePolaroid();
    setTimeout(syncRightHeight, 100);
}

// ===============================
// 详情页交互
// ===============================

const polaroid = document.querySelector('.polaroid');
polaroid.onclick = () => {
    const p = projects[currentIndex];
    document.querySelector('.detail-title').textContent = p.title;
    document.querySelector('.detail-date').textContent = p.date;
    document.querySelector('.detail-tasks').innerHTML = p.tasks.map(t=>`<li>${t}</li>`).join('');

    const detailImagesHtml = p.images.map(src => {
        const isPdf = src.toLowerCase().endsWith('.pdf');
        if (isPdf) {
            return `<embed src="${src}" type="application/pdf" width="100%" height="500px" class="pdf-viewer">`;
        } else {
            return `<img src="${src}" alt="项目图片" class="detail-image">`;
        }
    }).join('');
    document.querySelector('.detail-images').innerHTML = detailImagesHtml;

    mainWrap.classList.add('hide');
    detailPage.classList.add('show');
    setTimeout(() => { detailPage.scrollTop = 0; }, 10);
    
    initTaskCollapse();
};

backBtn.onclick = () => {
    mainWrap.classList.remove('hide');
    detailPage.classList.remove('show');
};

const detailTitleElem = document.querySelector('.detail-back');
if (detailTitleElem) {
    detailTitleElem.style.cursor = 'pointer';
    detailTitleElem.onclick = () => {
        mainWrap.classList.remove('hide');
        detailPage.classList.remove('show');
    };
}

document.addEventListener('dragstart', e => e.preventDefault());

// ===============================
// 窗口 resize
// ===============================
let resizeTimer = null;
function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        reinitSlider();
        setTimeout(syncRightHeight, 100);
    }, 300);
}
window.addEventListener('resize', handleResize);

// ===============================
// 任务列表折叠功能（丝滑展开，无突跳）
// ===============================
function initTaskCollapse() {
    const tasksEl = document.querySelector('.detail-tasks');
    const toggleBtn = document.getElementById('taskToggle');
    if (!tasksEl || !toggleBtn) return;

    tasksEl.style.maxHeight = 'none';
    tasksEl.style.overflow = '';
    toggleBtn.style.display = 'none';
    toggleBtn.dataset.expanded = 'false';
    toggleBtn.textContent = '…▾';

    requestAnimationFrame(() => {
        const style = getComputedStyle(tasksEl);
        const lineHeight = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) * 1.9);
        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingBottom = parseFloat(style.paddingBottom) || 0;
        const maxLines = 5;
        const foldedHeight = lineHeight * maxLines + paddingTop + paddingBottom;

        const fullHeight = tasksEl.scrollHeight;

        if (fullHeight > foldedHeight + 2) {
            tasksEl.style.maxHeight = foldedHeight + 'px';
            tasksEl.style.overflow = 'hidden';
            toggleBtn.style.display = 'block';
            toggleBtn.dataset.expanded = 'false';
            toggleBtn.textContent = '…▾';
        } else {
            tasksEl.style.maxHeight = 'none';
            tasksEl.style.overflow = '';
            toggleBtn.style.display = 'none';
        }
    });
}

document.getElementById('taskToggle')?.addEventListener('click', function(e) {
    e.stopPropagation();
    const tasksEl = document.querySelector('.detail-tasks');
    if (!tasksEl) return;
    const isExpanded = this.dataset.expanded === 'true';

    if (isExpanded) {
        // 折叠
        const style = getComputedStyle(tasksEl);
        const lineHeight = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) * 1.9);
        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingBottom = parseFloat(style.paddingBottom) || 0;
        const foldedHeight = lineHeight * 5 + paddingTop + paddingBottom;
        tasksEl.style.maxHeight = foldedHeight + 'px';
        tasksEl.style.overflow = 'hidden';
        this.textContent = '…▾';
        this.dataset.expanded = 'false';
    } else {
        // 展开：无突跳方案
        // 保存当前 max-height（折叠值）
        const currentMaxHeight = tasksEl.style.maxHeight; 
        // 临时设为 none 获取真实高度
        tasksEl.style.maxHeight = 'none';
        // 强制回流
        void tasksEl.offsetHeight;
        const fullHeight = tasksEl.scrollHeight;
        // 立即恢复为折叠值
        tasksEl.style.maxHeight = currentMaxHeight;
        // 再次强制回流确保应用
        void tasksEl.offsetHeight;
        // 然后设置为 fullHeight，触发过渡
        tasksEl.style.maxHeight = fullHeight + 'px';
        tasksEl.style.overflow = '';
        this.textContent = '▴';
        this.dataset.expanded = 'true';
    }
});

// ===============================
// 启动
// ===============================
window.onload = () => {
    buildHoverSongList();
    const hasSavedState = restorePlayerState();
    if (!hasSavedState) {
        loadTrack(0);
        audio.pause();
    }
    initSlider();
    currentIndex = 0;
    updatePolaroid();
    setTimeout(syncRightHeight, 200);
};