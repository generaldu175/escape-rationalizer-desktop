const apiKey = '你的sk-Key'; // ⭐ 记得填入你的 Key

const chatWindow = document.getElementById('chat-window');
const actionArea = document.getElementById('action-area');

let round = 1; 
let userTask = ""; 

// --- 战绩统计小账本 ---
const stats = {
    getTodayKey: () => new Date().toLocaleDateString(),
    save: (type) => {
        const today = stats.getTodayKey();
        let data = JSON.parse(localStorage.getItem('vibe_stats') || '{}');
        if (!data[today]) data[today] = { success: 0, fail: 0 };
        data[today][type]++;
        localStorage.setItem('vibe_stats', JSON.stringify(data));
    },
    getToday: () => JSON.parse(localStorage.getItem('vibe_stats') || '{}')[stats.getTodayKey()] || { success: 0, fail: 0 }
};

// 页面加载显示今日数据
window.onload = () => {
    const d = stats.getToday();
    if (d.success > 0 || d.fail > 0) {
        addLog('system', `【今日战绩】你已成功被劝回 ${d.success} 次，彻底摆烂 ${d.fail} 次。加油，打工人！`);
    }
};

async function callAI(content, systemPrompt) {
    try {
        const res = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey.trim()}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: content }],
                temperature: 0.8
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) { return "网络波动，拉扯断线了..."; }
}

function addLog(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function createOptions(btnAText, btnBText) {
    actionArea.innerHTML = ''; 
    const btnA = document.createElement('button');
    btnA.className = 'opt-btn btn-a';
    btnA.innerText = btnAText;
    btnA.onclick = () => handleChoice('A'); 
    const btnB = document.createElement('button');
    btnB.className = 'opt-btn btn-b';
    btnB.innerText = btnBText;
    btnB.onclick = () => handleChoice('B'); 
    actionArea.appendChild(btnA);
    actionArea.appendChild(btnB);
}

async function handleChoice(type) {
    if (type === 'A') {
        stats.save('success');
        addLog('user', "好吧，我去做了。");
        addLog('system', `【拉扯成功】去吧！今日已成功自律 ${stats.getToday().success} 次！`);
        setTimeout(resetToInput, 3000);
    } else {
        round++;
        if (round > 3) {
            stats.save('fail');
            addLog('user', "就是不去！");
            addLog('system', `【拉扯失败】你赢了，去摆烂吧。今日累计摆烂 ${stats.getToday().fail} 次。`);
            setTimeout(resetToInput, 3000);
        } else {
            addLog('user', "我不去，继续拉扯。");
            processStep();
        }
    }
}

async function processStep() {
    let prompt = "";
    if (round === 1) prompt = `针对“${userTask}”，分析语义，给4个逃避理由并温和劝导。最后问：要去吗？`;
    else if (round === 2) prompt = `用户针对“${userTask}”死不悔改。严厉教训，指出不行动的严重后果。问：到底去不去？`;
    else if (round === 3) prompt = `用户意志铁石心肠。请卑微地、跪求地动之以情晓之以理。最后问：求你了去一次好吗？`;
    
    const reply = await callAI(userTask, prompt);
    addLog('system', reply);
    createOptions("被说服了", "就是不去");
}

function resetToInput() {
    round = 1;
    actionArea.innerHTML = `<input type="text" id="user-input" placeholder="输入你想逃避的事..."><button id="send-btn">开启拉扯</button>`;
    document.getElementById('send-btn').onclick = startApp;
}

async function startApp() {
    const input = document.getElementById('user-input');
    userTask = input.value.trim();
    if (!userTask) return;
    addLog('user', `我不想：${userTask}`);
    input.value = '';
    processStep();
}

document.getElementById('send-btn').onclick = startApp;
