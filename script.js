// 游戏状态管理
const gameState = {
    currentScreen: 'start',
    currentQuestion: null,
    timer: null,
    timeLeft: 90,
    hintUsed: false,
    currentExp: 0,
    currentRank: 0
};

// 段位配置
const ranks = [
    { name: "斗之气", requiredExp: 100, totalExp: 100 },
    { name: "斗者", requiredExp: 200, totalExp: 300 },
    { name: "斗师", requiredExp: 400, totalExp: 700 },
    { name: "大斗师", requiredExp: 800, totalExp: 1500 },
    { name: "斗灵", requiredExp: 1500, totalExp: 3000 },
    { name: "斗王", requiredExp: 3000, totalExp: 6000 },
    { name: "斗皇", requiredExp: 5000, totalExp: 11000 },
    { name: "斗宗", requiredExp: 8000, totalExp: 19000 },
    { name: "斗尊", requiredExp: 12000, totalExp: 31000 },
    { name: "斗尊巅峰", requiredExp: 18000, totalExp: 49000 },
    { name: "半圣", requiredExp: 25000, totalExp: 74000 },
    { name: "斗圣", requiredExp: 35000, totalExp: 109000 },
    { name: "斗帝", requiredExp: 50000, totalExp: 159000 }
];

// DOM元素
const app = document.getElementById('app');

// 初始化游戏
function initGame() {
    renderScreen('start');
}

// 渲染不同界面
function renderScreen(screen) {
    gameState.currentScreen = screen;
    app.innerHTML = '';
    
    switch(screen) {
        case 'start':
            renderStartScreen();
            break;
        case 'game':
            renderGameScreen();
            break;
        case 'result':
            renderResultScreen();
            break;
    }
}

// 渲染开始界面
function renderStartScreen() {
    // 创建标题
    const title = document.createElement('h1');
    title.textContent = '斗破·脑力焚天';
    title.style.textAlign = 'center';
    title.style.fontSize = '2.8rem';
    title.style.marginBottom = '40px';
    title.style.color = '#d4af37';
    title.style.textShadow = '0 0 15px rgba(212, 175, 55, 0.5)';
    title.style.position = 'relative';
    title.style.fontFamily = 'KaiTi', 'STKaiti', 'serif';
    title.style.textAlign = 'center';
    title.style.fontSize = '2.5rem';
    title.style.marginBottom = '40px';
    title.style.color = '#b38b59';
    title.style.textShadow = '1px 1px 2px rgba(0,0,0,0.1)';
    title.style.position = 'relative';
    
    // 添加装饰元素
    const decorLeft = document.createElement('div');
    decorLeft.style.position = 'absolute';
    decorLeft.style.left = '-40px';
    decorLeft.style.top = '50%';
    decorLeft.style.transform = 'translateY(-50%)';
    decorLeft.style.width = '30px';
    decorLeft.style.height = '2px';
    decorLeft.style.background = '#b38b59';
    
    const decorRight = document.createElement('div');
    decorRight.style.position = 'absolute';
    decorRight.style.right = '-40px';
    decorRight.style.top = '50%';
    decorRight.style.transform = 'translateY(-50%)';
    decorRight.style.width = '30px';
    decorRight.style.height = '2px';
    decorRight.style.background = '#b38b59';
    
    title.appendChild(decorLeft);
    title.appendChild(decorRight);
    
    // 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.flexDirection = 'column';
    btnContainer.style.alignItems = 'center';
    btnContainer.style.gap = '15px';
    
    // 创建按钮
    const logicBtn = createButton('逻辑推演 🧠', () => startGame('逻辑推理'));
    const mathBtn = createButton('算术玄机 ⚗️', () => startGame('数学谜题'));
    const wordBtn = createButton('文字密卷 📜', () => startGame('文字解谜'));
    
    // 设置按钮样式
    [logicBtn, mathBtn, wordBtn].forEach(btn => {
        btn.style.width = '200px';
        btn.style.padding = '15px 0';
    });
    
    btnContainer.appendChild(logicBtn);
    btnContainer.appendChild(mathBtn);
    btnContainer.appendChild(wordBtn);
    
    app.appendChild(title);
    app.appendChild(btnContainer);
}

