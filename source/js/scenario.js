const createState = ({ key, showStatus = false, messages, options = [], requiresInput = false, next = null, autoNext = false, actionRedirect = false, video = null, fields = [] }) => {
  if (!Array.isArray(fields)) {
    console.error(`Ошибка: поля для состояния ${key} должны быть массивом, но получено:`, fields);
    fields = [];
  }

  return {
    key,
    showStatus,
    messages,
    options,
    requiresInput,
    next,
    autoNext,
    actionRedirect,
    video,
    fields, // Массив полей
  };
};
// Функция для создания опции
const createOption = (label, value, next) => ({
  label,
  value,
  next,
});

// Создаем динамический сценарий
const chatScenario = (() => {
  const states = {};

  // Функция добавления состояния в сценарий
  const addState = (stateConfig) => {
    const state = createState(stateConfig);
  
    // Добавляем поля только если они не были переданы в stateConfig
    if (!state.fields) {
      if (state.key === "feedback" || "qusetion") {
        state.fields = ["name", "phone", "question", "city"];
      } else if (state.key === "city") {
        state.fields = ["city"];
      } else if (state.key === "question") {
        state.fields = ["question"];
      }
    }
  
    states[state.key] = state;
  };

  // Добавляем состояния
  addState({
    key: "start",
    messages: [
      {
        type: 'text',
        value: "Добрый день! Меня зовут Анастасия и я виртуальный консультант команды «Mivino» <br><br> У нас для вас есть отличное решение для пассивного заработка. Просто установите холодильники с нашим мороженым в продуктовых супермаркетах и получайте стабильную прибыль. <br><br> Хотите узнать подробности? Задайте вопрос и я отвечу на него",
      },
    ],
    options: [
      createOption("Кто вы такие и как вам удалось построить такую крупную сеть?", "aboutCompany", "aboutCompany"),
      createOption("Какие инвестиции нужны для запуска бизнеса?", "investments", "investments"),
      createOption("Как и сколько можно заработать на установке холодильников?", "profit", "profit"),
      createOption("Какую помощь мы окажем вам при запуске бизнеса?", "help", "help"),
      createOption("Могу ли я пообщаться с владельцами сети?", "leaders", "leaders"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    video: "videos/start.mp4"
  });

  addState({
    key: "aboutCompany",
    messages: [
      {
        type: 'text',
        value: "Наша компания ведет успешную работу с 2019 года, сегодня мы открыли уже более 200 точек в 40+ городах. Мы единственные в России производим алкогольное джелато, рецепт которого разработан технологом №1 в мире Сальваторе Капелано. Ежемесячно производим более 100 тонн мороженого и хотим сделать так, чтобы о нас знали все! И вы можете помочь нам в этом. Мы можем направить вам подробную презентацию франшизы. Хотите ее получить? 🙂",
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "getCatalog"),
    ],
    video: "videos/aboutCompany.mp4"
  });

  addState({
    key: "investments",
    messages: [
      {
        type: 'text',
        value: "Все очень просто: мы предоставляем вам брендированные холодильники с мороженым, вы договариваетесь об их БЕСПЛАТНОЙ установке в розничных магазинах вашего города и получаете прибыль. <br><br> Прибыль будет зависеть от количества установленных холодильников. При установке трех холодильников прибыль будет равна 157 000 рублей, пяти — 257 000 рублей, десяти — 549 000 рублей и так далее. <br><br> Хотите узнать, сколько вы можете зарабатывать в вашем городе? Мы можем прислать вам подробную финансовую модель",
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "getReviews"),
    ],
    video: "videos/investments(profit).mp4"
  });

  addState({
    key: "profit",
    messages: [
      {
        type: 'text',
        value: "Все очень просто: мы предоставляем вам брендированные холодильники с мороженым, вы договариваетесь об их БЕСПЛАТНОЙ установке в розничных магазинах вашего города и получаете прибыль. <br><br> Прибыль будет зависеть от количества установленных холодильников. При установке трех холодильников прибыль будет равна 157 000 рублей, пяти — 257 000 рублей, десяти — 549 000 рублей и так далее <br><br> Хотите узнать, сколько вы можете зарабатывать в вашем городе? Мы можем прислать вам подробную финансовую модель"
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "rejection"),
    ],
    video: "videos/investments(profit).mp4"
  });

  addState({
    key: "help",
    messages: [
      {
        type: 'text',
        value: "Мы передадим вам проверенную бизнес-модель и поможем организовать все процессы бизнеса всего за 16 дней. Предоставим фирменные холодильники сети и организуем регулярные поставки мороженого. Кроме этого, дадим подробные рекомендации по выбору магазинов в вашем городе, предоставим базу потенциальных клиентов и организуем продвижение через наши рекламные каналы. <br><br> Для нас очень важно, чтобы вы пришли к результатам! У нас есть подробный план запуска и договор с условиями сотрудничества. Мы можем направить вам эти документы. Хотите?"
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "getPhoto"),
    ],
    video: "videos/help.mp4"
  });

  addState({
    key: "leaders",
    messages: [
      {
        type: 'text',
        value: "Конечно! Мы можем организовать для вас онлайн-встречу в любое удобное для вас время. Вы сможете пообщаться с нашими владельцами и задать им абсолютно любые вопросы о бизнесе и сотрудничестве с нашей франшизой. Записать вас на нашу встречу? 🥰"
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "rejection"),
    ],
    video: "videos/leaders.mp4"
  });

  addState({
    key: "question",
    messages: [
      {
        type: 'text',
        value: "Что вас интересует?"
      },
    ],
    requiresInput: true,
    fields: ["question"],
    video: "videos/question.mp4",
    next: 'messenger'
  });

  addState({
    key: "messenger",
    messages: [
      {
        type: 'text',
        value: "Отлично! Где мы можем связаться с вами?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "feedback"),
      createOption("WhatsApp", "whatsapp", "feedback"),
      createOption("Viber", "viber", "feedback"),
    ],
    video: "videos/messenger.mp4"
  });

  addState({
    key: "getCatalog",
    messages: [
      {
        type: 'text',
        value: "Может вы хотите получить каталог, где сможете больше узнать о нашем ассортименте и видах мороженого?",
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "rejection"),
    ],
    video: "videos/getCatalog.mp4"
  });

  addState({
    key: "getReviews",
    messages: [
      {
        type: 'text',
        value: "Может вы хотите ознакомиться с отзывами партнеров, которые уже работают по нашей франшизе?",
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "rejection"),
    ],
    video: "videos/getReviews.mp4"
  });

  addState({
    key: "getPhoto",
    messages: [
      {
        type: 'text',
        value: "Мы можем прислать вам фото наших холодильников, мороженого и магазинов. Хотите?",
      },
    ],
    options: [
      createOption("Да", "yes", "messenger"),
      createOption("Нет", "no", "rejection"),
    ],
    video: "videos/getPhoto.mp4"
  });

  addState({
    key: "feedback",
    messages: [
      {
        type: 'text',
        value: "Оставьте ваше имя и номер и мы свяжемся с вами в ближайшее время 👍",
      },
    ],
    requiresInput: true,
    fields: ["name", "phone"],
    video: "videos/feedback.mp4",
    next: "end",
  });

  addState({
    key: "rejection",
    messages: [
      {
        type: 'text',
        value: "Может вас заинтересуют другие вопросы о работе франшизы?",
      },
      {
        type: 'options',
        value: [
          createOption("Кто вы такие и как вам удалось построить такую крупную сеть?", "aboutCompany", "aboutCompany"),
          createOption("Какие инвестиции нужны для запуска бизнеса?", "investments", "investments"),
          createOption("Как и сколько можно заработать на установке холодильников?", "profit", "city2"),
          createOption("Какую помощь мы окажем вам при запуске бизнеса?", "help", "help"),
          createOption("Могу ли я пообщаться с владельцами сети?", "feedback", "feedback"),
          createOption("Хочу задать свой вопрос", "question", "question"),
        ]
      },
    ],
    video: "videos/rejection.mp4",
  });

  addState({
    key: "end",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! 😉",
      },
    ],
    video: "videos/end.mp4",
    actionRedirect: true,
  });

  return states;
})();
