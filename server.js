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

const PORT = process.env.PORT || 3000; // Используем переменную окружения PORT

// Статические файлы
app.use(express.static('dest'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dest/index.html');
});

// WebSocket соединение
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
    const senderNickname = users[socket.id] || 'Участник';
    console.log(`Сообщение от ${senderNickname}: ${message}`);
    socket.to(roomId).emit('chat-message', { sender: senderNickname, message });
  });

  // Обработка WebRTC событий
  ['offer', 'answer', 'ice-candidate', 'end-call'].forEach((event) => {
    socket.on(event, (data) => {
      const { roomId, ...payload } = data;
      console.log(`Событие ${event} от клиента ${socket.id} для комнаты ${roomId}`);
      socket.to(roomId).emit(event, payload);
    });
  });

  // Отключение клиента
  socket.on('disconnect', () => {
    console.log(`Клиент отключился: ${socket.id}`);
    delete users[socket.id];
  });
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