// 创建按钮
function createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
}

// 开始游戏
function startGame(type) {
    gameState.currentType = type;
    gameState.timeLeft = 90;
    gameState.hintUsed = false;
    renderScreen('game');
    generateQuestion(type);
}

// 嘲讽语句库
const taunts = {
    "逻辑推理": [
        "此等逻辑推演，竟也能难住道友？",
        "道友的推演之术，尚需多加修炼啊！",
        "此乃基础推演，道友竟迟迟未能看破？",
        "若连此等逻辑都无法参透，何谈大道争锋！"
    ],
    "数学谜题": [
        "算术玄机，道友竟也束手无策？",
        "此等算术小技，竟也能难住道友？",
        "连这点算术玄机都参不透，还需苦修啊！",
        "道友的算术修为，怕是还在炼气期徘徊吧！"
    ],
    "文字解谜": [
        "此等文字密卷，道友竟无法破译？",
        "连这点文字玄机都看不破，枉称读书人！",
        "道友对文字的感悟，还需多加精进啊！",
        "此乃基础文字密卷，竟也难住道友了？"
    ]
};

// 获取随机嘲讽语句
function getRandomTaunt(type) {
    const tauntList = taunts[type] || [];
    return tauntList[Math.floor(Math.random() * tauntList.length)];
}

