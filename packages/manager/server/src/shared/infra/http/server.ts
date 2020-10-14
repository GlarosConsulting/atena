import 'reflect-metadata';
import 'dotenv/config';

import { errors } from 'celebrate';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { container } from 'tsyringe';

import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import WebSocket from '../websocket/server';
// import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

const PORT = process.env.PORT || 3333;

const app = express();
const server = http.createServer(app);

const websocket = container.resolve(WebSocket);

websocket.start(server);

app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/files', express.static(uploadConfig.uploadsFolder));
// app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log('🚀 Server started at port 3333!');
});
