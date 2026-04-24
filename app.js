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
    setTimeout(() => {
        updateScore();
        updateTreeUI();
        setupOnboarding();
        setupControls();
        console.log('Initialization complete');
    }, 0);
});

// Обновление UI дерева
function updateTreeUI() {
    console.log('updateTreeUI called');
    console.log('treeExercises:', treeExercises);

    // Обновляем счетчики прогресса для каждого упражнения
    Object.keys(exerciseProgress).forEach(exerciseId => {
        const progressEl = document.getElementById(`progress-${exerciseId}`);
        if (progressEl) {
            const total = getExerciseTotal(exerciseId);
            progressEl.textContent = `${exerciseProgress[exerciseId]}/${total}`;
        }
    });

    // Генерируем уроки для всех модулей сразу
    treeExercises.forEach((exerciseId) => {
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        console.log(`Looking for card with data-exercise="${exerciseId}":`, card);
        if (card && !card.querySelector('.lessons-grid')) {
            console.log('Calling generateLessonTiles for:', exerciseId);
            generateLessonTiles(card, exerciseId);
        } else if (card) {
            console.log('Card already has lessons-grid');
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
    console.log('Generating lesson for:', exerciseId);

    // Оборачиваем существующие элементы в header
    const icon = cardElement.querySelector('.tree-exercise-icon');
    const name = cardElement.querySelector('.tree-exercise-name');
    const progress = cardElement.querySelector('.tree-exercise-progress');

    console.log('Found elements:', { icon, name, progress });

    if (icon && name && progress) {
        const header = document.createElement('div');
        header.className = 'tree-exercise-header';

        // Перемещаем элементы в header
        header.appendChild(icon);
        header.appendChild(name);
        header.appendChild(progress);

        // Вставляем header в начало карточки
        cardElement.insertBefore(header, cardElement.firstChild);
        console.log('Header created');
    }

    // Показываем только первый урок
    const lessonsGrid = document.createElement('div');
    lessonsGrid.className = 'lessons-grid';

    const tile = document.createElement('div');
    tile.className = 'lesson-tile';

    // Получаем текст первого задания
    let lessonText = '';
    if (exerciseId === 'tongue-twisters') {
        lessonText = `Скороговорка "${tongueTwisters[0].text}"`;
    } else if (exerciseId === 'emotions') {
        lessonText = `Эмоция "${emotions[0].phrase}"`;
    } else if (exerciseId === 'sounds') {
        lessonText = 'Звук "Р"';
    } else if (exerciseId === 'breathing') {
        lessonText = 'Дыхательное упражнение';
    } else if (exerciseId === 'speed-reading') {
        lessonText = 'Быстрое чтение';
    } else if (exerciseId === 'hard-words') {
        lessonText = 'Сложное слово';
    } else if (exerciseId === 'articulation') {
        lessonText = 'Артикуляционная гимнастика';
    } else if (exerciseId === 'pencil-challenge') {
        lessonText = 'С карандашом во рту';
    } else if (exerciseId === 'retelling') {
        lessonText = 'Пересказ истории';
    }

    tile.innerHTML = `
        <div class="lesson-number">1 урок</div>
        <div class="lesson-description">${lessonText}</div>
    `;

    tile.addEventListener('click', (e) => {
        e.stopPropagation();
        startExercise(exerciseId, 0);
    });

    lessonsGrid.appendChild(tile);
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
        recognition.interimResults = true; // Показываем промежуточные результаты
        recognition.maxAlternatives = 3; // Получаем несколько вариантов распознавания

        // Базовый обработчик ошибок (может быть перезаписан)
        recognition.onerror = (event) => {
            console.error('Ошибка распознавания:', event.error);
            stopRecording();

            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                alert('Нужен доступ к микрофону! Разреши доступ в настройках браузера.');
            } else if (event.error === 'no-speech') {
                alert('Не слышу голоса. Говори громче!');
            } else if (event.error === 'network') {
                alert('Проблема с интернетом. Проверь подключение.');
            } else {
                alert('Ошибка распознавания речи. Попробуй еще раз!');
            }
        };

        recognition.onend = () => {
            console.log('Recognition ended');
            stopRecording();
        };

        console.log('Speech recognition initialized');
    } else {
        alert('Твой браузер не поддерживает распознавание речи. Попробуй Chrome или Edge.');
    }
}

// Добавить название урока в карточку
function addLessonTitle(cardElement, exerciseId) {
    // Проверяем, не добавлено ли уже
    if (cardElement.querySelector('.lesson-title')) return;

    let lessonText = '';
    if (exerciseId === 'tongue-twisters') {
        lessonText = `Скороговорка "${tongueTwisters[0].text}"`;
    } else if (exerciseId === 'emotions') {
        lessonText = `Эмоция "${emotions[0].phrase}"`;
    } else if (exerciseId === 'sounds') {
        lessonText = 'Звук "Р"';
    } else if (exerciseId === 'breathing') {
        lessonText = 'Дыхательное упражнение';
    } else if (exerciseId === 'speed-reading') {
        lessonText = 'Быстрое чтение';
    } else if (exerciseId === 'hard-words') {
        lessonText = 'Сложное слово';
    } else if (exerciseId === 'articulation') {
        lessonText = 'Артикуляционная гимнастика';
    } else if (exerciseId === 'pencil-challenge') {
        lessonText = 'С карандашом во рту';
    } else if (exerciseId === 'retelling') {
        lessonText = 'Пересказ истории';
    }

    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'lesson-title';
    lessonDiv.textContent = `1 урок. ${lessonText}`;
    cardElement.appendChild(lessonDiv);
}

// Настройка обработчиков событий
function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Кнопки выбора упражнений на дереве - клик запускает первый урок
    const exerciseCards = document.querySelectorAll('.tree-exercise-card');
    console.log('Found exercise cards:', exerciseCards.length);

    exerciseCards.forEach(card => {
        const exerciseId = card.dataset.exercise;
        if (exerciseId) {
            // Добавляем название урока в низ карточки
            addLessonTitle(card, exerciseId);

            card.addEventListener('click', () => {
                console.log('Card clicked:', exerciseId);
                startExercise(exerciseId, 0);
            });
        }
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
    const startBtn = document.getElementById('start-recording');
    const stopBtn = document.getElementById('stop-recording');
    const nextBtn = document.getElementById('next-exercise');

    console.log('Tongue twister buttons:', { startBtn, stopBtn, nextBtn });

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('Start recording button clicked!');
            startRecording();
        });
    } else {
        console.error('start-recording button not found!');
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => stopRecording());
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => nextTwister());
    }

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
    document.getElementById('start-recording').classList.add('hidden'); // Скрываем пока озвучивается
    document.getElementById('stop-recording').classList.add('hidden');

    // Анимация персонажа
    const character = document.getElementById('character');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
    character.textContent = '';

    // Озвучиваем скороговорку
    if (soundEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Прочитай скороговорку: ${twister.text}`);
        utterance.lang = 'ru-RU';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;

        // Показываем кнопку только после окончания озвучки
        utterance.onend = () => {
            console.log('Speech synthesis finished, showing start button');
            document.getElementById('start-recording').classList.remove('hidden');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            // Показываем кнопку даже если ошибка
            document.getElementById('start-recording').classList.remove('hidden');
        };

        window.speechSynthesis.speak(utterance);
    } else {
        // Если озвучка недоступна, показываем кнопку сразу
        document.getElementById('start-recording').classList.remove('hidden');
    }
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
    console.log('startRecording() called');
    console.log('recognition object:', recognition);

    // Останавливаем озвучку если она еще идет
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        console.log('Stopping speech synthesis before starting recognition');
        window.speechSynthesis.cancel();
    }

    if (!recognition) {
        console.log('Recognition not initialized, initializing now...');
        initSpeechRecognition();

        if (!recognition) {
            console.error('Failed to initialize recognition');
            alert('Распознавание речи недоступно. Убедись, что разрешил доступ к микрофону.');
            return;
        }
    }

    console.log('Setting up onresult handler...');

    // Устанавливаем обработчик результата для скороговорок
    recognition.onresult = (event) => {
        console.log('onresult fired!', event);
        const result = event.results[event.results.length - 1];

        // Если это финальный результат
        if (result.isFinal) {
            const transcript = result[0].transcript.toLowerCase().trim();
            const confidence = result[0].confidence;

            console.log('Распознано:', transcript, 'Уверенность:', confidence);

            // Показываем альтернативные варианты для отладки
            for (let i = 0; i < result.length; i++) {
                console.log(`Вариант ${i + 1}:`, result[i].transcript, result[i].confidence);
            }

            handleSpeechResult(transcript, confidence);
        } else {
            // Промежуточный результат
            const interim = result[0].transcript;
            console.log('Промежуточно:', interim);

            const twisterEl = document.getElementById('current-twister');
            if (twisterEl) {
                twisterEl.style.opacity = '0.6';
            }
        }
    };

    console.log('Hiding start button, showing stop button...');
    document.getElementById('start-recording').classList.add('hidden');
    document.getElementById('stop-recording').classList.remove('hidden');

    // Запуск таймера
    console.log('Starting timer...');
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);

    // Анимация персонажа
    const character = document.getElementById('character');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
    character.style.filter = 'drop-shadow(0 8px 16px rgba(123, 104, 238, 0.4))';

    // Запуск распознавания
    try {
        console.log('Starting recognition...');
        recognition.start();
        console.log('Recognition started for tongue twisters');
    } catch (error) {
        console.error('Error starting recognition:', error);
        stopRecording();
        alert('Ошибка запуска распознавания. Попробуй еще раз!');
    }
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
function handleSpeechResult(transcript, confidence = 1.0) {
    const elapsed = (Date.now() - startTime) / 1000;
    const twister = tongueTwisters[currentTwisterIndex];
    const targetText = twister.text.toLowerCase().replace(/[.,!?]/g, '').trim();

    console.log('Целевой текст:', targetText);
    console.log('Распознано:', transcript);
    console.log('Уверенность API:', confidence);

    // Нормализуем текст (убираем лишние пробелы, знаки)
    const normalizedTranscript = transcript.replace(/[.,!?]/g, '').trim();

    // Проверка похожести текста (улучшенная)
    const similarity = calculateAdvancedSimilarity(normalizedTranscript, targetText);

    // Бонус за высокую уверенность API
    const confidenceBonus = confidence > 0.8 ? 1.1 : 1.0;

    const timeScore = elapsed <= twister.target ? 100 : Math.max(0, 100 - (elapsed - twister.target) * 10);
    const accuracyScore = similarity * 100 * confidenceBonus;
    const totalScore = Math.round((timeScore + accuracyScore) / 2);

    // Начисление баллов
    const earnedPoints = Math.max(10, totalScore);
    score += earnedPoints;

    // Увеличиваем прогресс упражнения
    incrementExerciseProgress('tongue-twisters');

    updateScore();
    saveProgress();

    // Показ результата
    showResult(elapsed, twister.target, earnedPoints, similarity, transcript);
}

// Вычисление похожести строк (улучшенный алгоритм)
function calculateAdvancedSimilarity(str1, str2) {
    // Простое сравнение по словам
    const words1 = str1.split(' ').filter(w => w.length > 0);
    const words2 = str2.split(' ').filter(w => w.length > 0);

    let matches = 0;
    let partialMatches = 0;

    words1.forEach(word1 => {
        // Точное совпадение
        if (words2.includes(word1)) {
            matches++;
        } else {
            // Частичное совпадение (похожие слова)
            words2.forEach(word2 => {
                const wordSimilarity = levenshteinSimilarity(word1, word2);
                if (wordSimilarity > 0.7) {
                    partialMatches += wordSimilarity;
                }
            });
        }
    });

    const totalMatches = matches + (partialMatches * 0.5);
    const maxWords = Math.max(words1.length, words2.length);

    return Math.min(1.0, totalMatches / maxWords);
}

// Levenshtein distance для сравнения похожести слов
function levenshteinSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;

    const matrix = [];

    for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    const distance = matrix[len2][len1];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
}

// Показ результата
function showResult(userTime, targetTime, points, accuracy, transcript = '') {
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

    // Показываем что было распознано
    if (transcript) {
        message += `\n\nРаспознано: "${transcript}"`;
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
}
// === УПРАЖНЕНИЕ "ЗВУКИ" (объединяет Р, Л, Ш, Ж) - 40 слов ===

const soundsData = [
    {
        sound: "Р",
        words: ["Рыба", "Рак", "Роза", "Ракета", "Радуга", "Рука", "Река", "Рысь", "Корова", "Ворона", "Морковь", "Барабан", "Карандаш", "Тигр", "Ветер", "Рубашка", "Ромашка", "Рыбак", "Рынок", "Рюкзак"],
        color: "#FF6B6B"
    },
    {
        sound: "Л",
        words: ["Лампа", "Лук", "Луна", "Лиса", "Лодка", "Лес", "Лето", "Молоко", "Белка", "Стол", "Стул", "Пол", "Лапа", "Лыжи", "Ложка", "Лошадь", "Лимон", "Лист", "Лужа", "Лягушка"],
        color: "#4CAF50"
    },
    {
        sound: "Ш",
        words: ["Шар", "Шапка", "Шуба", "Школа", "Мышка", "Кошка", "Малыш", "Карандаш", "Шишка", "Шкаф", "Шарф", "Шина", "Шутка", "Шахматы", "Шоколад", "Штаны", "Шея", "Шум", "Шаг", "Шалаш"],
        color: "#2196F3"
    },
    {
        sound: "Ж",
        words: ["Жук", "Жаба", "Жираф", "Ножик", "Ёжик", "Лыжи", "Пижама", "Медвежонок", "Жара", "Жизнь", "Журнал", "Жёлудь", "Жемчуг", "Жюри", "Ужин", "Лужа", "Кожа", "Ножницы", "Пирожок", "Снежок"],
        color: "#FF9800"
    }
];

let currentSoundIndex = 0;
let currentSoundWordIndex = 0;

function loadSound() {
    const soundData = soundsData[currentSoundIndex];
    const word = soundData.words[currentSoundWordIndex];

    document.getElementById('current-sound').textContent = soundData.sound;
    document.getElementById('current-sound').style.color = soundData.color;
    document.getElementById('current-sound-word').textContent = word;
    document.getElementById('result-panel-sounds').classList.add('hidden');
    document.getElementById('start-recording-sounds').classList.remove('hidden');
    document.getElementById('stop-recording-sounds').classList.add('hidden');

    const character = document.getElementById('character-sounds');
    character.style.backgroundImage = "url('assets/characters/character3.png')";
}

function startRecordingSounds() {
    if (!recognition) return;

    document.getElementById('start-recording-sounds').classList.add('hidden');
    document.getElementById('stop-recording-sounds').classList.remove('hidden');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleSoundResult(transcript);
    };

    recognition.start();
}

function stopRecordingSounds() {
    document.getElementById('start-recording-sounds').classList.remove('hidden');
    document.getElementById('stop-recording-sounds').classList.add('hidden');
    if (recognition) recognition.stop();
}

function handleSoundResult(transcript) {
    const soundData = soundsData[currentSoundIndex];
    const word = soundData.words[currentSoundWordIndex].toLowerCase();
    const hasSound = transcript.includes(soundData.sound.toLowerCase()) || transcript.includes(word);

    const points = hasSound ? 50 : 20;
    score += points;
    incrementExerciseProgress('sounds');
    updateScore();

    const title = hasSound ? '🎉 Отлично!' : '💪 Попробуй еще!';
    const message = hasSound ? `Ты четко произнес звук ${soundData.sound}!` : 'Продолжай тренироваться!';

    document.getElementById('result-title-sounds').textContent = title;
    document.getElementById('result-message-sounds').textContent = message;
    document.getElementById('earned-points-sounds').textContent = '+' + points;
    document.getElementById('result-panel-sounds').classList.remove('hidden');
}

function nextSound() {
    currentSoundWordIndex++;
    if (currentSoundWordIndex >= soundsData[currentSoundIndex].words.length) {
        currentSoundWordIndex = 0;
        currentSoundIndex++;
        if (currentSoundIndex >= soundsData.length) {
            currentSoundIndex = 0;
        }
    }
    loadSound();
}

function resetSounds() {
    currentSoundIndex = 0;
    currentSoundWordIndex = 0;
    loadSound();
}

// === УПРАЖНЕНИЕ "ЗВУК Р" (старое, оставляем для совместимости) ===

function loadRWord() {
    const word = rWords[currentRWordIndex];
    document.getElementById('current-r-word').textContent = word;
    document.getElementById('result-panel-r').classList.add('hidden');
    document.getElementById('start-recording-r').classList.remove('hidden');
    document.getElementById('stop-recording-r').classList.add('hidden');

    const character = document.getElementById('character-r');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
}

function startRecordingR() {
    if (!recognition) return;

    document.getElementById('start-recording-r').classList.add('hidden');
    document.getElementById('stop-recording-r').classList.remove('hidden');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleRWordResult(transcript);
    };

    recognition.start();
}

function stopRecordingR() {
    document.getElementById('start-recording-r').classList.remove('hidden');
    document.getElementById('stop-recording-r').classList.add('hidden');
    if (recognition) recognition.stop();
}

function handleRWordResult(transcript) {
    const word = rWords[currentRWordIndex].toLowerCase();
    const hasR = transcript.includes('р') || transcript.includes(word);

    const points = hasR ? 50 : 20;
    score += points;
    updateScore();

    const title = hasR ? '🎉 Отлично!' : '💪 Попробуй еще!';
    const message = hasR ? 'Ты четко произнес звук Р!' : 'Продолжай тренироваться!';

    document.getElementById('result-title-r').textContent = title;
    document.getElementById('result-message-r').textContent = message;
    document.getElementById('earned-points-r').textContent = '+' + points;
    document.getElementById('result-panel-r').classList.remove('hidden');
}

function nextRWord() {
    currentRWordIndex++;
    if (currentRWordIndex >= rWords.length) {
        currentRWordIndex = 0;
    }
    loadRWord();
}

// === УПРАЖНЕНИЕ "ДЫХАНИЕ" ===

function resetBreathing() {
    document.getElementById('breathing-instruction').textContent = 'Приготовься...';
    document.getElementById('result-panel-breathing').classList.add('hidden');
    document.getElementById('start-breathing').classList.remove('hidden');

    const box = document.getElementById('breathing-box');
    box.className = 'breathing-box';

    const character = document.getElementById('character-breathing');
    character.style.backgroundImage = "url('assets/characters/character2.png')";
}

function startBreathing() {
    document.getElementById('start-breathing').classList.add('hidden');

    const box = document.getElementById('breathing-box');
    const instruction = document.getElementById('breathing-instruction');
    const counter = document.getElementById('breath-counter');

    let cycle = 0;
    const totalCycles = 3;

    function runCycle() {
        if (cycle >= totalCycles) {
            instruction.textContent = 'Отлично! Упражнение завершено! 🌟';
            counter.textContent = '';
            box.className = 'breathing-box';
            score += 50;
    incrementExerciseProgress("breathing");
            updateScore();
            setTimeout(() => {
                document.getElementById('result-panel-breathing').classList.remove('hidden');
            }, 1000);
            return;
        }

        cycle++;
        counter.textContent = `Цикл ${cycle} из ${totalCycles}`;

        // Вдох (4 сек)
        instruction.textContent = '💨 Вдох через нос';
        box.className = 'breathing-box inhale';

        setTimeout(() => {
            // Задержка (4 сек)
            instruction.textContent = '⏸️ Задержи дыхание';
            box.className = 'breathing-box hold-in';

            setTimeout(() => {
                // Выдох (4 сек)
                instruction.textContent = '😮‍💨 Выдох через рот';
                box.className = 'breathing-box exhale';

                setTimeout(() => {
                    // Задержка (4 сек)
                    instruction.textContent = '⏸️ Задержи дыхание';
                    box.className = 'breathing-box hold-out';

                    setTimeout(() => {
                        runCycle();
                    }, 4000);
                }, 4000);
            }, 4000);
        }, 4000);
    }

    runCycle();
}

function repeatBreathing() {
    resetBreathing();
}

// === УПРАЖНЕНИЕ "ЭМОЦИИ" ===

function loadEmotion() {
    const emotion = emotions[currentEmotionIndex];
    document.getElementById('current-emotion').textContent = emotion.emotion;
    document.getElementById('current-emotion-phrase').textContent = emotion.phrase;
    document.getElementById('result-panel-emotions').classList.add('hidden');
    document.getElementById('start-recording-emotions').classList.remove('hidden');
    document.getElementById('stop-recording-emotions').classList.add('hidden');

    const character = document.getElementById('character-emotions');
    character.style.backgroundImage = "url('assets/characters/character2.png')";
}

function startRecordingEmotions() {
    if (!recognition) return;

    document.getElementById('start-recording-emotions').classList.add('hidden');
    document.getElementById('stop-recording-emotions').classList.remove('hidden');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleEmotionResult(transcript);
    };

    recognition.start();
}

function stopRecordingEmotions() {
    document.getElementById('start-recording-emotions').classList.remove('hidden');
    document.getElementById('stop-recording-emotions').classList.add('hidden');
    if (recognition) recognition.stop();
}

function handleEmotionResult(transcript) {
    incrementExerciseProgress("emotions");
    const points = 60;
    score += points;
    updateScore();

    document.getElementById('result-title-emotions').textContent = '🎭 Отлично!';
    document.getElementById('result-message-emotions').textContent = 'Ты выразительно прочитал фразу!';
    document.getElementById('earned-points-emotions').textContent = '+' + points;
    document.getElementById('result-panel-emotions').classList.remove('hidden');
}

function nextEmotion() {
    currentEmotionIndex++;
    if (currentEmotionIndex >= emotions.length) {
        currentEmotionIndex = 0;
    }
    loadEmotion();
}

// === УПРАЖНЕНИЕ "С КАРАНДАШОМ" - 15 фраз ===

const pencilPhrases = [
    "Карл у Клары украл кораллы",
    "Шла Саша по шоссе",
    "На дворе трава, на траве дрова",
    "Ехал Грека через реку",
    "От топота копыт пыль по полю летит",
    "Белый снег, белый мел",
    "Мама мыла Милу мылом",
    "Водовоз вез воду",
    "Ткет ткач ткани",
    "Осип охрип, Архип осип",
    "Везет Сенька Саньку",
    "Шесть мышат шуршат",
    "Цапля чахла, цапля сохла",
    "Король-орел, орел-король",
    "Бык тупогуб"
];

function loadPencilPhrase() {
    const phrase = pencilPhrases[currentPencilIndex];
    document.getElementById('current-pencil-phrase').textContent = phrase;
    document.getElementById('result-panel-pencil').classList.add('hidden');
    document.getElementById('start-recording-pencil').classList.remove('hidden');
    document.getElementById('stop-recording-pencil').classList.add('hidden');

    const character = document.getElementById('character-pencil');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
}

function startRecordingPencil() {
    if (!recognition) return;

    document.getElementById('start-recording-pencil').classList.add('hidden');
    document.getElementById('stop-recording-pencil').classList.remove('hidden');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handlePencilResult(transcript);
    };

    recognition.start();
}

function stopRecordingPencil() {
    document.getElementById('start-recording-pencil').classList.remove('hidden');
    document.getElementById('stop-recording-pencil').classList.add('hidden');
    if (recognition) recognition.stop();
}

function handlePencilResult(transcript) {
    const points = 70;
    score += points;
    incrementExerciseProgress('pencil-challenge');
    updateScore();

    document.getElementById('result-title-pencil').textContent = '🖊️ Отлично!';
    document.getElementById('result-message-pencil').textContent = 'Ты справился с карандашом во рту!';
    document.getElementById('earned-points-pencil').textContent = '+' + points;
    document.getElementById('result-panel-pencil').classList.remove('hidden');
}

function nextPencilPhrase() {
    currentPencilIndex++;
    if (currentPencilIndex >= pencilPhrases.length) {
        currentPencilIndex = 0;
    }
    loadPencilPhrase();
}

// === УПРАЖНЕНИЕ "СЛОЖНЫЕ СЛОВА" - 20 слов ===

const hardWords = [
    { word: "Достопримечательность", hint: "До-сто-при-ме-ча-тель-ность" },
    { word: "Фотоаппарат", hint: "Фо-то-ап-па-рат" },
    { word: "Велосипед", hint: "Ве-ло-си-пед" },
    { word: "Электричество", hint: "Э-лек-три-че-ство" },
    { word: "Путешествие", hint: "Пу-те-ше-ствие" },
    { word: "Приключение", hint: "При-клю-че-ние" },
    { word: "Воспитатель", hint: "Вос-пи-та-тель" },
    { word: "Землетрясение", hint: "Зем-ле-тря-се-ние" },
    { word: "Водопроводчик", hint: "Во-до-про-вод-чик" },
    { word: "Благодарность", hint: "Бла-го-дар-ность" },
    { word: "Велосипедист", hint: "Ве-ло-си-пе-дист" },
    { word: "Достижение", hint: "До-сти-же-ние" },
    { word: "Замечательный", hint: "За-ме-ча-тель-ный" },
    { word: "Изобретатель", hint: "И-зо-бре-та-тель" },
    { word: "Колокольчик", hint: "Ко-ло-коль-чик" },
    { word: "Любознательный", hint: "Лю-бо-зна-тель-ный" },
    { word: "Мороженщик", hint: "Мо-ро-жен-щик" },
    { word: "Необыкновенный", hint: "Не-о-быч-но-вен-ный" },
    { word: "Ответственность", hint: "От-вет-ствен-ность" },
    { word: "Путешественник", hint: "Пу-те-ше-ствен-ник" }
];

function loadHardWord() {
    const wordObj = hardWords[currentWordIndex];
    document.getElementById('current-hard-word').textContent = wordObj.word;
    document.getElementById('word-hint').textContent = wordObj.hint;
    document.getElementById('result-panel-words').classList.add('hidden');
    document.getElementById('start-recording-words').classList.remove('hidden');
    document.getElementById('stop-recording-words').classList.add('hidden');

    const character = document.getElementById('character-words');
    character.style.backgroundImage = "url('assets/characters/character2.png')";
}

function startRecordingWords() {
    if (!recognition) return;

    document.getElementById('start-recording-words').classList.add('hidden');
    document.getElementById('stop-recording-words').classList.remove('hidden');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleWordResult(transcript);
    };

    recognition.start();
}

function stopRecordingWords() {
    document.getElementById('start-recording-words').classList.remove('hidden');
    document.getElementById('stop-recording-words').classList.add('hidden');
    if (recognition) recognition.stop();
}

function handleWordResult(transcript) {
    const points = 80;
    score += points;
    incrementExerciseProgress('hard-words');
    updateScore();

    document.getElementById('result-title-words').textContent = '📚 Отлично!';
    document.getElementById('result-message-words').textContent = 'Ты прочитал сложное слово!';
    document.getElementById('earned-points-words').textContent = '+' + points;
    document.getElementById('result-panel-words').classList.remove('hidden');
}

function nextWord() {
    currentWordIndex++;
    if (currentWordIndex >= hardWords.length) {
        currentWordIndex = 0;
    }
    loadHardWord();
}

// === УПРАЖНЕНИЕ "АРТИКУЛЯЦИОННАЯ ГИМНАСТИКА" ===

const articulationExercises = [
    { name: "Улыбка", instruction: "Широко улыбнись и покажи зубы", duration: 5, emoji: "😁" },
    { name: "Трубочка", instruction: "Вытяни губы трубочкой", duration: 5, emoji: "😗" },
    { name: "Лопатка", instruction: "Высунь широкий язык и положи на нижнюю губу", duration: 5, emoji: "😛" },
    { name: "Иголочка", instruction: "Высунь узкий острый язык", duration: 5, emoji: "😝" },
    { name: "Часики", instruction: "Двигай языком влево-вправо", duration: 8, emoji: "⏰" }
];

function resetArticulation() {
    document.getElementById('articulation-instruction').textContent = 'Приготовься к упражнениям!';
    document.getElementById('articulation-timer').textContent = '';
    document.getElementById('result-panel-articulation').classList.add('hidden');
    document.getElementById('start-articulation').classList.remove('hidden');

    const demo = document.getElementById('articulation-demo');
    demo.querySelector('.demo-face').textContent = '😊';

    const character = document.getElementById('character-articulation');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
}

function startArticulation() {
    document.getElementById('start-articulation').classList.add('hidden');

    const instruction = document.getElementById('articulation-instruction');
    const timer = document.getElementById('articulation-timer');
    const demo = document.getElementById('articulation-demo');

    let exerciseIndex = 0;

    function runExercise() {
        if (exerciseIndex >= articulationExercises.length) {
            instruction.textContent = 'Отлично! Все упражнения выполнены! 🌟';
            timer.textContent = '';
            demo.querySelector('.demo-face').textContent = '🎉';
            score += 40;
            incrementExerciseProgress('articulation');
            updateScore();
            setTimeout(() => {
                document.getElementById('result-panel-articulation').classList.remove('hidden');
            }, 1000);
            return;
        }

        const exercise = articulationExercises[exerciseIndex];
        instruction.textContent = `${exercise.name}: ${exercise.instruction}`;
        demo.querySelector('.demo-face').textContent = exercise.emoji;

        let timeLeft = exercise.duration;
        timer.textContent = `${timeLeft} сек`;

        const countdown = setInterval(() => {
            timeLeft--;
            timer.textContent = `${timeLeft} сек`;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                exerciseIndex++;
                setTimeout(runExercise, 1000);
            }
        }, 1000);
    }

    runExercise();
}

function repeatArticulation() {
    resetArticulation();
}

// === УПРАЖНЕНИЕ "ОЗВУЧКА МУЛЬТФИЛЬМА" ===

const cartoonScenes = [
    {
        title: "Колобок убегает",
        text: "Я Колобок, Колобок! По амбару метён, по сусекам скребён!",
        animation: "kolobok",
        duration: 3000
    },
    {
        title: "Зайчик прыгает",
        text: "Прыг-скок, прыг-скок! Я веселый зайчик!",
        animation: "rabbit",
        duration: 2500
    },
    {
        title: "Солнышко встает",
        text: "Солнышко встает, всем тепло дает!",
        animation: "sun",
        duration: 2500
    }
];

let currentCartoonIndex = 0;
let userRecording = null;
let mediaRecorder = null;
let audioChunks = [];
let recordedAudioBlob = null;
let animationInterval = null;

function loadCartoonScene() {
    const scene = cartoonScenes[currentCartoonIndex];
    document.getElementById('cartoon-title').textContent = scene.title;
    document.getElementById('cartoon-text').textContent = scene.text;
    document.getElementById('result-panel-cartoon').classList.add('hidden');
    document.getElementById('watch-cartoon').classList.remove('hidden');
    document.getElementById('record-voiceover').classList.add('hidden');
    document.getElementById('watch-my-version').classList.add('hidden');

    // Очищаем canvas
    const canvas = document.getElementById('cartoon-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#E8F4F8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const character = document.getElementById('character-cartoon');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
}

function watchCartoon() {
    const scene = cartoonScenes[currentCartoonIndex];
    const watchBtn = document.getElementById('watch-cartoon');

    watchBtn.disabled = true;
    watchBtn.textContent = '🎬 Играет...';

    // Запускаем анимацию
    playAnimation(scene.animation, scene.duration);

    // Озвучиваем текст голосом
    const utterance = new SpeechSynthesisUtterance(scene.text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    utterance.pitch = 1.2; // Более детский голос

    window.speechSynthesis.speak(utterance);

    setTimeout(() => {
        watchBtn.disabled = false;
        watchBtn.textContent = '🎬 Посмотреть снова';
        document.getElementById('record-voiceover').classList.remove('hidden');
    }, scene.duration);
}

function playAnimation(type, duration) {
    const canvas = document.getElementById('cartoon-canvas');
    const ctx = canvas.getContext('2d');
    const startTime = Date.now();

    if (animationInterval) clearInterval(animationInterval);

    animationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#E8F4F8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (type === 'kolobok') {
            // Колобок катится
            const x = 50 + (canvas.width - 100) * progress;
            const y = canvas.height / 2;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.fill();
            // Лицо
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x - 12, y - 8, 4, 0, Math.PI * 2);
            ctx.arc(x + 12, y - 8, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y + 5, 15, 0, Math.PI);
            ctx.stroke();
        } else if (type === 'rabbit') {
            // Зайчик прыгает
            const x = canvas.width / 2;
            const jumpHeight = Math.abs(Math.sin(progress * Math.PI * 4)) * 80;
            const y = canvas.height - 60 - jumpHeight;
            // Тело
            ctx.fillStyle = '#DDD';
            ctx.fillRect(x - 20, y, 40, 50);
            // Уши
            ctx.fillRect(x - 15, y - 30, 10, 30);
            ctx.fillRect(x + 5, y - 30, 10, 30);
            // Глаза
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x - 8, y + 15, 3, 0, Math.PI * 2);
            ctx.arc(x + 8, y + 15, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'sun') {
            // Солнышко встает
            const y = canvas.height - (canvas.height * 0.7 * progress);
            const x = canvas.width / 2;
            // Солнце
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(x, y, 50, 0, Math.PI * 2);
            ctx.fill();
            // Лучи
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 4;
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(angle) * 60, y + Math.sin(angle) * 60);
                ctx.lineTo(x + Math.cos(angle) * 80, y + Math.sin(angle) * 80);
                ctx.stroke();
            }
        }

        if (elapsed >= duration) {
            clearInterval(animationInterval);
        }
    }, 1000 / 30); // 30 FPS
}

async function startVoiceoverRecording() {
    const scene = cartoonScenes[currentCartoonIndex];
    const recordBtn = document.getElementById('record-voiceover');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            userRecording = URL.createObjectURL(recordedAudioBlob);

            document.getElementById('watch-my-version').classList.remove('hidden');
            recordBtn.classList.remove('hidden');
            recordBtn.textContent = '🎤 Записать заново';
            recordBtn.disabled = false;

            // Показываем результат
            score += 100;
            incrementExerciseProgress('cartoon-voiceover');
            updateScore();
            document.getElementById('result-title-cartoon').textContent = '🎬 Отлично!';
            document.getElementById('result-message-cartoon').textContent = 'Ты озвучил мультик! Посмотри что получилось.';
            document.getElementById('earned-points-cartoon').textContent = '+100';
            document.getElementById('result-panel-cartoon').classList.remove('hidden');
        };

        // Запускаем анимацию и запись одновременно
        mediaRecorder.start();
        playAnimation(scene.animation, scene.duration);

        recordBtn.textContent = '⏹️ Идет запись...';
        recordBtn.disabled = true;

        // Останавливаем запись через duration
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
        }, scene.duration);

    } catch (error) {
        alert('Не удалось получить доступ к микрофону');
    }
}

function watchMyVersion() {
    const scene = cartoonScenes[currentCartoonIndex];
    const audio = new Audio(userRecording);

    // Синхронизируем анимацию и аудио
    playAnimation(scene.animation, scene.duration);
    audio.play();
}

function nextCartoonScene() {
    currentCartoonIndex++;
    if (currentCartoonIndex >= cartoonScenes.length) {
        currentCartoonIndex = 0;
    }
    userRecording = null;
    recordedAudioBlob = null;
    if (animationInterval) clearInterval(animationInterval);
    loadCartoonScene();
}

function resetCartoon() {
    currentCartoonIndex = 0;
    userRecording = null;
    recordedAudioBlob = null;
    if (animationInterval) clearInterval(animationInterval);
    loadCartoonScene();
}

// === УПРАЖНЕНИЕ "РАЗНАЯ СКОРОСТЬ ЧТЕНИЯ" ===

const speedTexts = [
    "Белка прыгает по веткам и собирает орешки",
    "Кот Мурзик любит спать на теплом солнышке",
    "Дети играют в парке и смеются от радости"
];

const speeds = [
    { name: "Медленно", rate: 0.6, emoji: "🐢" },
    { name: "Нормально", rate: 1.0, emoji: "🚶" },
    { name: "Быстро", rate: 1.5, emoji: "🏃" }
];

let currentSpeedTextIndex = 0;
let currentSpeedIndex = 0;

function loadSpeedReading() {
    const text = speedTexts[currentSpeedTextIndex];
    const speed = speeds[currentSpeedIndex];

    document.getElementById('speed-text').textContent = text;
    document.getElementById('current-speed').textContent = `${speed.emoji} ${speed.name}`;
    document.getElementById('result-panel-speed').classList.add('hidden');
    document.getElementById('start-recording-speed').classList.remove('hidden');
    document.getElementById('stop-recording-speed').classList.add('hidden');

    const character = document.getElementById('character-speed');
    character.style.backgroundImage = "url('assets/characters/character3.png')";
}

function startRecordingSpeed() {
    if (!recognition) return;

    document.getElementById('start-recording-speed').classList.add('hidden');
    document.getElementById('stop-recording-speed').classList.remove('hidden');

    startTime = Date.now();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSpeedResult(transcript);
    };

    recognition.start();
}

function stopRecordingSpeed() {
    document.getElementById('start-recording-speed').classList.remove('hidden');
    document.getElementById('stop-recording-speed').classList.add('hidden');
    if (recognition) recognition.stop();
}

function handleSpeedResult(transcript) {
    const elapsed = (Date.now() - startTime) / 1000;
    const speed = speeds[currentSpeedIndex];

    const points = 70;
    score += points;
    incrementExerciseProgress('speed-reading');
    updateScore();

    document.getElementById('result-title-speed').textContent = '⚡ Отлично!';
    document.getElementById('result-message-speed').textContent = `Ты прочитал текст ${speed.name.toLowerCase()}! Время: ${elapsed.toFixed(1)} сек`;
    document.getElementById('earned-points-speed').textContent = '+' + points;
    document.getElementById('result-panel-speed').classList.remove('hidden');
}

function nextSpeed() {
    currentSpeedIndex++;
    if (currentSpeedIndex >= speeds.length) {
        currentSpeedIndex = 0;
        currentSpeedTextIndex++;
        if (currentSpeedTextIndex >= speedTexts.length) {
            currentSpeedTextIndex = 0;
        }
    }
    loadSpeedReading();
}

function resetSpeedReading() {
    currentSpeedTextIndex = 0;
    currentSpeedIndex = 0;
    loadSpeedReading();
}

// === УПРАЖНЕНИЕ "ПЕРЕСКАЗ С ДИКЦИЕЙ" ===

const retellStories = [
    {
        title: "Колобок",
        text: "Жили-были старик со старухой. Испекла старуха колобок и положила на окошко. Колобок полежал-полежал, да и покатился по дорожке.",
        prompt: "Расскажи своими словами про Колобка"
    },
    {
        title: "Репка",
        text: "Посадил дед репку. Выросла репка большая-пребольшая. Стал дед репку тянуть. Тянет-потянет, вытянуть не может.",
        prompt: "Расскажи своими словами про репку"
    }
];

let currentRetellIndex = 0;
let storyPlayed = false;

function loadRetellStory() {
    const story = retellStories[currentRetellIndex];

    document.getElementById('retell-title').textContent = story.title;
    document.getElementById('retell-text').textContent = story.text;
    document.getElementById('retell-prompt').textContent = story.prompt;
    document.getElementById('result-panel-retell').classList.add('hidden');
    document.getElementById('listen-story').classList.remove('hidden');
    document.getElementById('start-retell').classList.add('hidden');
    document.getElementById('stop-retell').classList.add('hidden');
    storyPlayed = false;

    const character = document.getElementById('character-retell');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
}

function listenStory() {
    const story = retellStories[currentRetellIndex];
    const listenBtn = document.getElementById('listen-story');

    listenBtn.disabled = true;
    listenBtn.textContent = '🔊 Слушаем...';

    const utterance = new SpeechSynthesisUtterance(story.text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.8;

    utterance.onend = () => {
        listenBtn.disabled = false;
        listenBtn.textContent = '🔊 Послушать снова';
        document.getElementById('start-retell').classList.remove('hidden');
        storyPlayed = true;
    };

    window.speechSynthesis.speak(utterance);
}

function startRetell() {
    if (!recognition) return;

    document.getElementById('start-retell').classList.add('hidden');
    document.getElementById('stop-retell').classList.remove('hidden');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleRetellResult(transcript);
    };

    recognition.start();
}

function stopRetell() {
    document.getElementById('start-retell').classList.remove('hidden');
    document.getElementById('stop-retell').classList.add('hidden');
    if (recognition) recognition.stop();
}

function handleRetellResult(transcript) {
    const points = 120;
    score += points;
    incrementExerciseProgress('retelling');
    updateScore();

    document.getElementById('result-title-retell').textContent = '📖 Отлично!';
    document.getElementById('result-message-retell').textContent = 'Ты пересказал историю своими словами!';
    document.getElementById('earned-points-retell').textContent = '+' + points;
    document.getElementById('result-panel-retell').classList.remove('hidden');
}

function nextRetellStory() {
    currentRetellIndex++;
    if (currentRetellIndex >= retellStories.length) {
        currentRetellIndex = 0;
    }
    loadRetellStory();
}

function resetRetell() {
    currentRetellIndex = 0;
    loadRetellStory();
}

