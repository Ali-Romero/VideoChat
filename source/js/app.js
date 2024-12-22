// // Хранение данных
// const chatHistory = [];

// const chatContent = document.getElementById("chatContent");
// const chatContainer = document.getElementById("chatContainer");
// const typingIndicator = document.getElementById("typingIndicator");
// const botNotificationSound = new Audio('audio/ringtone.mp3');

// let lastOptions = null;
// let isBotBusy = false;
// let currentVideoKey = null;
// let isMuted = true;

// function toggleMute() {
//   isMuted = !isMuted;
//   const videos = document.querySelectorAll('#videoContainer video');
//   videos.forEach(video => {
//       video.muted = isMuted;
//   });

//   const muteIcon = document.getElementById('muteIcon');
//   muteIcon.src = isMuted ? 'images/mute.svg' : 'images/unmute.svg';
// }

// function animateFadeIn(element) {
//   anime({
//     targets: element,
//     opacity: [0, 1],
//     translateY: [10, 0],
//     duration: 600,
//     easing: "easeOutQuad",
//   });
// }

// function scrollToBottom() {
//   const simpleBarInstance = SimpleBar.instances.get(chatContainer);

//   const scrollToEnd = () => {
//     let scrollElement, maxScroll;

//     if (simpleBarInstance) {
//       scrollElement = simpleBarInstance.getScrollElement();
//       maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
//     } else {
//       scrollElement = chatContainer;
//       maxScroll = chatContainer.scrollHeight - chatContainer.clientHeight;
//     }

//     anime({
//       targets: scrollElement,
//       scrollTop: maxScroll,
//       duration: 800,
//       easing: 'easeInOutQuad',
//     });
//   };

//   setTimeout(scrollToEnd, 0);
// }

// function displayStatus(status) {
//   const statusContainer = document.querySelector('#status');

//   if (statusContainer) {
//     if (status) {
//       statusContainer.style.display = 'block';
//       scrollToBottom();

//       anime({
//         targets: statusContainer,
//         opacity: [0, 1],
//         translateY: [8, 0],
//         duration: 800,
//         easing: 'easeOutQuad',
//       });
//     } else {
//       statusContainer.style.display = 'none';
//     }
//   }
// }

// function clearOptions() {
//   if (lastOptions) {
//     lastOptions.remove();
//     lastOptions = null;
//   }
// }

// function appendMessage({ text, value, key, isUser }) {
//   const message = document.createElement("div");

//   const isFirstMessage = chatHistory.length === 0 && !isUser;
//   message.className = `message ${isUser ? "user-message" : "bot-message"} ${isFirstMessage ? "first-message" : ""}`;

//   message.innerHTML = `<p>${text}</p>`;
//   chatContent.appendChild(message);

//   chatHistory.push({
//     sender: isUser ? "user" : "bot",
//     key: key,
//     message: value || text,
//     timestamp: new Date().toISOString(),
//   });

//   animateFadeIn(message);
//   scrollToBottom();

//   if (!isUser) {
//     setTimeout(() => {
//       playMessageVideo(key);
//     }, 100);
//   }

//   return message;
// }

// function showTypingIndicator(delay) {
//   anime({
//     targets: typingIndicator,
//     opacity: 1,
//     duration: 400,
//     translateX: [-2, 0],
//     easing: 'easeInOutQuad',
//     begin: () => {
//       if (typingIndicator) {
//         typingIndicator.style.display = 'block';
//         scrollToBottom();
//       }
//     },
//   });

//   return new Promise((resolve) => {
//     setTimeout(() => {
//       anime({
//         targets: typingIndicator,
//         opacity: 0,
//         duration: 200,
//         translateX: [0, 0],
//         easing: 'easeInOutQuad',
//         complete: () => {
//           if (typingIndicator) {
//             typingIndicator.style.display = 'none';
//           }
//           resolve();
//         },
//       });
//     }, delay);
//   });
// }

// function animateVideoOpacity(videoElement, fromOpacity, toOpacity, onBegin = null, onComplete = null) {
//   anime({
//     targets: videoElement,
//     opacity: [fromOpacity, toOpacity],
//     duration: 600,
//     easing: 'easeInOutElastic(1, 0.5)',
//     begin: onBegin,
//     complete: onComplete,
//   });
// }

