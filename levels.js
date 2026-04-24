// Система уровней
const levels = [
    {
        id: 1,
        name: "Основы",
        requiredScore: 0,
        color: "#4CAF50",
        exercises: ["tongue-twisters", "sounds", "breathing"]
    },
    {
        id: 2,
        name: "Выразительность",
        requiredScore: 300,
        color: "#FF9800",
        exercises: ["emotions", "speed-reading", "hard-words"]
    },
    {
        id: 3,
        name: "Мастерство",
        requiredScore: 700,
        color: "#9C27B0",
        exercises: ["articulation", "pencil-challenge", "cartoon-voiceover", "retelling"]
    }
];

// Проверка доступности уровня
function isLevelUnlocked(levelId) {
    const level = levels.find(l => l.id === levelId);
    return score >= level.requiredScore;
}

// Получить текущий уровень
function getCurrentLevel() {
    for (let i = levels.length - 1; i >= 0; i--) {
        if (score >= levels[i].requiredScore) {
            return levels[i];
        }
    }
    return levels[0];
}

// Прогресс до следующего уровня
function getProgressToNextLevel() {
    const currentLevel = getCurrentLevel();
    const nextLevel = levels.find(l => l.id === currentLevel.id + 1);

    if (!nextLevel) {
        return 100; // Максимальный уровень
    }

    const progress = ((score - currentLevel.requiredScore) / (nextLevel.requiredScore - currentLevel.requiredScore)) * 100;
    return Math.min(100, Math.max(0, progress));
}
