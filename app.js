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

// Статистика
let stats = {
    today: 0,
    week: 0,
    total: 0,
    lastDate: null
};

// Слова со звуком Р
const rWords = [
    "Рыба", "Рак", "Роза", "Ракета", "Радуга", "Рука", "Река", "Рысь",
    "Корова", "Ворона", "Морковь", "Барабан", "Карандаш", "Тигр", "Ветер"
];

// Загружаем прогресс из localStorage
function loadProgress() {
    const savedScore = localStorage.getItem('boltun_score');
    const savedProgress = localStorage.getItem('boltun_progress');
    const savedStats = localStorage.getItem('boltun_stats');

    if (savedScore) {
        score = parseInt(savedScore);
    }

    if (savedProgress) {
        exerciseProgress = JSON.parse(savedProgress);
    }

    if (savedStats) {
        stats = JSON.parse(savedStats);
        // Проверяем дату
        const today = new Date().toDateString();
        if (stats.lastDate !== today) {
            stats.today = 0;
            stats.lastDate = today;
        }
    } else {
        stats.lastDate = new Date().toDateString();
    }

    updateStats();
}

// Сохраняем прогресс в localStorage
function saveProgress() {
    localStorage.setItem('boltun_score', score);
    localStorage.setItem('boltun_progress', JSON.stringify(exerciseProgress));
    localStorage.setItem('boltun_stats', JSON.stringify(stats));
}

// Обновление статистики
function updateStats() {
    const todayEl = document.getElementById('today-count');
    const weekEl = document.getElementById('week-count');
    const totalEl = document.getElementById('total-count');

    if (todayEl) todayEl.textContent = stats.today;
    if (weekEl) weekEl.textContent = stats.week;
    if (totalEl) totalEl.textContent = stats.total;
}

// Показать мотивационное сообщение
function showMotivation() {
    const messageEl = document.getElementById('motivation-message');
    if (!messageEl) return;

    const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
    messageEl.textContent = randomMessage;
    messageEl.style.animation = 'none';
    setTimeout(() => {
        messageEl.style.animation = 'motivationPulse 2s ease-in-out infinite';
    }, 10);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    loadProgress();
    setupEventListeners();
    updateScore();
    updateTreeUI();
    setupOnboarding();
    setupControls();
    console.log('Initialization complete');
});

// Обновление UI дерева
function updateTreeUI() {
    // Обновляем счетчики прогресса для каждого упражнения
    Object.keys(exerciseProgress).forEach(exerciseId => {
        const progressEl = document.getElementById(`progress-${exerciseId}`);
        if (progressEl) {
            const total = getExerciseTotal(exerciseId);
            progressEl.textContent = `${exerciseProgress[exerciseId]}/${total}`;
        }
    });

    // Определяем какие упражнения разблокированы
    treeExercises.forEach((exerciseId, index) => {
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        if (!card) return;

        const isUnlocked = isExerciseUnlocked(exerciseId, index);
        const isCompleted = isExerciseCompleted(exerciseId);

        if (isCompleted) {
            card.classList.remove('locked');
            card.classList.add('completed');
            const status = card.querySelector('.tree-exercise-status');
            if (status) status.textContent = '✓';
        } else if (isUnlocked) {
            card.classList.remove('locked');
            card.classList.remove('completed');
            const status = card.querySelector('.tree-exercise-status');
            if (status) status.textContent = '🎯';
        } else {
            card.classList.add('locked');
            card.classList.remove('completed');
            const status = card.querySelector('.tree-exercise-status');
            if (status) status.textContent = '🔒';
        }
    });
}

// Проверка разблокировано ли упражнение
function isExerciseUnlocked(exerciseId, index) {
    // Все упражнения всегда открыты
    return true;
}

// Проверка завершено ли упражнение
function isExerciseCompleted(exerciseId) {
    const total = getExerciseTotal(exerciseId);
    return exerciseProgress[exerciseId] >= total;
}

// Генерация плиток уроков для модуля
function generateLessonTiles(cardElement, exerciseId) {
    const total = getExerciseTotal(exerciseId);
    const lessonsGrid = document.createElement('div');
    lessonsGrid.className = 'lessons-grid';

    for (let i = 1; i <= total; i++) {
        const tile = document.createElement('div');
        tile.className = 'lesson-tile';
        if (i <= exerciseProgress[exerciseId]) {
            tile.classList.add('completed');
        }

        tile.innerHTML = `
            <div class="lesson-number">${i}</div>
            <div>Урок ${i}</div>
        `;

        tile.addEventListener('click', (e) => {
            e.stopPropagation();
            startExercise(exerciseId, i - 1); // Передаем индекс урока (начиная с 0)
        });

        lessonsGrid.appendChild(tile);
    }

    cardElement.appendChild(lessonsGrid);
}

// Получить общее количество заданий в упражнении
function getExerciseTotal(exerciseId) {
    const totals = {
        'tongue-twisters': 20,
        'sounds': 80,
        'breathing': 5,
        'emotions': 15,
        'speed-reading': 30,
        'hard-words': 20,
        'articulation': 6,
        'pencil-challenge': 15,
        'cartoon-voiceover': 3,
        'retelling': 10
    };
    return totals[exerciseId] || 10;
}

