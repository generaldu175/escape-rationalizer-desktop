// 1. 填入你的 API Key (确保 sk- 开头，没有空格)
const apiKey = 'sk-a22dce5be3a4414b912ff266a071dc05'; 

// 2. 获取页面元素
const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');
const inputField = document.getElementById('user-input');

// 3. 定义 AI 调用函数
async function callAI(content, systemPrompt) {
    try {
        console.log("正在尝试连接 DeepSeek API...");
        
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey.trim()}` // trim() 自动去除首尾空格
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: content }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API 返回错误:", errorData);
            return `服务器拒绝了请求: ${response.status} - ${errorData.message || '未知错误'}`;
        }

        const data = await response.json();
        console.log("解析数据成功:", data);
        return data.choices[0].message.content;

    } catch (e) {
        console.error("网络连接失败:", e);
        return `网络连接失败，请检查是否断网或 API 域名被拦截。错误信息: ${e.message}`;
    }
}

// 4. 日志渲染函数
function addLog(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    // 自动滚动到底部
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 5. 点击事件
sendBtn.onclick = async () => {
    const text = inputField.value.trim();
    if (!text) return;

    // 清空输入框并显示用户消息
    addLog('user', text);
    inputField.value = '';

    // 显示“正在思考”状态
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message system';
    loadingDiv.innerText = '正在拉扯中...';
    chatWindow.appendChild(loadingDiv);

    const reply = await callAI(text, "你是一个专门为‘北漂’和‘打工人’服务的逃避合理化生成器。请用略带幽默、毒舌但又极其合理的口吻，给出4个逃避的理由，最后再温情地劝导一下。");
    
    // 移除“正在思考”，显示正式回复
    chatWindow.removeChild(loadingDiv);
    addLog('system', reply);
};

// 6. 支持回车发送
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
