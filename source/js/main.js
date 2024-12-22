const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');
const messagesContainer = document.getElementById('messagesFrame');
let localStream = null;
let peerConnection = null;
let roomId = prompt("Введите ID комнаты:", "default-room");

const socket = io('http://localhost:3000');
const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:your.turn.server:3478',
      username: 'user',
      credential: 'password',
    },
  ],
};

// Отправка сообщения
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  console.log('Отправка сообщения:', message);

  // Отправляем сообщение с ID отправителя
  socket.emit('chat-message', { roomId, message });

  // Добавляем сообщение в чат как от "Вы"
  addMessageToChat('Вы', message);

  messageInput.value = '';
}

// Добавление сообщения в чат
function addMessageToChat(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'call-message'; // Можно добавить класс для стилизации

  const senderElement = document.createElement('span');
  senderElement.className = 'sender'; // Класс для стилизации имени отправителя
  senderElement.textContent = `${sender}: `;

  const messageTextElement = document.createElement('span');
  messageTextElement.className = 'message-text'; // Класс для стилизации текста сообщения
  messageTextElement.textContent = message;

  messageElement.appendChild(senderElement);
  messageElement.appendChild(messageTextElement);
  messagesContainer.appendChild(messageElement);

  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Автопрокрутка
}

// Функции видеозвонка
async function startLocalVideo() {
  try {
    console.log("Инициализация нового локального видео...");
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideo.srcObject = localStream;
    console.log("Локальное видео успешно запущено.");
  } catch (error) {
    console.error("Ошибка доступа к камере/микрофону:", error);
  }
}


async function startCall() {
  // Убедитесь, что старое соединение завершено
  if (peerConnection) {
    console.log("Обнаружено активное соединение. Завершаем перед началом нового вызова.");
    endCall(); // Завершить старое соединение перед созданием нового
  }

  peerConnection = new RTCPeerConnection(config);
  localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = (event) => {
    console.log("Получен удалённый поток.");
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Отправка ICE-кандидата.");
      socket.emit('ice-candidate', { roomId, candidate: event.candidate });
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { roomId, offer });
}


async function endCall() {
  console.log("Инициируем завершение вызова...");

  // Закрытие WebRTC соединения
  if (peerConnection) {
    console.log("Закрываем WebRTC соединение.");
    peerConnection.ontrack = null;
    peerConnection.onicecandidate = null;
    peerConnection.close();
    peerConnection = null;
  }

  // Остановка медиа-треков
  if (localStream) {
    console.log("Останавливаем локальные медиа-треки.");
    localStream.getTracks().forEach((track) => {
      console.log(`Останавливаем трек: ${track.kind}`);
      track.stop();
    });
    localStream = null;
  }

  // Очистка видеоэлементов
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;

  console.log("Перезапуск локального видео...");
  await startLocalVideo(); // Убедитесь, что это вызывается только после полной очистки
}

// Обработка входящих сообщений
socket.on('chat-message', ({ sender, message }) => {
  const displaySender = sender === socket.id ? 'Вы' : 'Участник';
  addMessageToChat(displaySender, message);
});

// Обработка событий WebSocket
socket.on('offer', async ({ offer }) => {
  if (peerConnection) {
    console.warn("Уже активное соединение, пропускаем входящий вызов");
    return;
  }

  const acceptCall = confirm('Входящий вызов. Принять?');
  if (!acceptCall) return;

  peerConnection = new RTCPeerConnection(config);

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', { roomId, candidate: event.candidate });
    }
  };

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', { roomId, answer });
});

socket.on('answer', async ({ answer }) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', async ({ candidate }) => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on('connect_error', (error) => {
  console.error('Ошибка подключения WebSocket:', error);
});

socket.on('end-call', () => {
  console.log("Получено событие завершения вызова от другого клиента.");
  
  // Проверка состояния peerConnection
  if (peerConnection) {
    console.log("Закрываем WebRTC соединение.");
    peerConnection.close();
    peerConnection = null;
  } else {
    console.log("Соединение WebRTC уже закрыто.");
  }

  // Проверка состояния медиа-потоков
  if (localStream) {
    console.log("Останавливаем локальные медиа-потоки.");
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  } else {
    console.log("Локальный поток уже остановлен.");
  }

  // Очистка видео
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;

  // Перезапуск локального видео
  console.log("Перезапуск локального видео...");
  startLocalVideo();
});

startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', () => {
  console.log("Инициируем завершение вызова...");
  socket.emit('end-call', roomId); // Уведомляем сервер
  endCall(); // Завершаем локальное соединение
});

// Привязка событий к кнопке отправки и вводу сообщения
sendMessageButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

socket.emit('join-room', roomId);
startLocalVideo();
