import express from 'express';
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import passport from 'passport';
import { initializePassport } from './config/config.passport.js';
import { engine } from 'express-handlebars';
import { registerHandlebarsHelpers } from './utils/handlebarsHelpers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeSocket } from './utils/socketioServer.js';
import { config } from './config/config.dotenv.js';
import { errorHandler } from './middleware/errorHandler.js';
import { loggerMiddleware } from './middleware/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));

initializePassport()
app.use(passport.initialize())
app.use(loggerMiddleware)

const port = config.PORT;
import productsRouter from './routes/products-router.js';
import cartRouter from './routes/carts-router.js';
import homeRouter from './routes/home-router.js';
import chatRouter from './routes/chat-router.js';
import realTimeProductRouter from './routes/realTimeProduct-router.js';
import productsviewRouter from './routes/products-view-router.js';
import specificCart from './routes/specificCart-router.js';
import sessionRouter from './routes/session-router.js';
import productsMocks from './routes/productsMocks-router.js';
import loggerTest from './routes/loggerTest-router.js';


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
registerHandlebarsHelpers();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', homeRouter);
app.use('/chat', chatRouter);
app.use('/realtimeproducts', realTimeProductRouter);
app.use('/products', productsviewRouter);
app.use('/carts', specificCart);
app.use('/mockingproducts', productsMocks);
app.use('/loggertest', loggerTest);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({ message: 'Page not found' });
});

const server = app.listen(port, () => {
    console.log(`Servidor encendido y escuchando el puerto ${port}`);
});

// Conexión MongoDB
try {
    await mongoose.connect(config.MONGO_URL, { dbName: config.DBNAME })
    console.log('DataBase Online!')
} catch (error) {
    console.log(error.message)
}
// Inicio Socket.io
initializeSocket(server, app);