import express from 'express';
import path from 'path';
import config from 'config';
import bodyParser from 'body-parser';
import productsRouter from './routes/products.routes';
import authRouter from './routes/auth.routes';
import basketRouter from './routes/basket.routes';
import usersRouter from './routes/users.routes';
import categoriesRouter from './routes/categories.routes';
import filesRouter from './routes/files.routes';
import orderRouter from './routes/orders.routes';

const __dirname = '.' 
const PORT = (process.env.PORT || config.get<number>('port') || 5000) as number;
const IP = (process.env.IP || config.get<number>('ip') || '127.0.0.1') as string;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/files', filesRouter)
app.use('/api/products', productsRouter)
app.use('/api/basket', basketRouter);
app.use('/api/orders', orderRouter);
app.use('/api/categories', categoriesRouter);


if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(
      __dirname, 'client', 'index.html'));
  });
}

app.listen(PORT, IP,  () => console.log(`App has been started on port: ${PORT}, IP: ${IP}`));