// 渲染游戏界面
function renderGameScreen() {
    // 创建计时器
    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer';
    timerContainer.id = 'timer';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'timer-circle');
    svg.setAttribute('viewBox', '0 0 100 100');
    
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('class', 'timer-circle-bg');
    bgCircle.setAttribute('cx', '50');
    bgCircle.setAttribute('cy', '50');
    bgCircle.setAttribute('r', '45');
    
    const fillCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fillCircle.setAttribute('class', 'timer-circle-fill');
    fillCircle.setAttribute('cx', '50');
    fillCircle.setAttribute('cy', '50');
    fillCircle.setAttribute('r', '45');
    fillCircle.setAttribute('stroke-dasharray', '283');
    fillCircle.setAttribute('stroke-dashoffset', '0');
    
    const timerText = document.createElement('div');
    timerText.className = 'timer-text';
    timerText.textContent = gameState.timeLeft;
    
    svg.appendChild(bgCircle);
    svg.appendChild(fillCircle);
    timerContainer.appendChild(svg);
    timerContainer.appendChild(timerText);
    
    // 创建题目区域
    const question = document.createElement('div');
    question.className = 'question';
    question.id = 'question';
    question.textContent = '加载题目中...';
    question.style.background = 'rgba(255, 255, 255, 0.8)';
    question.style.padding = '20px';
    question.style.borderRadius = '8px';
    question.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    question.style.borderLeft = '4px solid #b38b59';
    
    // 创建提示按钮
    const hintBtn = createButton('💡 寻求感悟', useHint);
    hintBtn.id = 'hintBtn';
    
    // 创建答案输入框
    const answerInput = document.createElement('textarea');
    answerInput.id = 'answerInput';
    answerInput.placeholder = '输入你的答案，冲击更高境界...';
    answerInput.rows = 5;
    answerInput.style.width = '100%';
    answerInput.style.margin = '20px 0';
    answerInput.style.padding = '15px';
    answerInput.style.borderRadius = '8px';
    answerInput.style.border = '1px solid rgba(74, 101, 114, 0.2)';
    answerInput.style.background = 'rgba(255, 255, 255, 0.7)';
    answerInput.style.fontFamily = 'inherit';
    answerInput.style.fontSize = '16px';
    answerInput.style.transition = 'all 0.3s ease';
    
    answerInput.addEventListener('focus', () => {
        answerInput.style.borderColor = '#b38b59';
        answerInput.style.boxShadow = '0 0 0 2px rgba(179, 139, 89, 0.2)';
    });
    
    answerInput.addEventListener('blur', () => {
        answerInput.style.borderColor = 'rgba(74, 101, 114, 0.2)';
        answerInput.style.boxShadow = 'none';
    });
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.justifyContent = 'center';
    
    // 创建提交按钮
    const submitBtn = createButton('验证大道', submitAnswer);
    submitBtn.id = 'submitBtn';
    submitBtn.className += ' btn-primary';
    
    // 创建投降按钮
    const surrenderBtn = createButton('🏳️ 道心崩碎，跪地求饶', surrenderGame);
    surrenderBtn.className += ' btn-danger';
    
    buttonContainer.appendChild(submitBtn);
    buttonContainer.appendChild(surrenderBtn);
    
    // 添加嘲讽语句
    const tauntElement = document.createElement('div');
    tauntElement.className = 'taunt';
    tauntElement.textContent = getRandomTaunt(gameState.currentType);
    tauntElement.style.textAlign = 'center';
    tauntElement.style.fontStyle = 'italic';
    tauntElement.style.color = '#7f8c8d';
    tauntElement.style.margin = '15px 0';
    tauntElement.style.fontSize = '0.9rem';
    tauntElement.style.opacity = '0.8';
    
    app.appendChild(timerContainer);

    // 添加段位进度显示
    const rankContainer = document.createElement('div');
    rankContainer.className = 'rank-container';
    rankContainer.style.margin = '20px 0';
    rankContainer.style.textAlign = 'center';

    const rankTitle = document.createElement('div');
    rankTitle.id = 'rankTitle';
    rankTitle.style.fontSize = '1.2rem';
    rankTitle.style.color = '#b38b59';

    const progressBar = document.createElement('div');
    progressBar.style.height = '10px';
    progressBar.style.backgroundColor = 'rgba(74, 101, 114, 0.2)';
    progressBar.style.borderRadius = '5px';
    progressBar.style.overflow = 'hidden';

    const progressFill = document.createElement('div');
    progressFill.id = 'progressFill';
    progressFill.style.height = '100%';
    progressFill.style.backgroundColor = '#b38b59';
    progressFill.style.transition = 'width 0.3s ease';

    progressBar.appendChild(progressFill);
    rankContainer.appendChild(rankTitle);
    rankContainer.appendChild(progressBar);

    app.appendChild(rankContainer);
    updateRankDisplay();

    app.appendChild(tauntElement);
    app.appendChild(question);
    app.appendChild(hintBtn);
    app.appendChild(answerInput);
    app.appendChild(buttonContainer);
    
    updateTimerDisplay();
}

// 启动计时器
function startTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            handleTimeOut();
        }
    }, 1000);
}

// 更新计时器显示
function getCurrentRankInfo() {
    let currentRank = gameState.currentRank;
    
    // 检查是否可以升级
    while (currentRank < ranks.length && gameState.currentExp >= ranks[currentRank].totalExp) {
        currentRank++;
    }
    
    // 计算当前段位进度
    const previousTotalExp = currentRank > 0 ? ranks[currentRank - 1].totalExp : 0;
    const currentRankData = ranks[currentRank] || ranks[ranks.length - 1];
    const requiredExp = currentRankData.requiredExp;
    const progress = Math.min(100, Math.max(0, (gameState.currentExp - previousTotalExp) / requiredExp * 100));
    
    return {
        currentRank,
        currentName: currentRankData.name,
        currentExp: gameState.currentExp,
        nextExp: currentRankData.totalExp,
        requiredExp,
        progress
    };
}

function updateRankDisplay() {
    const rankInfo = getCurrentRankInfo();
    gameState.currentRank = rankInfo.currentRank;
    
    const rankTitle = document.getElementById('rankTitle');
    const progressFill = document.getElementById('progressFill');
    
    if (rankTitle && progressFill) {
        rankTitle.textContent = `${rankInfo.currentName} (${rankInfo.currentExp}/${rankInfo.nextExp})`;
        progressFill.style.width = `${rankInfo.progress}%`;
    }
}