// function createBaseVideoElement(videoPath, isMuted, key = null) {
//   const videoElement = document.createElement('video');
//   videoElement.src = videoPath;
//   videoElement.preload = 'auto';
//   videoElement.muted = isMuted;
//   videoElement.controls = false;
//   videoElement.className = 'chat-video';
//   videoElement.style.width = '100%';
//   videoElement.style.opacity = '0'; // Начальное состояние невидимости
//   if (key) {
//     videoElement.setAttribute('data-key', key);
//   }
//   return videoElement;
// }

// function addVideoWithAnimation(container, videoPath, isMuted, key = null) {
//   const videoElement = createBaseVideoElement(videoPath, isMuted, key);
//   container.appendChild(videoElement);

//   videoElement.addEventListener('loadeddata', () => {
//     animateVideoOpacity(videoElement, 0, 1, () => videoElement.play());
//   });

//   return videoElement;
// }

// function preloadInitialVideo(videoPath, isMuted) {
//   const videoContainer = document.getElementById("videoContainer");
//   addVideoWithAnimation(videoContainer, videoPath, isMuted);
// }

// function playMessageVideo(key) {
//   const state = chatScenario[key];
//   if (!state || !state.video) return;

//   const videoContainer = document.getElementById("videoContainer");
//   const existingVideo = videoContainer.querySelector(`video[data-key="${key}"]`);
//   const preloadedVideo = videoContainer.querySelector('video:not([data-key])');
//   const currentVideo = videoContainer.querySelector('video[data-key]');

//   if (currentVideoKey === key && existingVideo && existingVideo.style.opacity === "1") {
//     return;
//   }

//   const isFirstVideo = currentVideoKey === null;
//   currentVideoKey = key;

//   if (currentVideo && currentVideo !== existingVideo) {
//     animateVideoOpacity(currentVideo, 1, 0, null, () => currentVideo.remove());
//   }

//   if (existingVideo) {
//     existingVideo.muted = isMuted;
//     animateVideoOpacity(existingVideo, 0, 1, () => existingVideo.play());
//   } 
//   else if (preloadedVideo) {
//     preloadedVideo.setAttribute('data-key', key);
//     preloadedVideo.muted = isMuted;

//     if (isFirstVideo) {
//       preloadedVideo.style.opacity = "1";
//       preloadedVideo.play();
//     } else {
//       animateVideoOpacity(preloadedVideo, 0, 1, () => preloadedVideo.play());
//     }
//   } 
//   else {
//     const newVideo = addVideoWithAnimation(videoContainer, state.video, isMuted, key);
//     newVideo.muted = isMuted;
//   }
// }

// async function appendBotMessageWithDelay(message, key) {
//   const delayMap = {
//     'text':  Math.min(message.value.length * 18, 4000),
//     'swiper': 2000,
//   }

//   isBotBusy = true;

//   await showTypingIndicator(delayMap[message.type] || 0)

//   botNotificationSound.play();

//   playMessageVideo(key);

//   switch(message.type) {
//     case 'text':
//       appendMessage({ text: message.value, key: key });
//       break;
//     case 'swiper':
//       renderSwiper(message.value);
//       break;
//     case 'options':
//       renderOptions(key, message.value);
//       break;
//   }

//   isBotBusy = false;
// }

// function renderOptions(key, options) {
//   clearOptions();

//   const responseContainer = document.createElement("div");
//   responseContainer.className = "response-options";

//   options.forEach(({ label, value, next }) => {
//     const button = document.createElement("button");
//     button.type = 'button';
//     button.innerHTML = label;
//     button.onclick = () => {
//       if (isBotBusy) return;
//       appendMessage({ text: label, value: value, key: key, isUser: true });

//       if (/^questionFranchise\d*$/.test(key) && lastBotMessage) {
//         lastBotMessage.remove();
//         lastBotMessage = null;
//       }

//       clearOptions();
//       processChatState(next);
//     };
//     responseContainer.appendChild(button);
//   });

//   chatContent.appendChild(responseContainer);
//   animateFadeIn(responseContainer);
//   scrollToBottom();
//   lastOptions = responseContainer;
// }

