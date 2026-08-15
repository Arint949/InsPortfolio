// ===============================
// 粒子颜色全局函数
// ===============================
let particleColorUpdater = null;
const songColors = {
    "光阴独白": "#ffdaf6",
    "夏夜最后的烟火": "#bed2fe",
    "给电影人的情书": "#fef2c9",
    "送你一朵小红花": "#ffd3de",
    "追光者": "#fffeeb",
    "私奔": "#afeaff",
    "时光正好": "#d4fff0"
};

function updateParticleColorBySong(title) {
    const hex = songColors[title] || "#ffffff";
    if (particleColorUpdater && typeof particleColorUpdater === "function") {
        particleColorUpdater(hex);
    } else {
        let retries = 0;
        function tryUpdate() {
            if (particleColorUpdater) particleColorUpdater(hex);
            else if (retries < 8) { retries++; setTimeout(tryUpdate, 120); }
        }
        tryUpdate();
    }
}

// ===============================
// 音乐播放器配置
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

const audio = document.getElementById("audio");
const miniPlayer = document.getElementById("miniPlayer");
const miniOuterDisc = miniPlayer.querySelector(".outer-disc");
const miniInnerDisc = miniPlayer.querySelector(".inner-disc");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const hoverSongList = document.getElementById("hoverSongList");
const logo = document.querySelector(".logo");

let currentTrackIndex = 0;
const STORAGE_KEY = 'yin_player_state';

function savePlayerState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        trackIndex: currentTrackIndex,
        currentTime: audio.currentTime,
        isPlaying: !audio.paused
    }));
}
function restorePlayerState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    try {
        const state = JSON.parse(saved);
        if (state.trackIndex !== undefined && state.trackIndex < tracks.length) {
            currentTrackIndex = state.trackIndex;
            loadTrack(currentTrackIndex);
            if (state.currentTime && isFinite(state.currentTime)) audio.currentTime = state.currentTime;
            if (state.isPlaying) audio.play().catch(e=>console.warn);
            else audio.pause();
            return true;
        }
    } catch(e) { console.warn(e); }
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
    document.querySelectorAll('#hoverSongList li').forEach((li, idx) => {
        if (idx === index) li.classList.add('active');
        else li.classList.remove('active');
    });
    updateParticleColorBySong(t.title);
    savePlayerState();
}
function togglePlayPause() {
    if (audio.paused) audio.play().catch(e=>console.warn);
    else audio.pause();
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
    hoverSongList.classList.add('visible');
}
function hideHoverSongList() {
    hoverTimeout = setTimeout(() => hoverSongList.classList.remove('visible'), 200);
}
miniPlayer.addEventListener("click", togglePlayPause);
miniPlayer.addEventListener("mouseenter", showHoverSongList);
miniPlayer.addEventListener("mouseleave", hideHoverSongList);
hoverSongList.addEventListener("mouseenter", () => clearTimeout(hoverTimeout));
hoverSongList.addEventListener("mouseleave", hideHoverSongList);
logo.addEventListener("click", () => window.location.href = "home.html");
menuToggle.onclick = () => navMenu.classList.toggle("active");
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
});
audio.onplay = () => { updateSpinState(); savePlayerState(); };
audio.onpause = () => { updateSpinState(); savePlayerState(); };
audio.addEventListener("timeupdate", savePlayerState);
audio.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play().catch(e=>console.warn);
});
buildHoverSongList();
if (!restorePlayerState()) { loadTrack(0); audio.pause(); }
window.addEventListener("beforeunload", () => savePlayerState());