// Увеличить прогресс упражнения
function incrementExerciseProgress(exerciseId) {
    if (exerciseProgress[exerciseId] !== undefined) {
        exerciseProgress[exerciseId]++;

        // Обновляем статистику
        stats.today++;
        stats.week++;
        stats.total++;

        saveProgress();
        updateTreeUI();
        updateStats();
        showMotivation();
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
    console.log('Setting up event listeners...');

    // Кнопки выбора упражнений на дереве
    const exerciseCards = document.querySelectorAll('.tree-exercise-card');
    console.log('Found exercise cards:', exerciseCards.length);

    exerciseCards.forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Exercise card clicked:', e.currentTarget.dataset.exercise);
            const exercise = e.currentTarget.dataset.exercise;
            const index = treeExercises.indexOf(exercise);

            // Проверяем разблокировано ли упражнение
            if (isExerciseUnlocked(exercise, index)) {
                // Раскрываем/сворачиваем модуль
                const isExpanded = e.currentTarget.classList.contains('expanded');

                // Сворачиваем все другие модули
                document.querySelectorAll('.tree-exercise-card').forEach(card => {
                    card.classList.remove('expanded');
                });

                if (!isExpanded) {
                    e.currentTarget.classList.add('expanded');
                    // Генерируем плитки уроков если их еще нет
                    if (!e.currentTarget.querySelector('.lessons-grid')) {
                        generateLessonTiles(e.currentTarget, exercise);
                    }
                }
            } else {
                alert('Сначала нужно завершить предыдущее упражнение! 🌟');
            }
        });
    });

    // Специальная кнопка для озвучки мультфильма
    const cartoonBtn = document.getElementById('cartoon-voiceover-btn');
    if (cartoonBtn) {
        cartoonBtn.addEventListener('click', () => {
            startExercise('cartoon-voiceover');
        });
    }

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
function startExercise(exerciseType, lessonIndex = 0) {
    currentExercise = exerciseType;

    if (exerciseType === 'tongue-twisters') {
        currentTwisterIndex = lessonIndex;
        showScreen('tongue-twisters-screen');
        loadTwister();
        initSpeechRecognition();
    } else if (exerciseType === 'sounds') {
        showScreen('sounds-screen');
        resetSounds();
        initSpeechRecognition();
    } else if (exerciseType === 'sound-r') {
        currentRWordIndex = lessonIndex;
        showScreen('sound-r-screen');
        loadRWord();
        initSpeechRecognition();
    } else if (exerciseType === 'breathing') {
        showScreen('breathing-screen');
        resetBreathing();
    } else if (exerciseType === 'emotions') {
        currentEmotionIndex = lessonIndex;
        showScreen('emotions-screen');
        loadEmotion();
        initSpeechRecognition();
    } else if (exerciseType === 'pencil-challenge') {
        currentPencilIndex = lessonIndex;
        showScreen('pencil-challenge-screen');
        loadPencilPhrase();
        initSpeechRecognition();
    } else if (exerciseType === 'hard-words') {
        currentWordIndex = lessonIndex;
        showScreen('hard-words-screen');
        loadWord();
        initSpeechRecognition();
    } else if (exerciseType === 'articulation') {
        currentArticulationIndex = lessonIndex;
        showScreen('articulation-screen');
        loadArticulation();
    } else if (exerciseType === 'cartoon-voiceover') {
        showScreen('cartoon-voiceover-screen');
        resetCartoon();
    } else if (exerciseType === 'speed-reading') {
        showScreen('speed-reading-screen');
        resetSpeedReading();
        initSpeechRecognition();
    } else if (exerciseType === 'retelling') {
        showScreen('retelling-screen');
        resetRetelling();
        initSpeechRecognition();
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

// Загрузка слова со звуком Р
function loadRWord() {
    const word = rWords[currentRWordIndex];
    document.getElementById('current-r-word').textContent = word;
    document.getElementById('result-panel-r').classList.add('hidden');
}

// Загрузка эмоции
function loadEmotion() {
    const emotion = emotions[currentEmotionIndex];
    document.getElementById('current-emotion').textContent = emotion.emotion;
    document.getElementById('emotion-phrase').textContent = emotion.phrase;
    document.getElementById('emotion-emoji').textContent = emotion.emoji;
    document.getElementById('result-panel-emotions').classList.add('hidden');
}

// Загрузка фразы с карандашом
function loadPencilPhrase() {
    const phrases = tongueTwisters.slice(0, 15);
    const phrase = phrases[currentPencilIndex];
    document.getElementById('pencil-phrase').textContent = phrase.text;
    document.getElementById('result-panel-pencil').classList.add('hidden');
}

// Загрузка сложного слова
function loadWord() {
    const hardWords = [
        "Достопримечательность", "Фотосинтез", "Электрификация",
        "Благодарность", "Взаимопонимание", "Предпринимательство",
        "Ответственность", "Совершенствование", "Последовательность",
        "Благополучие", "Взаимодействие", "Сопротивление",
        "Преобразование", "Воспроизведение", "Противопоставление",
        "Усовершенствование", "Взаимозаменяемость", "Непосредственность",
        "Самостоятельность", "Продолжительность"
    ];
    const word = hardWords[currentWordIndex];
    document.getElementById('current-hard-word').textContent = word;
    document.getElementById('result-panel-words').classList.add('hidden');
}

// Загрузка артикуляционного упражнения
function loadArticulation() {
    const exercises = [
        { name: "Улыбка", description: "Широко улыбнись и удерживай улыбку 10 секунд" },
        { name: "Трубочка", description: "Вытяни губы трубочкой и удерживай 10 секунд" },
        { name: "Лопатка", description: "Расслабь язык и положи его на нижнюю губу" },
        { name: "Иголочка", description: "Сделай язык узким и острым" },
        { name: "Часики", description: "Двигай языком влево-вправо как маятник" },
        { name: "Качели", description: "Двигай языком вверх-вниз" }
    ];
    const exercise = exercises[currentArticulationIndex];
    document.getElementById('articulation-name').textContent = exercise.name;
    document.getElementById('articulation-description').textContent = exercise.description;
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
    updateTreeUI();
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
