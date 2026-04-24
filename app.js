// Глобальные переменные
let score = 1000; // Начальные баллы
let currentExercise = null;
let recognition = null;
let startTime = 0;
let timerInterval = null;
let currentTwisterIndex = 0;
let soundEnabled = true;
let isFullscreen = false;
let currentRWordIndex = 0;
let currentEmotionIndex = 0;
let currentPencilIndex = 0;
let currentWordIndex = 0;
let currentArticulationIndex = 0;

// Прогресс по упражнениям (сколько заданий выполнено)
let exerciseProgress = {
    'tongue-twisters': 0,
    'sounds': 0,
    'breathing': 0,
    'emotions': 0,
    'speed-reading': 0,
    'hard-words': 0,
    'articulation': 0,
    'pencil-challenge': 0,
    'cartoon-voiceover': 0,
    'retelling': 0
};

// Загружаем прогресс из localStorage
function loadProgress() {
    const savedScore = localStorage.getItem('boltun_score');
    const savedProgress = localStorage.getItem('boltun_progress');

    if (savedScore) {
        score = parseInt(savedScore);
    }

    if (savedProgress) {
        exerciseProgress = JSON.parse(savedProgress);
    }
}

// Сохраняем прогресс в localStorage
function saveProgress() {
    localStorage.setItem('boltun_score', score);
    localStorage.setItem('boltun_progress', JSON.stringify(exerciseProgress));
}

// Слова со звуком Р
const rWords = [
    "Рыба", "Рак", "Роза", "Ракета", "Радуга", "Рука", "Река", "Рысь",
    "Корова", "Ворона", "Морковь", "Барабан", "Карандаш", "Тигр", "Ветер"
];

// Эмоции и фразы (15 штук)
const emotions = [
    { emotion: "😊 Радость", phrase: "Какой прекрасный день!", emoji: "😊" },
    { emotion: "😢 Грусть", phrase: "Мне очень грустно", emoji: "😢" },
    { emotion: "😠 Злость", phrase: "Я очень сердит!", emoji: "😠" },
    { emotion: "😱 Удивление", phrase: "Вот это да!", emoji: "😱" },
    { emotion: "😴 Усталость", phrase: "Я так устал", emoji: "😴" },
    { emotion: "😊 Восторг", phrase: "Это просто замечательно!", emoji: "😊" },
    { emotion: "😢 Обида", phrase: "Почему ты так поступил?", emoji: "😢" },
    { emotion: "😠 Возмущение", phrase: "Это несправедливо!", emoji: "😠" },
    { emotion: "😱 Испуг", phrase: "Ой, как страшно!", emoji: "😱" },
    { emotion: "😴 Скука", phrase: "Мне так скучно", emoji: "😴" },
    { emotion: "😊 Нежность", phrase: "Я тебя люблю", emoji: "😊" },
    { emotion: "😢 Жалость", phrase: "Бедный котенок", emoji: "😢" },
    { emotion: "😠 Раздражение", phrase: "Хватит шуметь!", emoji: "😠" },
    { emotion: "😱 Восхищение", phrase: "Как красиво!", emoji: "😱" },
    { emotion: "😴 Мечтательность", phrase: "Как бы хорошо было", emoji: "😴" }
];

