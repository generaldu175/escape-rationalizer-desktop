const apiKey = 'sk-a22dce5be3a4414b912ff266a071dc05';
const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');
const inputField = document.getElementById('user-input');

async function callAI(content, systemPrompt) {
    try {
        const res = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sk-a22dce5be3a4414b912ff266a071dc05}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: content }]
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) {
        return "信号不好，AI掉线了...请检查Key是否正确。";
    }
}

function addLog(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.onclick = async () => {
    const text = inputField.value;
    if(!text) return;
    addLog('user', text);
    inputField.value = '';
    const reply = await callAI(text, "你是一个逃避合理化生成器。请先给4个合理解释（心理、社会、经济、文艺），再像好朋友一样劝导。");
    addLog('system', reply);
};
