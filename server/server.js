const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const users = {}; // Хранение пользователей с их псевдонимами
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = 3000;

app.use(express.static('dest'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'https://chat.xn----7sbavhf8anicjyoi8ce.xn--p1ai/mivino/index.html');
});

io.on('connection', (socket) => {
  console.log('Клиент подключился:', socket.id);

  // Присоединение к комнате
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Клиент ${socket.id} присоединился к комнате ${roomId}`);
  });

    // Установка псевдонима
  socket.on('set-nickname', (nickname) => {
    users[socket.id] = nickname;
    console.log(`Установлен псевдоним: ${nickname} для ${socket.id}`);
  });

  // Обработка текстовых сообщений
  socket.on('chat-message', ({ roomId, message }) => {
    const senderNickname = users[socket.id] || 'Участник'; // Псевдоним или "Участник"
    console.log(`Получено сообщение от ${senderNickname}: ${message}`);
    socket.to(roomId).emit('chat-message', { sender: senderNickname, message });
  });

  // Обработка предложения (offer) вызова
  socket.on('offer', ({ roomId, offer }) => {
    console.log(`Получен offer от клиента ${socket.id} для комнаты ${roomId}`);
    socket.to(roomId).emit('offer', { offer });
  });

  // Обработка ответа (answer) вызова
  socket.on('answer', ({ roomId, answer }) => {
    console.log(`Получен answer от клиента ${socket.id} для комнаты ${roomId}`);
    socket.to(roomId).emit('answer', { answer });
  });

  // Обработка ICE-кандидатов
  socket.on('ice-candidate', ({ roomId, candidate }) => {
    console.log(`Получен ICE-кандидат от клиента ${socket.id} для комнаты ${roomId}`);
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  // Обработка завершения вызова
  socket.on('end-call', (roomId) => {
    console.log(`Завершение вызова для комнаты ${roomId} от клиента ${socket.id}`);
    socket.to(roomId).emit('end-call');
  });

  socket.on('connect', () => {
    console.log('WebSocket подключен:', socket.id);
  });

  // Обработка отключения клиента
  socket.on('disconnect', () => {
    console.log(`Клиент отключился: ${socket.id}`);
    console.log('WebSocket отключен');
  });
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
