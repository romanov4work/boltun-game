// Данные для упражнений

// Скороговорки
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

// Эмоции
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

// Мотивационные сообщения
const motivationMessages = [
    "Отлично! Продолжай в том же духе! 🌟",
    "Ты молодец! Так держать! 💪",
    "Прекрасная работа! 🎉",
    "Ты делаешь большие успехи! 🚀",
    "Невероятно! Ты супер! ⭐",
    "Продолжай, у тебя отлично получается! 🎯",
    "Ты на правильном пути! 🌈",
    "Фантастика! Ты справляешься! 🏆",
    "Браво! Так держать! 👏",
    "Ты становишься лучше с каждым разом! 💫"
];

// Общее количество заданий в каждом упражнении
const exerciseTotals = {
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

// Порядок упражнений в дереве
const treeExercises = [
    'tongue-twisters',
    'sounds',
    'breathing',
    'emotions',
    'speed-reading',
    'hard-words',
    'articulation',
    'pencil-challenge',
    'retelling'
];
