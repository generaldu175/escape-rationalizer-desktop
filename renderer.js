const apiKey = 'sk-a22dce5be3a4414b912ff266a071dc05'; // 1. 填入你的 Key，别带空格
const chatWindow = document.getElementById('chat-window');
const actionArea = document.getElementById('action-area');

let round = 1; 
let userTask = ""; // 记录用户想逃避的具体事情

async function callAI(content, systemPrompt) {
    try {
        console.log(`[R${round}] 发送请求:`, content);
        const res = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey.trim()}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: content }],
                temperature: 0.7 // 增加一点随机性，避免话术千篇一律
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) { return "信号中断，拉扯不下去了..."; }
}

function addLog(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 核心：创建选项按钮
function createOptions(btnAText, btnBText) {
    actionArea.innerHTML = ''; 
    const btnA = document.createElement('button');
    btnA.innerText = btnAText;
    btnA.onclick = () => handleChoice('A'); // A: 被说服
    
    const btnB = document.createElement('button');
    btnB.innerText = btnBText;
    btnB.style.background = "#ff00ff"; 
    btnB.onclick = () => handleChoice('B'); // B: 继续抵抗
    
    actionArea.appendChild(btnA);
    actionArea.appendChild(btnB);
}

async function handleChoice(type) {
    if (type === 'A') {
        addLog('user', "好吧，我这就去行动...");
        addLog('system', "【任务达成】这就对了！现在立刻关掉电脑，去发光发热吧！再见。");
        setTimeout(resetToInput, 3000);
    } else {
        round++;
        addLog('user', "我不去，再拉扯一下？");
        processStep();
    }
}

async function processStep() {
    let prompt = "";
    
    // 基础语义：AI 必须时刻记得用户不想做的事是 ${userTask}
    if (round === 1) {
        // 第一轮：博学损友。给理由，针对逃避的事给出精准的劝导
        prompt = `
            你是一个懂心理学的博学损友。用户不想做的事是：“${userTask}”。
            请针对这件事进行语义分析，精准找出他想逃避的核心（是怕麻烦、怕失败、还是单纯懒？）。
            1. 给出4个极其合理的逃避理由（涵盖心理、社会、经济、自然科学）。
            2. 话锋一转，用温和但精准的语气剖析他的内心，劝导他：‘我知道你怕 ${userTask}，但逃避只会更痛苦，行动起来其实没那么难。理由很足，但你还是去做了吧！’。
            3. 最后温和问他：‘现在要去吗？’。
            *要求：话术必须针对“${userTask}”具体内容，不要说套话。*
        `;
        const reply = await callAI(userTask, prompt);
        addLog('system', reply);
        createOptions("被说服了，我去", "我不，再找个理由");
        
    } else if (round === 2) {
        // 第二轮：愤怒教导主任。拒绝理由，严厉攻心
        prompt = `
            用户意志坚定，死不悔改地逃避：“${userTask}”。这轮不要给任何逃避理由！
            你现在的身份是愤怒且失望的教导主任。
            请用严厉、恨铁不成钢的口吻骂醒他。要针对“${userTask}”这件事，直接指出他不行动的代价和后果（对他未来的负面影响）。剖析他的软弱和拖延。
            用极致的心理高压，劝服他去面对现实。
            最后严肃问他：‘现在，你到底去不去？’。
            *要求：严厉程度升级，话术必须精准打击，不要千篇一律。*
        `;
        const reply = await callAI(userTask, prompt);
        addLog('system', reply);
        createOptions("我去还不成吗...", "再骂两句，我不去");
        
    } else if (round === 3) {
        // 第三轮：卑微舔狗。动之以情，求他去
        prompt = `
            用户意志铁石心肠，面对教导主任的辱骂依然坚定逃避：“${userTask}”。
            请你彻底放下尊严，用卑微、求求你、甚至撒娇利诱的舔狗口吻。
            针对“${userTask}”这件事，动之以情晓之以理。说尽好话，利诱他（比如‘只要你去见老板，我当你一个月的免费司机’），求他为了你、为了大家都好，一定一定要去。浑身解数动用一切情绪手段（撒娇、卖萌、苦肉计）。
            最后问他：‘求求你了，去一次好吗？’。
        `;
        const reply = await callAI(userTask, prompt);
        addLog('system', reply);
        createOptions("被感动了，我去", "铁石心肠，就不去");
        
    } else {
        // 第四轮：破防作罢
        addLog('system', `【系统破防摆烂】算了，我也没招了。连“跪求”都免疫，你确实是逃避界的王者。我不劝了，你赢了，去享受你那该死的自由吧。再见！`);
        setTimeout(resetToInput, 4000);
    }
}

function resetToInput() {
    round = 1;
    actionArea.innerHTML = `
        <input type="text" id="user-input" placeholder="输入你想逃避的事...">
        <button id="send-btn">开启拉扯</button>
    `;
    document.getElementById('send-btn').onclick = startApp;
}

async function startApp() {
    const input = document.getElementById('user-input');
    userTask = input.value.trim();
    if (!userTask) return;
    addLog('user', `我真的不想去：${userTask}`);
    input.value = ''; // 清空输入
    processStep();
}

document.getElementById('send-btn').onclick = startApp;
