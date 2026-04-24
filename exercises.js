// === УПРАЖНЕНИЕ "ЗВУКИ" (объединяет Р, Л, Ш, Ж) ===

const soundsData = [
    {
        sound: "Р",
        words: ["Рыба", "Рак", "Роза", "Ракета", "Радуга", "Рука", "Река", "Рысь", "Корова", "Ворона", "Морковь", "Барабан", "Карандаш", "Тигр", "Ветер"],
        color: "#FF6B6B"
    },
    {
        sound: "Л",
        words: ["Лампа", "Лук", "Луна", "Лиса", "Лодка", "Лес", "Лето", "Молоко", "Белка", "Стол", "Стул", "Пол"],
        color: "#4CAF50"
    },
    {
        sound: "Ш",
        words: ["Шар", "Шапка", "Шуба", "Школа", "Мышка", "Кошка", "Малыш", "Карандаш", "Шишка"],
        color: "#2196F3"
    },
    {
        sound: "Ж",
        words: ["Жук", "Жаба", "Жираф", "Ножик", "Ёжик", "Лыжи", "Пижама", "Медвежонок"],
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

// === УПРАЖНЕНИЕ "С КАРАНДАШОМ" ===

const pencilPhrases = [
    "Карл у Клары украл кораллы",
    "Шла Саша по шоссе",
    "На дворе трава, на траве дрова",
    "Ехал Грека через реку",
    "От топота копыт пыль по полю летит"
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

// === УПРАЖНЕНИЕ "СЛОЖНЫЕ СЛОВА" ===

const hardWords = [
    { word: "Достопримечательность", hint: "До-сто-при-ме-ча-тель-ность" },
    { word: "Фотоаппарат", hint: "Фо-то-ап-па-рат" },
    { word: "Велосипед", hint: "Ве-ло-си-пед" },
    { word: "Электричество", hint: "Э-лек-три-че-ство" },
    { word: "Путешествие", hint: "Пу-те-ше-ствие" },
    { word: "Приключение", hint: "При-клю-че-ние" },
    { word: "Воспитатель", hint: "Вос-пи-та-тель" }
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