function updateTimerDisplay() {
    const timerText = document.querySelector('.timer-text');
    const fillCircle = document.querySelector('.timer-circle-fill');
    const timerContainer = document.getElementById('timer');
    
    if (timerText && fillCircle && timerContainer) {
        timerText.textContent = gameState.timeLeft;
        
        // 计算进度条偏移量
        const circumference = 283; // 2 * π * r (2 * 3.1416 * 45)
        const offset = circumference - (gameState.timeLeft / 90) * circumference;
        fillCircle.setAttribute('stroke-dashoffset', offset);
        
        // 根据剩余时间更新样式
        timerContainer.classList.remove('warning', 'danger');
        
        if (gameState.timeLeft <= 30 && gameState.timeLeft > 15) {
            timerContainer.classList.add('warning');
            fillCircle.setAttribute('stroke', '#FF9800');
        } else if (gameState.timeLeft <= 15) {
            timerContainer.classList.add('danger');
            fillCircle.setAttribute('stroke', '#F44336');
        } else {
            fillCircle.setAttribute('stroke', '#4CAF50');
        }
    }
}

// 调用DeepSeek API生成题目
async function generateQuestion(type) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + process.env.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{
                    role: 'user',
                    content: `生成一个中等难度的${type}谜题，返回JSON：{\n  \"id\": \"唯一ID\",\n  \"question\": \"题目内容\",\n  \"hint\": \"提示内容\",\n  \"answer\": \"正确答案\"\n}`
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // 提取JSON部分 - 使用正则表达式更可靠地匹配JSON对象
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('无法从API响应中提取有效的JSON数据');
        }
        let jsonStr = jsonMatch[0];
        
        // 确保只保留到最后一个}
        const lastBraceIndex = jsonStr.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            jsonStr = jsonStr.substring(0, lastBraceIndex + 1);
        }
        
        // 清理常见的JSON格式问题，如trailing commas
        jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');
        
        // 尝试解析JSON并处理可能的错误
        let questionData;
        try {
            questionData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError);
            console.error('清理后的JSON字符串:', jsonStr);
            throw new Error(`JSON解析错误: ${parseError.message}`);
        }
        gameState.currentQuestion = questionData;
        
        // 更新题目显示
        const questionElement = document.getElementById('question');
        if (questionElement) {
            questionElement.textContent = questionData.question;
            startTimer(); // 题目加载完成后启动计时器
        }
    } catch (error) {
        console.error('生成题目失败:', error);
        const questionElement = document.getElementById('question');
        if (questionElement) {
            questionElement.textContent = '题目加载失败，请重试';
        }
    }
}

// 使用提示
function useHint() {
    if (gameState.hintUsed || !gameState.currentQuestion) return;
    
    gameState.hintUsed = true;
    const hintBtn = document.getElementById('hintBtn');
    hintBtn.disabled = true;
    
    // 添加灯泡点亮效果
    hintBtn.innerHTML = '💡 提示已使用';
    hintBtn.style.color = '#b38b59';
    hintBtn.style.boxShadow = '0 0 10px rgba(179, 139, 89, 0.5)';
    
    // 创建提示元素
    const hintElement = document.createElement('div');
    hintElement.className = 'hint';
    hintElement.innerHTML = 
        `<div style="display:flex;align-items:center;margin-bottom:10px;">
            <span style="font-size:1.2rem;color:#b38b59;margin-right:10px;">💡</span>
            <span style="font-weight:bold;color:#4a6572;">提示：</span>
        </div>
        <p style="margin:0;line-height:1.6;color:#334e5c;">${gameState.currentQuestion.hint}</p>`;
    
    hintElement.style.margin = '20px 0';
    hintElement.style.padding = '20px';
    hintElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    hintElement.style.borderRadius = '8px';
    hintElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    hintElement.style.borderLeft = '4px solid #b38b59';
    hintElement.style.opacity = '0';
    hintElement.style.transform = 'translateY(10px)';
    hintElement.style.transition = 'all 0.3s ease';
    
    const questionElement = document.getElementById('question');
    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
    
    // 触发动画
    setTimeout(() => {
        hintElement.style.opacity = '1';
        hintElement.style.transform = 'translateY(0)';
    }, 10);
}