// ===============================
// 时间线日记数据
// ===============================
const timelineData = [
    { date: "2026. 4. 22", title: "❮  2026. 4. 22", 
        desc: `	一年前的春天，等着时传的毕业典礼，完全无法想象自己能用上课讲的东西实现自己想做的一些小玩意。
	看上去其实好简单，不就是个交互的特效嘛。
	1到3个人的mini project最终还是自己一个人做，不敢想象一个文学学士怎么敢的。周一pre的时候感觉不像是在课程汇报，而是真的在向台下稀稀拉拉几个人说，我有什么样的想法，用了什么模型，做了什么东西，还有好多好多想要添加改进。
	几年前的冬天，集训的晚上，趁着没人在大教室里把夕阳箫鼓弹的噼里啪啦的时候，从没想过有一天我能让这些脑子里的“感觉”被看到；中午趴在琴房的钢琴上看和声，大张的五线谱稿纸摞在头顶，从没想过有一天真的会把和声写进代码里。
	昨晚从最后一次线下pre提前溜出来，出cva楼的路上人很少，想起去年夏天第一次到学校也是直达cva楼下，不走正门走偏门。
	走偏门就可以了，挺好的，去rrs教室上代码lab甚至走的是地下停车场。
	因为这里不是起点，更不是终点。`, 
        imgList: ["moments素材/26.4.22/1.jpg","moments素材/26.4.22/2.jpg","moments素材/26.4.22/3.jpg","moments素材/26.4.22/4.jpg"] },
    
//    { date: "2026. 2. 11", title: "❮  2026. 2. 11", 
//         desc: `   年前最后一条日常碎碎念合集。
//    *放假倒数Day 2.
//    *每周一上完第一节课转场路过的那条街，一溜儿店铺香香的亮堂堂的，我就像那个卖女孩的小火柴
//    *凑单买到一盒莫名其妙的酸奶。
//    *📕的新年营销真的神来的，调的AI年度诗篇太好了，搜了一下其他人po出来的，真的有让人感觉“被看见”。
//    *有时候白天出太大阳，万里无云，天气好得像世界被拉高了饱和度一样，傍晚就会呈现很清晰的朦胧的蓝调，放学的时候就能看到漆黑夜幕里的一整片星。
//    *看到远处的居民楼微黄的星星点点，就又想起上学期做的小网站设定
//    ˶ˊᜊˋ˶`, 
//        imgList: ["moments素材/26.2.11/1.jpg","moments素材/26.2.11/2.jpg","moments素材/26.2.11/3.jpg","moments素材/26.2.11/4.jpg","moments素材/26.2.11/5.jpg","moments素材/26.2.11/6.jpg"] },
    
    { date: "2026. 1. 22", title: "❮  2026. 1. 22", 
        desc: `维港的天总会亮，
你当像鸟飞往你的山。`, 
        imgList: ["moments素材/26.1.22/1.jpg","moments素材/26.1.22/2.jpg","moments素材/26.1.22/3.jpg","moments素材/26.1.22/4.jpg","moments素材/26.1.22/5.jpg","moments素材/26.1.22/6.jpg","moments素材/26.1.22/7.jpg","moments素材/26.1.22/8.jpg","moments素材/26.1.22/9.jpg","moments素材/26.1.22/10.jpg"] },
    
    { date: "2025. 11. 30", title: "❮  2025. 11. 30", 
         desc: `    期中无缝衔接到期末。
    * 去办身份证，坐在大巴的第一排晒着太阳看街景。坐在我后面的两个老哥叽里咕噜不知道在说什么，听起来像“巴拉达冷个儿冷个儿冷”，简直和我语速起飞舌头打搅的pre有的一拼。
    * 我是有点子完美主义在身上的，ddl把人从j变成拖延p再到j，但也真的只是不想粗糙交付。
    * 每一餐饭、每一口甜，每一次定格，每一次心跳，每一种感觉。能够在这么快速的碎片的光怪陆离的世界里感受到生命的鲜活、“我”的存在，真是一件很美好的事。
    * 在肯德基选课的时候听到一首歌：
    “The best things in life are free, and they're always gonna be.”`, 
        imgList: ["moments素材/25.11.30/1.jpg","moments素材/25.11.30/2.jpg","moments素材/25.11.30/4.jpg","moments素材/25.11.30/5.jpg","moments素材/25.11.30/6.jpg","moments素材/25.11.30/7.jpg"] },
    
    { date: "2025. 8. 28", title: "❮  2025. 8. 28", 
        desc: `    翻到高中时做的纸灯笼，真是青春啊，同桌帮忙配的字还是哪本小说里写的：
    “千秋要君一言，愿爱不离若山。”
    画的主题是山海经。`, 
        imgList: ["moments素材/25.8.28/1.jpg","moments素材/25.8.28/2.jpg","moments素材/25.8.28/3.jpg","moments素材/25.8.28/4.jpg","moments素材/25.8.28/5.jpg"] },
    
    { date: "2025. 6. 24", title: "❮  2025. 6. 24", 
        desc: `    毕业前，班群里发了个表，说走红毯的同学要填写自己的主持词。
    当时一下子给我问住了，是要怀念和遗憾？欢乐或伤感？还是憧憬与期盼？
    思来想去好几天，终于字句斟酌：

    🩵向前看。

    那天晚上508又一起唱了一遍：
    “天真岁月不忍欺，
    青春荒唐我不负你。”
    唱着唱着大家都哭了。

    “原谅捧花的我盛装出席，只为错过你。”“我们只剩今天，怎么奢求以后。”`, 
        imgList: ["moments素材/25.6.24/1.jpg","moments素材/25.6.24/2.jpg","moments素材/25.6.24/3.jpg","moments素材/25.6.24/4.jpg"] },
    
    { date: "2025. 6. 6", title: "❮  2025. 6. 6", 
        desc: `    以前不懂书本里的“淡妆浓抹总相宜”，现在见到她的第一面就发现这是她最好的形容词。
    更无法想初晴后雨的光景。`, 
        imgList: ["moments素材/25.6.6/1.jpg","moments素材/25.6.6/2.jpg","moments素材/25.6.6/3.jpg","moments素材/25.6.6/4.jpg","moments素材/25.6.6/5.jpg","moments素材/25.6.6/6.jpg"] },
    
    { date: "2025. 4. 28", title: "❮  2025. 4. 28", 
         desc: `今晚吃一颗溏心咸蛋黄`, 
        imgList: ["moments素材/25.4.28/1.jpg","moments素材/25.4.28/2.jpg","moments素材/25.4.28/3.jpg","moments素材/25.4.28/4.jpg","moments素材/25.4.28/5.jpg","moments素材/25.4.28/6.jpg","moments素材/25.4.28/7.jpg"] },
    
    { date: "2025. 4. 11", title: "❮  2025. 4. 11", 
         desc: `	前段时间出门，叶子全长出来了嫩嫩绿绿黄黄的，抬头满目都是，悄悄的，盛大的。
	在先锋书店的门口随手翻了一页答案之书，没有问题的答案是“成为事实”。
	很多湖，很多江，带着橙色的波浪。
	窗外飞来两只珠颈斑鸠和一只喜鹊，总听到“古菇固”的叫声。`, 
        imgList: ["moments素材/25.4.11/1.jpg","moments素材/25.4.11/2.jpg","moments素材/25.4.11/3.jpg","moments素材/25.4.11/4.jpg","moments素材/25.4.11/5.jpg","moments素材/25.4.11/6.jpg","moments素材/25.4.11/7.jpg","moments素材/25.4.11/8.jpg"] },
    
    { date: "2025. 3. 20", title: "❮  2025. 3. 20", 
         desc: `	花开堪折直须折，莫待无花空折枝。
	菲菲说“终于还是撬动了我不健康的作息”，不得不说VD和多晒太阳真的很有效果づ♡ど
	春日盛宴，愿君多采撷。
	*不是采花！是捕捉这些快乐美好的瞬间`, 
        imgList: ["moments素材/25.3.20/1.jpg","moments素材/25.3.20/2.jpg","moments素材/25.3.20/3.jpg","moments素材/25.3.20/4.jpg"] },
    
    { date: "2024. 3. 30", title: "❮  2024. 3. 30", 
         desc: `	拾花酿春，日光鼎盛，
	人间三月，卿乃佳人。`, 
        imgList: ["moments素材/24.3.30/1.jpg","moments素材/24.3.30/2.jpg","moments素材/24.3.30/3.jpg","moments素材/24.3.30/4.jpg","moments素材/24.3.30/5.jpg","moments素材/24.3.30/6.jpg"] },
    
    { date: "2024. 1. 12", title: "❮  2024. 1. 12", 
         desc: `	8点半出门city walk，烟火气重啊，好喜欢。
	坏了，四川人出门骑熊猫的事实瞒不住了。
	碰到修勾真的会变夹子音…好几次喊人家乖乖都会看镜头，然后看到阿拉斯加，我妈实在是绷不住了：这么大一只还小可爱……
	沙糖桔山！又又又到了该上火的季节。还有个插曲，
	我：“老板，你这个光打的有点红啊。”
	老板：“不要在意这些细节，红是为了好看，你又不是买来看的，肯定是好吃才得行撒。”
	偶遇时光深处的爱情。`, 
        imgList: ["moments素材/24.1.12/1.jpg","moments素材/24.1.12/2.jpg","moments素材/24.1.12/3.jpg","moments素材/24.1.12/4.jpg","moments素材/24.1.12/5.jpg","moments素材/24.1.12/6.jpg"] },
    
    { date: "2023. 12. 19", title: "❮  2023. 12. 19", 
         desc: `	冬天的冷风吹的人想祈愿平安顺遂岁岁年年。
	圣诞节前夕，有初雪。
	迎着暖黄色的路灯，
	一小朵飘下来，
	落在黑色外套上，
	细细看它变形的六个花瓣。
	不撑伞，仰着头，
	直到再也忍不住打扰你，
	打开录像，对着半空，
	告诉你，初雪来了。
	
	我特喜欢从室外走进一个正在煮东西的封闭空间。锅里可能煮着番茄锅，麻辣烫，关东煮，月牙形的萝卜水灵灵，炸好的肉丸二次下锅。空气的温度和湿度上来了，混合炖煮的香味，在进门的瞬间迎着冷风扑面而来，形成了那一秒回到家的感觉。
	这样大场面的香气多半是在屋外就能闻得到的，于是在还没进屋的地方形成了一种冷冷的湿湿的炖煮香，前调是菌香，后调是肉香，中间是香的一塌糊涂只想赶紧尝一口。这样的感受，最强烈的时刻，好像是归来和离开。
	
	好喜欢好喜欢冬天。
	学会了包饺子，
	和朋友们第一次了游玩，
	收到了UMELB的录取，
	离记忆中的少女时代最近，不用紧赶慢赶地去下一个人生路口。
	
	冷空气的来临给人的感觉是强烈的，到嘴边是念烂了的“自古逢秋悲寂寥”。尤其南京，对冬天是的描述不是“春夏秋冬”，而是“春夏咻——！冬”。
	于是马上穿起大衣，带起红色围巾，又是看鬼怪的季节。
	于是向往起初春，翻找手机里去年、前年、大前年的照片。

	好喜欢好喜欢冬天。`, 
        imgList: ["moments素材/23.12.19/1.jpg","moments素材/23.12.19/2.jpg","moments素材/23.12.19/3.jpg","moments素材/23.12.19/4.jpg","moments素材/23.12.19/5.jpg"] },
    
    { date: "2023. 12. 1", title: "❮  2023. 12. 1", 
         desc: `	某个瞬间会觉得：“哇，好幸运遇见这样温暖的人，我也能走她走过的路，看她来时的月亮。”`, 
        imgList: ["moments素材/23.12.1/1.jpg","moments素材/23.12.1/2.jpg","moments素材/23.12.1/3.jpg","moments素材/23.12.1/4.jpg"] },

    { date: "2023. 11. 13", title: "❮  2023. 11. 13", 
         desc: `	降温了。
	昨天收拾衣柜，从犄角旮旯里搜出了一套火红的襦裙，突然就想起了在小说里吃着腌笃鲜，听着《上邪》的念白的冬天。
	“山无陵，江水为竭，冬雷震震，夏雨雪。”锖青磁的语音，贰婶的demo，简直是贯穿整个青春的热爱。
	“人非木石皆有情，不如不遇倾城色。”也许是因为墨宝非宝笔下的理想世界，我想我是真的很喜欢“声音的存在”，不论是念白还是歌唱。
	所以当对声音的“处理”从影视音效做到音乐后期之后，突然觉得曾经戏言的“百万调音师”好像又可以拿出来当玩笑开开。当然了，也只是玩笑。
	那天进棚刚开口，录音老师：“你以前学过？”啊…刚喝完西北风就开口，这么久不练声都听得出来嘛…想起有时候听到旋律下意识地首调唱谱，有点感慨，又有点难过。
	一件太爱太爱的事情，​止步于此应该是不会的，到底是深爱还是执念，我也分不清了。
	不过爱与执念又有什么关系呢，向前奔跑，偶然回头，莫使金樽空对月就够了。`, 
        imgList: ["moments素材/23.11.13/1.jpg","moments素材/23.11.13/2.jpg"] },


    { date: "2023. 10. 20", title: "❮  2023. 10. 20", 
        desc: `	今天天气很好，风很大。
	出门的时候穿着短袖短裤，室友看了一眼：“你不要命啦，穿这么少。”
	嗯，听劝的孩子不会冷。于是回头换上长袖长裤。
	走去教学楼。
	路上的风钻到脖子里，明明穿着卫衣，却还是想戴上帽子拉紧系带。嗯，听劝的孩子不会冷。
	“春天的花开秋天的风，以及冬天的落阳。”
	进教室的时候，第一眼就看到了那一幕。红红落叶随风摇摆，一小片一小片地反射着阳光，亮晶晶地从窗台底下生长起来。被屋檐和窗棂围成的一小片天像是刚打开的、放了糖的苏打气泡水，日光咕嘟咕嘟地穿过空气，穿过树梢儿，随处消融在玻璃上、窗帘上、桌椅板凳上，留下氤氲的金黄色的痕迹。
	于是窗边的人都成了剪影，像是走在遥远的梦境里，分不清现实和想象了。`, 
        imgList: ["moments素材/23.10.20/1.jpg"] },
    
    { date: "2023. 8. 18", title: "❮  2023. 8. 18", 
         desc: `	谁家的顾未易从书里跑出来啦！
	“所有的青春都像一盏灯，在雨中被冲倒，湿漉漉却在燃烧。”

	感谢友 某一 倾情出镜。`, 
        imgList: ["moments素材/23.8.18/1.jpg","moments素材/23.8.18/2.jpg","moments素材/23.8.18/3.jpg","moments素材/23.8.18/4.jpg","moments素材/23.8.18/5.jpg","moments素材/23.8.18/6.jpg"] },
    
    { date: "2023. 1. 13", title: "❮  2023. 1. 13", 
         desc: `	这段旅途中遇见了很多惊喜，亲眼所见的精彩，照片最多只能表达十之五六。
	也有些许遗憾，清早起床去海边看大雾里的虚空日出，妈祖阁的愿望还没来得及去祈祷……
	短短几天，恋恋不舍。
	虽然有些时候强忍困意听课，早上起床恨不得把酸痛的脚砍掉，但是收获到的知识和快乐远远超出了付出的代价。
	有句老话叫，因为一个人爱上了一座城。
	这一群熟悉的、陌生的、到最后连名字都还不知道的小孩，以及我们共同走过的校园、爬过的坡道，构成了我对这座城的热爱和对存在于这段记忆中的所有人的热爱。
	回成都的飞机有些颠簸。
	大雾四起。`, 
        imgList: ["moments素材/23.1.13/1.jpg","moments素材/23.1.13/2.jpg","moments素材/23.1.13/3.jpg","moments素材/23.1.13/4.jpg","moments素材/23.1.13/5.jpg"] },
    
];

