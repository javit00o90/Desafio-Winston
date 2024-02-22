import { Server } from 'socket.io';
import messageModel from '../dao/models/messages.model.js';
import ProductService from '../services/productsServices.js';

export const initializeSocket = (server, app) => {
    const io = new Server(server);
    app.set('io', io);

    io.on('connection', async (socket) => {
        socket.on('setUserName', (userInfo) => {
            socket.userName = userInfo.userName;
            socket.userEmail = userInfo.userEmail;
            io.emit('userConnected', socket.userName);
            console.log(`${socket.userName} has connected`);
        });

        try {
            const productService = new ProductService();
            const products = await productService.getProducts();
        
            socket.emit('productos', products.payload);

            const chatHistory = await messageModel.find().sort({ timestamp: 1 });
            socket.emit('chatHistory', chatHistory);
        } catch (error) {
            console.error('Error fetching products or chat history:', error.message);
        }

        socket.on('sendMessage', async (message) => {
            const newMessage = new messageModel({
                user: socket.userEmail,
                message,
            });

            try {
                await newMessage.save();
                io.emit('chatMessage', { userName: socket.userName, message });
            } catch (error) {
                console.error('Error saving the message:', error.message);
            }
        });

        socket.on('disconnect', () => {
            if (socket.userName) {
                io.emit('userDisconnected', socket.userName);
                console.log(`${socket.userName} has disconnected`);
            }
        });
    });
};