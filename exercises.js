// === УПРАЖНЕНИЕ "ЗВУК Р" ===

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
        duration: 3000
    },
    {
        title: "Три медведя",
        text: "Кто сидел на моём стуле и сломал его?",
        duration: 2500
    },
    {
        title: "Репка",
        text: "Тянут-потянут, вытянуть не могут!",
        duration: 2000
    }
];

let currentCartoonIndex = 0;
let userRecording = null;
let mediaRecorder = null;
let audioChunks = [];

function loadCartoonScene() {
    const scene = cartoonScenes[currentCartoonIndex];
    document.getElementById('cartoon-title').textContent = scene.title;
    document.getElementById('cartoon-text').textContent = scene.text;
    document.getElementById('result-panel-cartoon').classList.add('hidden');
    document.getElementById('play-cartoon').classList.remove('hidden');
    document.getElementById('record-voiceover').classList.add('hidden');
    document.getElementById('play-my-voice').classList.add('hidden');

    const character = document.getElementById('character-cartoon');
    character.style.backgroundImage = "url('assets/characters/feya.png')";
}

async function playCartoonWithSound() {
    const scene = cartoonScenes[currentCartoonIndex];
    const playBtn = document.getElementById('play-cartoon');
    playBtn.disabled = true;
    playBtn.textContent = '🎬 Играет...';

    // Используем Speech Synthesis API для озвучки
    const utterance = new SpeechSynthesisUtterance(scene.text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;

    utterance.onend = () => {
        playBtn.disabled = false;
        playBtn.textContent = '🎬 Посмотреть снова';
        document.getElementById('record-voiceover').classList.remove('hidden');
    };

    window.speechSynthesis.speak(utterance);
}

async function startVoiceoverRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            userRecording = URL.createObjectURL(audioBlob);
            document.getElementById('play-my-voice').classList.remove('hidden');
            document.getElementById('record-voiceover').classList.remove('hidden');
            document.getElementById('record-voiceover').textContent = '🎤 Записать заново';

            // Показываем результат
            score += 100;
            updateScore();
            document.getElementById('result-title-cartoon').textContent = '🎬 Отлично!';
            document.getElementById('result-message-cartoon').textContent = 'Ты озвучил сцену! Послушай свою запись.';
            document.getElementById('earned-points-cartoon').textContent = '+100';
            document.getElementById('result-panel-cartoon').classList.remove('hidden');
        };

        mediaRecorder.start();
        document.getElementById('record-voiceover').textContent = '⏹️ Остановить запись';
        document.getElementById('record-voiceover').onclick = stopVoiceoverRecording;

    } catch (error) {
        alert('Не удалось получить доступ к микрофону');
    }
}

function stopVoiceoverRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        document.getElementById('record-voiceover').onclick = startVoiceoverRecording;
    }
}

function playMyVoiceover() {
    if (userRecording) {
        const audio = new Audio(userRecording);
        audio.play();
    }
}

function nextCartoonScene() {
    currentCartoonIndex++;
    if (currentCartoonIndex >= cartoonScenes.length) {
        currentCartoonIndex = 0;
    }
    userRecording = null;
    loadCartoonScene();
}

function resetCartoon() {
    currentCartoonIndex = 0;
    userRecording = null;
    loadCartoonScene();
}