// Скороговорки разной сложности (20 штук)
const tongueTwisters = [
    { text: "Карл у Клары украл кораллы", target: 3.0, difficulty: 1 },
    { text: "Шла Саша по шоссе и сосала сушку", target: 3.5, difficulty: 1 },
    { text: "На дворе трава, на траве дрова", target: 2.5, difficulty: 1 },
    { text: "Белый снег, белый мел, белый заяц тоже бел", target: 3.0, difficulty: 1 },
    { text: "Ехал Грека через реку, видит Грека в реке рак", target: 4.0, difficulty: 2 },
    { text: "Корабли лавировали, лавировали, да не вылавировали", target: 4.5, difficulty: 2 },
    { text: "От топота копыт пыль по полю летит", target: 3.0, difficulty: 2 },
    { text: "Четыре черненьких чумазых чертенка чертили черными чернилами чертеж", target: 5.0, difficulty: 3 },
    { text: "Расскажите про покупки, про какие про покупки, про покупки, про покупки, про покупочки мои", target: 5.0, difficulty: 3 },
    { text: "Съел молодец тридцать три пирога с пирогом, да все с творогом", target: 4.0, difficulty: 2 },
    { text: "Бык тупогуб, тупогубенький бычок, у быка бела губа была тупа", target: 4.5, difficulty: 3 },
    { text: "Ткет ткач ткани на платки Тане", target: 3.0, difficulty: 2 },
    { text: "Водовоз вез воду из водопровода", target: 3.5, difficulty: 2 },
    { text: "Сшит колпак не по-колпаковски, надо колпак переколпаковать", target: 4.5, difficulty: 3 },
    { text: "Мама мыла Милу мылом, Мила мыло не любила", target: 3.5, difficulty: 1 },
    { text: "Осип охрип, Архип осип", target: 2.5, difficulty: 1 },
    { text: "Везет Сенька Саньку с Сонькой на санках", target: 3.5, difficulty: 2 },
    { text: "Шесть мышат в камышах шуршат", target: 3.0, difficulty: 2 },
    { text: "Цапля чахла, цапля сохла, цапля сдохла", target: 3.0, difficulty: 2 },
    { text: "Король-орел, орел-король", target: 2.5, difficulty: 1 }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    setupEventListeners();
    updateScore();
    updateLevelsUI();
    setupOnboarding();
    setupControls();
});

// Обновление UI уровней
function updateLevelsUI() {
    // Обновляем прогресс бар
    const progress = getProgressToNextLevel();
    const progressFill = document.getElementById('level-progress');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }

    const currentLevel = getCurrentLevel();
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `Уровень ${currentLevel.id}: ${currentLevel.name}`;
    }

    // Обновляем доступность уровней
    levels.forEach(level => {
        const levelCard = document.getElementById(`level-${level.id}`);
        if (levelCard) {
            if (isLevelUnlocked(level.id)) {
                levelCard.classList.remove('locked');
                levelCard.classList.add('unlocked');
            } else {
                levelCard.classList.add('locked');
                levelCard.classList.remove('unlocked');
            }
        }
    });

    // Обновляем счетчики заданий
    updateExerciseCounters();
}

// Обновление счетчиков выполненных заданий
function updateExerciseCounters() {
    Object.keys(exerciseProgress).forEach(exerciseId => {
        const btn = document.querySelector(`[data-exercise="${exerciseId}"]`);
        if (btn) {
            let counter = btn.querySelector('.exercise-counter');
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'exercise-counter';
                btn.appendChild(counter);
            }
            const total = getExerciseTotal(exerciseId);
            counter.textContent = `${exerciseProgress[exerciseId]}/${total}`;
        }
    });
}

// Получить общее количество заданий в упражнении
function getExerciseTotal(exerciseId) {
    const totals = {
        'tongue-twisters': 20,
        'sounds': 40,
        'breathing': 5,
        'emotions': 15,
        'speed-reading': 15,
        'hard-words': 20,
        'articulation': 10,
        'pencil-challenge': 15,
        'cartoon-voiceover': 10,
        'retelling': 10
    };
    return totals[exerciseId] || 10;
}

// Увеличить прогресс упражнения
function incrementExerciseProgress(exerciseId) {
    if (exerciseProgress[exerciseId] !== undefined) {
        exerciseProgress[exerciseId]++;
        saveProgress();
        updateExerciseCounters();
    }
}

