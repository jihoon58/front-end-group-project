const quizData = [
    { 
        id: 1, 
        question: "데이트 중 상대방이 자꾸 휴대폰을 본다면?", 
        options: [
            { text: "화가 나서 대놓고 말한다.", type: "A", next: 2 },
            { text: "그냥 무시하고 넘어간다.", type: "B", next: 2 }
        ]
    },
    { 
        id: 2, 
        question: "상대방이 늦는다고 연락이 왔다. 당신은?", 
        options: [
            { text: "괜찮다고 말하며 기다린다.", type: "B", next: 3 },
            { text: "조금 화난 척 하며 기다린다.", type: "A", next: 3 }
        ]
    },
    { 
        id: 3, 
        question: "데이트 비용을 내야 하는 상황. 당신의 선택은?", 
        options: [
            { text: "내가 모두 낸다.", type: "A", next: null },
            { text: "반반씩 나누자고 한다.", type: "B", next: null }
        ]
    }
];

let selectedChoices = [];

/**
 * URL에서 퀴즈 ID를 추출하는 함수
 * @returns {number}
 */
function getQuizIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

/**
 * 해당 ID의 퀴즈 데이터를 반환하는 함수
 * @param {number} id - 퀴즈 ID
 * @returns {object|null}
 */
function getQuiz(id) {
    return quizData.find(q => q.id === id);
}

/**
 * 퀴즈 화면을 렌더링하는 함수
 * @param {number} id - 퀴즈 ID
 */
function renderQuiz(id) {
    const quiz = getQuiz(id);
    const container = document.getElementById('quiz-content');

    if (!quiz) {
        window.location.href = "result.html";
        return;
    }

    container.innerHTML = `
        <p>${quiz.question}</p>
        ${quiz.options.map(option => `
            <button class="quiz-option" onclick="selectOption('${option.type}', ${option.next})">
                ${option.text}
            </button>
        `).join("")}
    `;
}

/**
 * 사용자가 선택한 옵션을 저장하고, 다음 퀴즈로 이동하는 함수
 * @param {string} type - 선택한 타입 (A, B)
 * @param {number|null} nextId - 다음 퀴즈 ID
 */
function selectOption(type, nextId) {
    selectedChoices.push(type);

    if (nextId) {
        window.location.href = `quiz.html?id=${nextId}`;
    } else {
        localStorage.setItem("selectedChoices", JSON.stringify(selectedChoices));
        window.location.href = "result.html";
    }
}

/**
 * 결과 계산 함수
 */
function calculateResult() {
    const selectedChoices = JSON.parse(localStorage.getItem("selectedChoices")) || [];

    if (selectedChoices.length === 0) {
        window.location.href = "index.html";
        return;
    }

    const typeCounts = selectedChoices.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const dominantType = Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b);

    let resultText = "";
    let resultDescription = "";

    if (dominantType === "A") {
        resultText = "적극적인 연애 성향";
        resultDescription = "당신은 연애에서 적극적이고 주도적인 성향을 가지고 있습니다.";
    } else if (dominantType === "B") {
        resultText = "차분한 연애 성향";
        resultDescription = "당신은 연애에서 차분하고 신중한 성향을 가지고 있습니다.";
    } else {
        resultText = "결과를 분석할 수 없습니다.";
        resultDescription = "다시 시도해보세요!";
    }

    const container = document.getElementById("result-content");
    container.innerHTML = `
        <h2>${resultText}</h2>
        <p>${resultDescription}</p>
    `;
}

/**
 * 테스트 다시 시작
 */
function restartTest() {
    localStorage.removeItem("selectedChoices");
    window.location.href = "index.html";
}

/**
 * 결과 페이지에서 결과 계산 함수 실행
 */
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("quiz.html")) {
        const quizId = getQuizIdFromURL() || 1;
        renderQuiz(quizId);
    } else if (path.includes("result.html")) {
        calculateResult();
    }
});
