'use strict'

/* TODO:
1. gQuests = [{id: 1, opts:[], correctOptIndex:1 }]
   gCurrQuestIdx = 0

2. Note: It is convenient to have the images named by the quest id (e.g. : 1.jpg)

3. If the player is correct, move on to next quest

4. After last question – show a 'Victorious' msg to the user and a restart button

5. Some more functions:
a. initGame()
b. createQuests() – return an hard-coded (ready made) array for now with at least 3 questions
c. renderQuest()
d. checkAnswer(optIdx)
*/

var QUEST_NUM = 3
var gQuests;
var gCurrQuestIdx = 0

function initGame() {
    createQuests();
    renderQuest();
}

function restart() {
    hideMsg('victory');
    gCurrQuestIdx = 0;
    initGame();
}

function renderQuest() {
    var quest = gQuests[gCurrQuestIdx];
    var strHTML = `
    <tr>\n
        \t<td class="pic-container"><img class="q-img" src="images/${quest.id}.png" alt="${quest.quest}"></td>
    </tr>\n
    `;
    for (var i = 0; i < quest.opts.length; i++) {
        strHTML += `
        <tr>\n
            \t<td class="option option${i}" onclick="checkAnswer(${quest.id},${i})">${quest.opts[i]}</td>
        </tr>\n
    `;
    }
    var elQuest = document.querySelector('.question-container');
    elQuest.innerHTML = strHTML;
}

// After last question – show a 'Victorious' msg to the user and a restart button
function checkAnswer(qId, optIdx) {
    var quest = gQuests.find(q => q.id === qId);
    if (quest.correctOptIndex === optIdx) {
        if (gQuests.indexOf(quest) === gQuests.length - 1) {
            showMsg('victory');
        } else {
            gCurrQuestIdx++;
            renderQuest();
        }
    } else {
        // show an error msg
        showMsg('error');
        setTimeout(function () { hideMsg('error') }, 2000);
    }
}

function showMsg(msgType) {
    var elMsg = null
    switch (msgType) {
        case 'error':
            elMsg = document.querySelector('.wrapper .error');
            break;
        case 'victory':
            elMsg = document.querySelector('.wrapper .victory');
            var elRestartBtn = document.querySelector('.wrapper .restart');
            elRestartBtn.style.display = 'block';
            break;
        default:
            break;
    }
    elMsg.style.display = 'block';
}

function hideMsg(msgType) {
    var elMsg = null
    switch (msgType) {
        case 'error':
            elMsg = document.querySelector('.wrapper .error');
            break;
        case 'victory':
            elMsg = document.querySelector('.wrapper .victory');
            var elRestartBtn = document.querySelector('.wrapper .restart');
            elRestartBtn.style.display = 'none';
            break;
        default:
            break;
    }
    elMsg.style.display = 'none';
}

//– return an hard-coded (ready made) array for now with at least 3 questions
function createQuests() {
    gQuests = [];
    for (var i = 0; i < QUEST_NUM; i++) {
        gQuests.push(createQuest(i));
    }
}

function createQuest(questIdx) {
    var quests = [
        { id: 1, quest: 'question1', opts: ['The letter \'I\'', 'The letter \'M\''], correctOptIndex: 0 },
        { id: 2, quest: 'question2', opts: ['Hot', 'Cold'], correctOptIndex: 1 },
        { id: 3, quest: 'question3', opts: ['Mother', 'Telephone'], correctOptIndex: 1 }
    ]
    return quests[questIdx];
}