// 页面元素
const timelineView = document.getElementById('timeline-view');
const detailView = document.getElementById('detail-view');
const timelineContainer = document.getElementById('timeline-container');
const backTitle = document.getElementById('back-timeline');
const detailTitle = document.querySelector('.detail-title');
const detailDesc = document.getElementById('detail-desc');
const detailImagesBox = document.getElementById('detail-images-box');
const imgPreview = document.getElementById('img-preview');
const previewImg = document.getElementById('preview-img');

let savedScrollTop = 0;
let currentDetailId = null;

// ============================================================
// 渲染时间线
// ============================================================
function renderTimeline() {
    timelineContainer.innerHTML = '';
    timelineData.forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';
        
        let cardsHtml = '';
        if (item.desc && item.desc.length > 0) {
            const textPreview = item.desc.length > 28 ? item.desc.slice(0, 28) + '…' : item.desc;
            cardsHtml += `<div class="timeline-card empty-card" data-id="${idx}"><span>${textPreview}</span></div>`;
        }
        if (item.imgList && item.imgList.length > 0) {
            item.imgList.forEach((src, imgIdx) => {
                cardsHtml += `<div class="timeline-card" data-id="${idx}" data-img-index="${imgIdx}"><img src="${src}" alt=""></div>`;
            });
        }
        if (cardsHtml === '') {
            cardsHtml = `<div class="timeline-card empty-card" data-id="${idx}"><span>（无内容）</span></div>`;
        }
        itemDiv.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-date" data-id="${idx}">${item.date}</div>
            <div class="timeline-images">
                ${cardsHtml}
            </div>
        `;
        timelineContainer.appendChild(itemDiv);
    });
    bindTimelineEvents();
}

function bindTimelineEvents() {
    document.querySelectorAll('.timeline-date').forEach(el => {
        el.removeEventListener('click', timelineDateHandler);
        el.addEventListener('click', timelineDateHandler);
    });
    document.querySelectorAll('.timeline-card:not(.empty-card)').forEach(el => {
        el.removeEventListener('click', timelineCardHandler);
        el.addEventListener('click', timelineCardHandler);
    });
    document.querySelectorAll('.timeline-card.empty-card').forEach(el => {
        el.removeEventListener('click', emptyCardHandler);
        el.addEventListener('click', emptyCardHandler);
    });
}
function timelineDateHandler(e) { const id = e.currentTarget.dataset.id; loadDetail(id); }
function timelineCardHandler(e) { 
    const card = e.currentTarget;
    const id = card.dataset.id;
    const imgIdx = card.dataset.imgIndex;
    loadDetail(id, Number(imgIdx));
}
function emptyCardHandler(e) { const id = e.currentTarget.dataset.id; loadDetail(id); }

// ============================================================
// 核心修改：loadDetail 中全宽判断逻辑
// ============================================================
function loadDetail(id, activeImgIndex = -1) {
    currentDetailId = id;
    savedScrollTop = window.scrollY;
    const data = timelineData[id];
    detailTitle.innerText = data.title;
    detailDesc.innerText = data.desc;
    
    detailImagesBox.innerHTML = data.imgList.map((src, idx) => 
        `<div class="detail-card" data-img-src="${src}"><img src="${src}" alt=""></div>`
    ).join('');
    
    // 判断是否应用全宽（大图）展示：
    // 1. 如果 desc 为空（只有图片），则无论图片数量多少都全宽
    // 2. 否则，按照原规则：图片数 ≤ 3 且 > 0 时全宽
    const isDescEmpty = !data.desc || data.desc.trim() === '';
    if (isDescEmpty || (data.imgList.length <= 3 && data.imgList.length > 0)) {
        detailImagesBox.classList.add('full-width');
    } else {
        detailImagesBox.classList.remove('full-width');
    }
    
    timelineView.classList.add('hidden');
    detailView.classList.remove('hidden');
    imgPreview.classList.add('hidden');

    const overlay = document.querySelector('.bg-overlay');
    if (overlay) overlay.classList.add('dark');
    
    window.scrollTo(0, 0);
    
    bindDetailImagesEvent();
    if (activeImgIndex >= 0 && data.imgList[activeImgIndex]) {
        openPreview(id, activeImgIndex);
    }
}
// ============================================================

function bindDetailImagesEvent() {
    document.querySelectorAll('.detail-card').forEach(el => {
        el.removeEventListener('click', detailImageClick);
        el.addEventListener('click', detailImageClick);
    });
}

function detailImageClick(e) {
    const src = e.currentTarget.dataset.imgSrc;
    const id = currentDetailId;
    if (id === null) return;
    const data = timelineData[id];
    if (!data || !data.imgList) return;
    const idx = data.imgList.indexOf(src);
    if (idx !== -1) {
        openPreview(id, idx);
    } else {
        openPreview(id, 0);
    }
}

// ============================================================
// 预览层切换功能（支持键盘左右键和触摸滑动）
// 修改：最后一张不再循环到第一张，第一张不再循环到最后一张
// ============================================================
let previewData = { id: null, index: 0, list: [] };
let isSwiping = false;
let touchStartX = 0;

function openPreview(id, index) {
    if (id === undefined || id === null) return;
    const data = timelineData[id];
    if (!data || !data.imgList || data.imgList.length === 0) return;
    
    previewData.id = id;
    previewData.index = Math.min(Math.max(index, 0), data.imgList.length - 1);
    previewData.list = data.imgList;
    
    previewImg.src = previewData.list[previewData.index];
    imgPreview.classList.remove('hidden');
    
    document.addEventListener('keydown', previewKeyHandler);
    imgPreview.addEventListener('touchstart', previewTouchStartHandler, { passive: true });
    imgPreview.addEventListener('touchmove', previewTouchMoveHandler, { passive: true });
    imgPreview.addEventListener('touchend', previewTouchEndHandler, { passive: true });
    imgPreview.addEventListener('click', previewClickHandler);
}

function previewKeyHandler(e) {
    if (!imgPreview.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previewPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            previewNext();
        } else if (e.key === 'Escape') {
            closePreview();
        }
    }
}

function previewTouchStartHandler(e) {
    isSwiping = false;
    touchStartX = e.touches[0].clientX;
}

function previewTouchMoveHandler(e) {
    // 不做操作
}

function previewTouchEndHandler(e) {
    if (!imgPreview.classList.contains('hidden')) {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) > 50) {
            isSwiping = true;
            if (deltaX < 0) {
                previewNext();
            } else {
                previewPrev();
            }
        }
    }
}

function previewClickHandler(e) {
    if (isSwiping) {
        isSwiping = false;
        return;
    }
    closePreview();
}

// ===== 边界处不再循环 =====
function previewPrev() {
    if (previewData.list.length <= 1) return;
    if (previewData.index > 0) {
        previewData.index--;
        previewImg.src = previewData.list[previewData.index];
    }
}

function previewNext() {
    if (previewData.list.length <= 1) return;
    if (previewData.index < previewData.list.length - 1) {
        previewData.index++;
        previewImg.src = previewData.list[previewData.index];
    }
}
// ===== 结束 =====

function closePreview() {
    imgPreview.classList.add('hidden');
    document.removeEventListener('keydown', previewKeyHandler);
    imgPreview.removeEventListener('touchstart', previewTouchStartHandler);
    imgPreview.removeEventListener('touchmove', previewTouchMoveHandler);
    imgPreview.removeEventListener('touchend', previewTouchEndHandler);
    imgPreview.removeEventListener('click', previewClickHandler);
    previewData.id = null;
    previewData.index = 0;
    previewData.list = [];
    isSwiping = false;
}

function backToTimeline() {
    if (!imgPreview.classList.contains('hidden')) {
        closePreview();
    }
    detailView.classList.add('hidden');
    timelineView.classList.remove('hidden');
    const overlay = document.querySelector('.bg-overlay');
    if (overlay) overlay.classList.remove('dark');
    window.scrollTo(0, savedScrollTop);
}

backTitle.addEventListener('click', backToTimeline);
renderTimeline();

// ===============================
// 粒子系统 (基于音频分析)
// ===============================
(function initParticleVisuals() {
    let color = { core: "255,255,255", glow: "255,255,255" };
    function hexToRgb(hex) {
        let h = hex.startsWith('#') ? hex.slice(1) : hex;
        if (h.length === 3) h = h.split('').map(c=>c+c).join('');
        const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
        return `${r},${g},${b}`;
    }
    particleColorUpdater = function(hexColor) {
        const rgb = hexToRgb(hexColor);
        color.core = rgb;
        color.glow = rgb;
    };
    particleColorUpdater("#ffffff");
    
    const container = document.getElementById("particles");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    container.appendChild(canvas);
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    let audioContext = null, analyser = null, source = null;
    function initAudioAnalysis() {
        if (audioContext) return;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
        } catch(e) { console.warn(e); }
    }
    function resumeAudioContext() { if (audioContext && audioContext.state === "suspended") audioContext.resume(); }
    audio.addEventListener("play", () => { if(!audioContext) initAudioAnalysis(); resumeAudioContext(); });
    miniPlayer.addEventListener("click", () => { if(!audioContext) initAudioAnalysis(); if(audioContext) audioContext.resume(); });
    
    let smoothVolume = 0, dataArray = null;
    let mouse = { x: null, y: null, isDown: false, radius: 180 };
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mousedown', () => { mouse.isDown = true; });
    window.addEventListener('mouseup', () => { mouse.isDown = false; });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 1.2 + 0.7;
            this.size = this.baseSize;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.baseVY = -(0.65 + Math.random() * 0.2);
            this.vy = this.baseVY;
            this.twinkle = Math.random() * 10;
            this.wave = Math.random() * 100;
        }
        update(smoothVol) {
            this.twinkle += 0.06;
            this.wave += 0.04;
            this.vy += (this.baseVY - this.vy) * 0.03;
            const baseWind = smoothVol * 0.0006;
            const noise = Math.sin(this.wave * 0.001) * 0.0002;
            this.vx += baseWind + noise;
            this.vx += Math.sin(this.wave * 0.7) * 0.012;
            this.vy += Math.cos(this.wave * 1.1) * 0.012;
            this.x += this.vx;
            this.y += this.vy;
            if (mouse.isDown && mouse.x) {
                const dx = this.x - mouse.x, dy = this.y - mouse.y, dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const angle = Math.atan2(dy, dx), force = (mouse.radius - dist) / mouse.radius * 0.45;
                    this.vx += Math.cos(angle) * force;
                    this.vy += Math.sin(angle) * force;
                }
            }
            const damping = 0.98 - smoothVol * 0.001;
            this.vx *= damping; this.vy *= damping;
            if (this.y < -80) { this.y = canvas.height + 50; this.x = Math.random() * canvas.width; }
            if (this.y > canvas.height + 80) { this.y = -50; this.x = Math.random() * canvas.width; }
            if (this.x < -80) this.x = canvas.width + 50;
            if (this.x > canvas.width + 80) this.x = -50;
            let targetSize = this.baseSize + smoothVol * 0.18 + Math.sin(this.twinkle) * 0.4;
            if (targetSize > this.baseSize * 4.0) targetSize = this.baseSize * 4.0;
            this.size += (targetSize - this.size) * 0.1;
        }
        draw() {
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
            grad.addColorStop(0, `rgba(${color.core}, 0.95)`);
            grad.addColorStop(0.3, `rgba(${color.core}, 0.6)`);
            grad.addColorStop(0.6, `rgba(${color.glow}, 0.25)`);
            grad.addColorStop(1, `rgba(${color.glow}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI*2);
            ctx.fill();
        }
    }
    let particles = [];
    function updateParticleCount(smoothVol) {
        let target = 30 + Math.floor(smoothVol * 0.55);   // 基础粒子数 + 音量影响
        while (particles.length < target) particles.push(new Particle());
        if (particles.length > 200) particles = particles.slice(-200);
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let rawVol = 0;
        if (analyser && !audio.paused && audioContext && audioContext.state === "running") {
            if (!dataArray) dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            rawVol = dataArray.reduce((s,v)=>s+v,0)/dataArray.length;
        }
        smoothVolume += (rawVol - smoothVolume) * 0.1;
        updateParticleCount(smoothVolume);
        for (let p of particles) { p.update(smoothVolume); p.draw(); }
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = `rgba(${color.glow}, 0.18)`;
        ctx.lineWidth = 0.3;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                if (Math.hypot(dx, dy) < 95) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    }
    animate();
})();