// 提交答案
async function submitAnswer() {
    if (!gameState.currentQuestion) return;
    
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    const userAnswer = answerInput ? answerInput.value.trim() : '';
    
    // 显示加载状态
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-dots">正在推演大道<span>.</span><span>.</span><span>.</span></div>';
    }
    
    clearInterval(gameState.timer);
    await validateAnswer(userAnswer);
    
    // 恢复按钮状态
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '验证大道';
    }
}

// 验证答案
async function validateAnswer(userAnswer) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + process.env.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{
                    role: 'user',
                    content: `验证答案：\n题目：${gameState.currentQuestion.question}\n正确答案：${gameState.currentQuestion.answer}\n用户答案：${userAnswer}\n\n返回JSON：{\n   \"correct\": true/false,\n   \"analysis\": \"简要解析\",\n   \"extension\": \"相关知识拓展\"\n}`
                }],
                temperature: 0.3,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // 提取JSON部分
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        const jsonStr = content.substring(jsonStart, jsonEnd);
        
        const resultData = JSON.parse(jsonStr);
        gameState.resultData = resultData;
        
        if (resultData.correct) {
            gameState.currentExp += 100;
            updateRankDisplay();
            renderScreen('result');
        } else {
            // 显示错误提示
            showErrorPrompt('你的道与天道相冲');
            // 重新启动计时器
            startTimer();
        }
    } catch (error) {
        showErrorPrompt('天道推演失败，请重试');
    }
}

function handleTimeOut() {
    showErrorPrompt('时间已到，未能领悟大道！');
    setTimeout(() => renderScreen('start'), 3000);
}

function showErrorPrompt(message) {
    // 检查是否已有错误提示元素
    let errorElement = document.querySelector('.error-prompt');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-prompt';
        errorElement.style.color = '#F44336';
        errorElement.style.textAlign = 'center';
        errorElement.style.margin = '10px 0';
        errorElement.style.fontWeight = 'bold';
        // 添加到游戏界面
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answerInput.parentNode.insertBefore(errorElement, answerInput.nextSibling);
        }
    }
    errorElement.textContent = message;
    
    // 3秒后隐藏提示
    setTimeout(() => {
        errorElement.textContent = '';
    }, 3000);
}