// function renderSwiper(swiperItems) {
//   const itemsTemplate = swiperItems.map(({ src }) => `
//     <div class="swiper-slide">
//       <div>
//         <img src="${src}" alt="${src.split('/').pop()}" />
//       </div>
//     </div>
//   `)

//   const template = `
//     <div class="swiper-container swiper-chat">
//       <div class="swiper-wrapper">
//         ${itemsTemplate.join('')}
//       </div>
//       <div class="gallery-pagination swiper-bullets"></div>
//     </div>
//   `

//   const element = new DOMParser()
//     .parseFromString(template, "text/html")
//     .body
//     .firstElementChild;

//   chatContent.appendChild(element);
//   animateFadeIn(element);
//   scrollToBottom();

//   new Swiper(element, {
//     speed: 450,
//     effect: 'slide',
//     rewind: true,
//     grabCursor: true,
//     pagination: {
//       el: '.gallery-pagination',
//       clickable: true,
//     },
//     breakpoints: {
//       200: {
//         spaceBetween: 10,
//         slidesPerView: 1,
//       },
//       768: {
//         spaceBetween: 14,
//         slidesPerView: 2,
//       },
//       1400: {
//         spaceBetween: 22,
//         slidesPerView: 2,
//       },
//     },
//   });
// }

// function renderFields(key, fields, placeholders, callback) {
//   const inputContainer = document.createElement("div");
//   inputContainer.className = "textarea-container";

//   const form = document.createElement("form");
//   form.className = "dynamic-form";

//   const validationRules = {};

//   fields.forEach((field) => {
//     let inputField;
  
//     if (field === "question") {
//       inputField = document.createElement("textarea");
//       inputField.className = "input__field input__field--textarea";
//     } else {
//       inputField = document.createElement("input");
//       inputField.type = "text";
//       inputField.className = "input__field";
//     }
  
//     inputField.name = field;
//     inputField.placeholder = placeholders[field] || `Введите ${field}`;
//     inputField.autocomplete = "off";
  
//     if (field === "phone") {
//       inputField.type = "tel";
//       Inputmask({ mask: "+7 (999) 999 9999", showMaskOnHover: false }).mask(inputField);
//       validationRules[field] = {
//         required: true,
//         phone: true,
//       };
//     } else if (field === "email") {
//       inputField.type = "email";
//       validationRules[field] = {
//         required: true,
//         email: true,
//       };
//     } else if (field === "name") {
//       $(inputField).on("input", function () {
//         let value = $(this).val();
//         value = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, "");
//         $(this).val(value.charAt(0).toUpperCase() + value.slice(1));
//       });
//       validationRules[field] = {
//         required: true,
//         customName: true,
//       };
//     } else if (field !== "question") {
//       validationRules[field] = {
//         required: true,
//       };
//     }

//     form.appendChild(inputField);
//   });

//   const submitButton = document.createElement("button");
//   submitButton.className = "btn";
//   submitButton.type = "submit";
//   submitButton.textContent = "Отправить";

//   form.appendChild(submitButton);
//   inputContainer.appendChild(form);

//   chatContent.appendChild(inputContainer);
//   animateFadeIn(inputContainer);
//   scrollToBottom();

//   lastOptions = inputContainer;

//   $(form).validate({
//     errorPlacement: function () {},
//     rules: validationRules,
//     submitHandler: function () {
//       const formData = {};
//       fields.forEach((field) => {
//         formData[field] = form.elements[field].value.trim();
//       });
//       let messageParts = [];
//       if (formData.name) messageParts.push(`имя: ${formData.name}`);
//       if (formData.phone) messageParts.push(`телефон: ${formData.phone}`);
//       if (formData.email) messageParts.push(`email: ${formData.email}`);
//       if (formData.city) messageParts.push(`город: ${formData.city}`);
//       if (formData.question) messageParts.push(`${formData.question}`);

//       const messageText = messageParts.join(", ");

//       appendMessage({
//         text: messageText || "Нет заполненных данных",
//         value: JSON.stringify(formData),
//         key, 
//         isUser: true 
//       });
//       inputContainer.remove();
//       if (callback) callback(formData);
//     },
//   });
// }

// async function processChatState(stateKey) {
//   const state = chatScenario[stateKey];
//   if (!state) return;