// Настройка распознавания речи
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            handleSpeechResult(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Ошибка распознавания:', event.error);
            stopRecording();
            alert('Ошибка распознавания речи. Попробуй еще раз!');
        };

        recognition.onend = () => {
            stopRecording();
        };
    } else {
        alert('Твой браузер не поддерживает распознавание речи. Попробуй Chrome или Edge.');
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки выбора упражнений
    document.querySelectorAll('.exercise-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const exercise = e.currentTarget.dataset.exercise;
            startExercise(exercise);
        });
    });

    // Кнопки "Назад"
    document.getElementById('back-to-menu').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-sounds').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-r').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-breathing').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-emotions').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-pencil').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-words').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-articulation').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-cartoon').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-speed').addEventListener('click', () => showScreen('menu-screen'));
    document.getElementById('back-to-menu-retell').addEventListener('click', () => showScreen('menu-screen'));

    // Скороговорки
    document.getElementById('start-recording').addEventListener('click', startRecording);
    document.getElementById('stop-recording').addEventListener('click', stopRecording);
    document.getElementById('next-exercise').addEventListener('click', nextTwister);

    // Звуки
    document.getElementById('start-recording-sounds').addEventListener('click', startRecordingSounds);
    document.getElementById('stop-recording-sounds').addEventListener('click', stopRecordingSounds);
    document.getElementById('next-sound').addEventListener('click', nextSound);

    // Звук Р
    document.getElementById('start-recording-r').addEventListener('click', startRecordingR);
    document.getElementById('stop-recording-r').addEventListener('click', stopRecordingR);
    document.getElementById('next-r-word').addEventListener('click', nextRWord);

    // Дыхание
    document.getElementById('start-breathing').addEventListener('click', startBreathing);
    document.getElementById('repeat-breathing').addEventListener('click', repeatBreathing);

    // Эмоции
    document.getElementById('start-recording-emotions').addEventListener('click', startRecordingEmotions);
    document.getElementById('stop-recording-emotions').addEventListener('click', stopRecordingEmotions);
    document.getElementById('next-emotion').addEventListener('click', nextEmotion);

    // С карандашом
    document.getElementById('start-recording-pencil').addEventListener('click', startRecordingPencil);
    document.getElementById('stop-recording-pencil').addEventListener('click', stopRecordingPencil);
    document.getElementById('next-pencil').addEventListener('click', nextPencilPhrase);

    // Сложные слова
    document.getElementById('start-recording-words').addEventListener('click', startRecordingWords);
    document.getElementById('stop-recording-words').addEventListener('click', stopRecordingWords);
    document.getElementById('next-word').addEventListener('click', nextWord);

    // Артикуляция
    document.getElementById('start-articulation').addEventListener('click', startArticulation);
    document.getElementById('repeat-articulation').addEventListener('click', repeatArticulation);

    // Озвучка мультфильма
    document.getElementById('watch-cartoon').addEventListener('click', watchCartoon);
    document.getElementById('record-voiceover').addEventListener('click', startVoiceoverRecording);
    document.getElementById('watch-my-version').addEventListener('click', watchMyVersion);
    document.getElementById('next-cartoon').addEventListener('click', nextCartoonScene);

    // Скорость чтения
    document.getElementById('start-recording-speed').addEventListener('click', startRecordingSpeed);
    document.getElementById('stop-recording-speed').addEventListener('click', stopRecordingSpeed);
    document.getElementById('next-speed').addEventListener('click', nextSpeed);

    // Пересказ
    document.getElementById('listen-story').addEventListener('click', listenStory);
    document.getElementById('start-retell').addEventListener('click', startRetell);
    document.getElementById('stop-retell').addEventListener('click', stopRetell);
    document.getElementById('next-retell').addEventListener('click', nextRetellStory);
}

// Переключение экранов
function showScreen(screenId) {
    document.getElementById('menu-screen').classList.toggle('hidden', screenId !== 'menu-screen');
    document.getElementById('tongue-twisters-screen').classList.toggle('hidden', screenId !== 'tongue-twisters-screen');
    document.getElementById('sounds-screen').classList.toggle('hidden', screenId !== 'sounds-screen');
    document.getElementById('sound-r-screen').classList.toggle('hidden', screenId !== 'sound-r-screen');
    document.getElementById('breathing-screen').classList.toggle('hidden', screenId !== 'breathing-screen');
    document.getElementById('emotions-screen').classList.toggle('hidden', screenId !== 'emotions-screen');
    document.getElementById('pencil-challenge-screen').classList.toggle('hidden', screenId !== 'pencil-challenge-screen');
    document.getElementById('hard-words-screen').classList.toggle('hidden', screenId !== 'hard-words-screen');
    document.getElementById('articulation-screen').classList.toggle('hidden', screenId !== 'articulation-screen');
    document.getElementById('cartoon-voiceover-screen').classList.toggle('hidden', screenId !== 'cartoon-voiceover-screen');
    document.getElementById('speed-reading-screen').classList.toggle('hidden', screenId !== 'speed-reading-screen');
    document.getElementById('retelling-screen').classList.toggle('hidden', screenId !== 'retelling-screen');
}