// 渲染结果界面
function renderResultScreen() {
    const resultContainer = document.createElement('div');
    resultContainer.style.maxWidth = '800px';
    resultContainer.style.margin = '0 auto';
    resultContainer.style.padding = '20px';
    
    // 创建结果标志
    const result = document.createElement('div');
    result.className = 'result';
    result.style.textAlign = 'center';
    result.style.margin = '40px 0';
    
    // 显示经验值增加
    const expGain = document.createElement('div');
    expGain.textContent = `修为提升 ${gameState.resultData.exp} 点！当前境界：${rankInfo.currentName} (${rankInfo.currentExp}/${rankInfo.nextExp})`;
    expGain.style.color = '#d4af37';
    expGain.style.fontWeight = 'bold';
    expGain.style.margin = '10px 0';
    const rankInfo = getCurrentRankInfo();
    expGain.textContent = `获得100经验值！当前等级：${rankInfo.currentName} (${rankInfo.currentExp}/${rankInfo.nextExp})`;
    resultContainer.appendChild(expGain);
    result.style.fontSize = '2.5rem';
    
    if (gameState.resultData.correct) {
        result.innerHTML = '✓<br><span style="font-size:1.2rem;color:#f9f299;">答对了，修为精进！</span>';
        result.style.color = '#d4af37';
    } else {
        result.innerHTML = '✗<br><span style="font-size:1.2rem;color:#f9f299;">答错了，还需苦修！</span>';
        result.style.color = '#e74c3c';
    }
    
    // 创建解析区域
    const analysis = document.createElement('div');
    analysis.className = 'analysis';
    analysis.style.margin = '40px 0';
    analysis.style.padding = '30px';
    analysis.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    analysis.style.borderRadius = '8px';
    analysis.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    analysis.style.borderTop = '3px solid #b38b59';
    analysis.innerHTML = 
        `<h3 style="color:#4a6572;margin-top:0;border-bottom:1px solid rgba(74,101,114,0.1);padding-bottom:10px;">
            <span style="color:#b38b59">❝</span> 题目解析 <span style="color:#b38b59">❞</span>
        </h3>
        <p style="line-height:1.8;color:#334e5c">${gameState.resultData.analysis}</p>`;
    
    // 创建知识拓展区域
    const extension = document.createElement('div');
    extension.className = 'extension';
    extension.style.margin = '40px 0';
    extension.style.padding = '30px';
    extension.style.backgroundColor = 'rgba(233, 245, 255, 0.7)';
    extension.style.borderRadius = '8px';
    extension.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    extension.style.borderLeft = '3px solid #4a6572';
    extension.innerHTML = 
        `<h3 style="color:#4a6572;margin-top:0;border-bottom:1px solid rgba(74,101,114,0.1);padding-bottom:10px;">
            <span style="color:#4a6572">❝</span> 知识拓展 <span style="color:#4a6572">❞</span>
        </h3>
        <p style="line-height:1.8;color:#334e5c">${gameState.resultData.extension}</p>`;
    
    // 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';
    btnContainer.style.gap = '20px';
    btnContainer.style.marginTop = '40px';
    
    const continueBtn = createButton('继续挑战', () => startGame(gameState.currentType));
    continueBtn.className += ' btn-primary';
    continueBtn.style.padding = '12px 30px';
    
    const menuBtn = createButton('返回主菜单', () => renderScreen('start'));
    menuBtn.className += ' btn';
    menuBtn.style.padding = '12px 30px';
    
    btnContainer.appendChild(continueBtn);
    btnContainer.appendChild(menuBtn);
    
    resultContainer.appendChild(result);
    resultContainer.appendChild(analysis);
    resultContainer.appendChild(extension);
    resultContainer.appendChild(btnContainer);
    
    app.appendChild(resultContainer);
}

function surrenderGame() {
    clearInterval(gameState.timer);
    
    // 创建投降答案显示区域
    const surrenderContainer = document.createElement('div');
    surrenderContainer.className = 'surrender-container';
    surrenderContainer.style.margin = '20px auto';
    surrenderContainer.style.padding = '20px';
    surrenderContainer.style.maxWidth = '600px';
    surrenderContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    surrenderContainer.style.borderRadius = '8px';
    surrenderContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    surrenderContainer.style.borderLeft = '4px solid #F44336';
    
    surrenderContainer.innerHTML = `
        <h3 style="margin-top:0;color:#4a6572;border-bottom:1px solid rgba(74,101,114,0.1);padding-bottom:10px;">
            <span style="color:#F44336">❝</span> 正确答案 <span style="color:#F44336">❞</span>
        </h3>
        <p style="font-size:1.2rem;color:#334e5c;line-height:1.6;">${gameState.currentQuestion.answer}</p>
        <div style="display:flex;gap:15px;justify-content:center;margin-top:30px;">
            <button class="btn btn-primary" onclick="startGame(gameState.currentType)">挑战下一题</button>
            <button class="btn" onclick="renderScreen('start')">返回宗门</button>
        </div>
    `;
    
    // 清空游戏界面并添加投降内容
    app.innerHTML = '';
    app.appendChild(surrenderContainer);
}

// 启动游戏
initGame();