// ============================================================
// 视频背景自动播放终极兜底（兼容所有移动端）
// ============================================================
(function() {
    var video = document.getElementById('bgVideo');
    if (!video) return;

    // 尝试播放函数
    function attemptPlay() {
        return video.play().catch(function(e) {
            console.warn('视频播放失败:', e.message);
            return false;
        });
    }

    // 1. 立即尝试
    var firstTry = attemptPlay();

    // 2. 如果失败，监听用户手势
    firstTry.then(function(success) {
        if (!success) {
            var events = ['touchstart', 'click', 'touchend', 'keydown'];
            var handler = function() {
                attemptPlay().then(function(ok) {
                    if (ok) {
                        // 播放成功后移除监听
                        events.forEach(function(ev) {
                            document.removeEventListener(ev, handler);
                        });
                    }
                });
            };
            events.forEach(function(ev) {
                document.addEventListener(ev, handler, { passive: true });
            });
        }
    });

    // 3. 页面可见性变化时重试（用户切换回页面）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            attemptPlay();
        }
    });

    // 4. 视频加载错误后重试
    video.addEventListener('error', function() {
        console.warn('视频错误，2秒后重试');
        setTimeout(attemptPlay, 2000);
    });

    // 5. 如果意外结束，重新播放（loop 属性已存在，但保险）
    video.addEventListener('ended', function() {
        video.currentTime = 0;
        attemptPlay();
    });
})();