// Запуск упражнения
function startExercise(exerciseType) {
    currentExercise = exerciseType;

    if (exerciseType === 'tongue-twisters') {
        currentTwisterIndex = 0;
        showScreen('tongue-twisters-screen');
        loadTwister();
    } else if (exerciseType === 'sounds') {
        showScreen('sounds-screen');
        resetSounds();
    } else if (exerciseType === 'sound-r') {
        currentRWordIndex = 0;
        showScreen('sound-r-screen');
        loadRWord();
    } else if (exerciseType === 'breathing') {
        showScreen('breathing-screen');
        resetBreathing();
    } else if (exerciseType === 'emotions') {
        currentEmotionIndex = 0;
        showScreen('emotions-screen');
        loadEmotion();
    } else if (exerciseType === 'pencil-challenge') {
        currentPencilIndex = 0;
        showScreen('pencil-challenge-screen');
        loadPencilPhrase();
    } else if (exerciseType === 'hard-words') {
        currentWordIndex = 0;
        showScreen('hard-words-screen');
        loadHardWord();
    } else if (exerciseType === 'articulation') {
        showScreen('articulation-screen');
        resetArticulation();
    } else if (exerciseType === 'cartoon-voiceover') {
        showScreen('cartoon-voiceover-screen');
        resetCartoon();
    } else if (exerciseType === 'speed-reading') {
        showScreen('speed-reading-screen');
        resetSpeedReading();
    } else if (exerciseType === 'retelling') {
        showScreen('retelling-screen');
        resetRetell();
    } else {
        alert('Это упражнение скоро будет доступно!');
    }
}

// Загрузка скороговорки
function loadTwister() {
    const twister = tongueTwisters[currentTwisterIndex];
    document.getElementById('current-twister').textContent = twister.text;
    document.getElementById('timer').textContent = '0.0';
    document.getElementById('result-panel').classList.add('hidden');
    document.getElementById('start-recording').classList.remove('hidden');
    document.getElementById('stop-recording').classList.add('hidden');

    // Анимация персонажа
    const character = document.getElementById('character');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
    character.textContent = '';
}

// Начало записи
function startRecording() {
    if (!recognition) {
        alert('Распознавание речи недоступно');
        return;
    }

    document.getElementById('start-recording').classList.add('hidden');
    document.getElementById('stop-recording').classList.remove('hidden');

    // Запуск таймера
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);

    // Анимация персонажа
    const character = document.getElementById('character');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
    character.style.filter = 'drop-shadow(0 8px 16px rgba(123, 104, 238, 0.4))';

    // Запуск распознавания
    recognition.start();
}

// Остановка записи
function stopRecording() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    document.getElementById('start-recording').classList.remove('hidden');
    document.getElementById('stop-recording').classList.add('hidden');

    if (recognition) {
        recognition.stop();
    }
}

// Обновление таймера
function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    document.getElementById('timer').textContent = elapsed.toFixed(1);
}

// Обработка результата распознавания
function handleSpeechResult(transcript) {
    const elapsed = (Date.now() - startTime) / 1000;
    const twister = tongueTwisters[currentTwisterIndex];
    const targetText = twister.text.toLowerCase().replace(/[.,!?]/g, '').trim();

    // Проверка похожести текста
    const similarity = calculateSimilarity(transcript, targetText);
    const timeScore = elapsed <= twister.target ? 100 : Math.max(0, 100 - (elapsed - twister.target) * 10);
    const accuracyScore = similarity * 100;
    const totalScore = Math.round((timeScore + accuracyScore) / 2);

    // Начисление баллов
    const earnedPoints = Math.max(10, totalScore);
    score += earnedPoints;

    // Увеличиваем прогресс упражнения
    incrementExerciseProgress('tongue-twisters');

    updateScore();
    saveProgress();

    // Показ результата
    showResult(elapsed, twister.target, earnedPoints, similarity);
}

// Вычисление похожести строк (простой алгоритм)
function calculateSimilarity(str1, str2) {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;

    words1.forEach(word => {
        if (words2.includes(word)) {
            matches++;
        }
    });

    return matches / Math.max(words1.length, words2.length);
}