//   const { messages, showStatus, options, requiresInput, fields, autoNext, actionRedirect, action } = state;

//   if (showStatus) {
//     setTimeout(() => {
//       displayStatus(true);
//     }, 3000);
//   } else {
//     displayStatus(false);
//   }

//   let accumulatedDelay = 0;

//   for (let index = 0; index < messages.length; index++) {
//     await appendBotMessageWithDelay(messages[index], stateKey);
//   }

//   if (requiresInput) {
//     if (fields && fields.length > 0) {
//       const placeholders = {
//         name: "Ваше имя",
//         phone: "Ваш телефон",
//         question: "Ваш вопрос",
//         city: "Ваш город"
//       };

//       renderFields(stateKey, fields, placeholders, (formData) => {
//         processChatState(state.next);
//       });
//     }
//   } else if (options && options.length > 0) {
//     renderOptions(stateKey, options);
//   } else if (action) {
//     action();
//   }

//   if (actionRedirect) {
//     sendChatHistory();
//     setTimeout(() => {
//       window.location.href = 'thanks.html';
//     }, 6000);
//   }
//   if (!options || options.length === 0) {
//     setTimeout(() => {
//       isBotBusy = false;
//     }, accumulatedDelay + 1000);
//   }
// }

// function getUTMData() {
//   return {
//     phone: '',
//     email: '',
//     name: '',
//     city: '',
//     question: '',
//     timezone: (-1 * new Date().getTimezoneOffset()) / 60,
//     utm_medium: $.query.get('utm_medium') || '',
//     utm_placement: $.query.get('utm_placement') || '',
//     utm_source: $.query.get('utm_source') || '',
//     utm_term: $.query.get('utm_term') || '',
//     utm_content: $.query.get('utm_content') || '',
//     utm_campaign: $.query.get('utm_campaign') || '',
//     utm_campaign_name: $.query.get('utm_campaign_name') || '',
//     device_type: $.query.get('device_type') || '',
//     utm_region_name: $.query.get('utm_region_name') || '',
//     utm_placement: $.query.get('utm_placement') || '',
//     utm_description: $.query.get('utm_description') || '',
//     utm_device: $.query.get('utm_device') || '',
//     page_url: window.location.href,
//     user_location_ip: '',
//     yclid: $.query.get('yclid') || '',
//   };
// }

// function getPayload(history) {
//   function filterHistory(item) {
//     return item.sender === "user";
//   }

//   function reduceHistory(acc, item) {
//     if (!item.key || !item.message) {
//       return acc;
//     }

//     try {
//       const messageData = JSON.parse(item.message);
//       if (typeof messageData === "object" && !Array.isArray(messageData)) {
//         return { ...acc, ...messageData };
//       }
//     } catch {

//       const normalizedKey = item.key.replace(/\d+$/, "");
//       acc[normalizedKey] = item.message;
//     }

//     return acc;
//   }

//   const chatData = history.filter(filterHistory).reduce(reduceHistory, {});

//   const payload = {
//     ...getUTMData(),
//     ...chatData,
//   };

//   return payload;
// }

// function sendChatHistory() {
//   const payload = getPayload(chatHistory);
//   const formData = createFormData(payload);

//   function createFormData(data) {
//     var formData = new FormData()
  
//     Object.entries(data).forEach(([key, value]) => {
//       if (value) {
//         formData.append(key, value)
//       }
//     })

//     return formData
//   }

//   $.ajax({
//     url: 'php/formProcessor.php',
//     type: 'POST',
//     data: formData,
//     processData: false,
//     contentType: false,
//     dataType: 'json',
//   });
// }

// function setCurrentYear() {
//   $('[data-current-year]').text(new Date().getFullYear())
// }

// function initAnchorBtn() {
//   $('[data-scroll-top]').on('click', function () {
//     $('.modal-scrollable').animate(
//       {
//         scrollTop: 0,
//       },
//       1000,
//     )
//   })
// }

// document.addEventListener("DOMContentLoaded", () => {
//   preloadInitialVideo('videos/start.mp4');
//   setInitialFeedbackStore();
//   processChatState("start");

//   setCurrentYear()
//   initAnchorBtn()
// });