// Показ результата
function showResult(userTime, targetTime, points, accuracy) {
    const resultPanel = document.getElementById('result-panel');
    const character = document.getElementById('character');

    let title, message, emoji;

    if (accuracy >= 0.8 && userTime <= targetTime) {
        title = '🎉 Отлично!';
        message = 'Ты произнес скороговорку четко и быстро!';
        emoji = '🌟';
    } else if (accuracy >= 0.6) {
        title = '👍 Хорошо!';
        message = 'Ты близок к цели! Поработай над скоростью.';
        emoji = '😊';
    } else {
        title = '💪 Попробуй еще!';
        message = 'Продолжай тренироваться, у тебя получится!';
        emoji = '🤔';
    }

    character.style.backgroundImage = "url('assets/characters/feya.png')";
    if (accuracy >= 0.8 && userTime <= targetTime) {
        character.style.filter = 'drop-shadow(0 8px 16px rgba(255, 215, 0, 0.6))';
    } else {
        character.style.filter = 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))';
    }
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('user-time').textContent = userTime.toFixed(1) + ' сек';
    document.getElementById('target-time').textContent = targetTime.toFixed(1) + ' сек';
    document.getElementById('earned-points').textContent = '+' + points;

    resultPanel.classList.remove('hidden');
}

// Следующая скороговорка
function nextTwister() {
    currentTwisterIndex++;
    if (currentTwisterIndex >= tongueTwisters.length) {
        currentTwisterIndex = 0;
    }
    loadTwister();
}

// Обновление счета
function updateScore() {
    document.getElementById('score').textContent = score;
    updateLevelsUI();
}

// Онбординг
function setupOnboarding() {
    console.log('Setting up onboarding...');

    const startBtn = document.getElementById('start-game');
    const skipBtn = document.getElementById('skip-onboarding');
    const closeBtn = document.getElementById('close-onboarding');

    console.log('Buttons found:', { startBtn, skipBtn, closeBtn });

    if (!startBtn || !skipBtn || !closeBtn) {
        console.error('Onboarding buttons not found!');
        return;
    }

    // Кнопка "Начать игру"
    startBtn.addEventListener('click', async () => {
        console.log('Start game clicked');
        // Запрос доступа к микрофону
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            initSpeechRecognition();

            // Скрыть онбординг и показать игру
            document.getElementById('onboarding').classList.add('hidden');
            document.getElementById('menu-screen').classList.remove('hidden');
        } catch (error) {
            alert('Для игры нужен доступ к микрофону. Пожалуйста, разрешите доступ в настройках браузера.');
        }
    });

    // Кнопка пропустить (для тестирования на ПК без микрофона)
    skipBtn.addEventListener('click', () => {
        console.log('Skip clicked');
        closeOnboarding();
    });

    // Крестик закрытия
    closeBtn.addEventListener('click', () => {
        console.log('Close clicked');
        closeOnboarding();
    });
}

function closeOnboarding() {
    console.log('Closing onboarding...');
    try {
        initSpeechRecognition();
    } catch (e) {
        console.log('Speech recognition not available, continuing anyway', e);
    }
    const onboarding = document.getElementById('onboarding');
    const menuScreen = document.getElementById('menu-screen');

    if (onboarding) onboarding.classList.add('hidden');
    if (menuScreen) menuScreen.classList.remove('hidden');

    console.log('Onboarding closed');
}

// Настройка кнопок управления
function setupControls() {
    // Звук
    document.getElementById('sound-toggle').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        const btn = document.getElementById('sound-toggle');
        btn.querySelector('.control-icon').textContent = soundEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !soundEnabled);
    });

    // Полноэкранный режим
    document.getElementById('fullscreen-toggle').addEventListener('click', () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
            isFullscreen = true;
        } else {
            document.exitFullscreen();
            isFullscreen = false;
        }
    });

    // Оценка игры
    document.getElementById('rate-game').addEventListener('click', () => {
        document.getElementById('rating-modal').classList.remove('hidden');
    });

    document.getElementById('close-rating').addEventListener('click', () => {
        document.getElementById('rating-modal').classList.add('hidden');
    });

    // Звездочки оценки
    document.querySelectorAll('.star-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const rating = index + 1;
            document.querySelectorAll('.star-btn').forEach((star, i) => {
                star.classList.toggle('active', i < rating);
            });
            setTimeout(() => {
                alert(`Спасибо за оценку ${rating} ⭐!`);
                document.getElementById('rating-modal').classList.add('hidden');
            }, 500);
        });
    });
}
