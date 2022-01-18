import cors from 'cors';
import path from 'path';
import express from 'express';
import consola from 'consola';
import mongoose from 'mongoose';
import passport from 'passport';
import { json } from 'body-parser';
import { DB_CONN, PORT } from './configs';
import { WebRouter } from './routes';

// Load global variables
require('./global');

// Import passport middleware
require('./middlewares/passport-middleware.js');

// Initialize express app
const app = express();

// Apply application middlewares
app.use(cors());
app.use(json());
app.use(passport.initialize());

// Inject routers
app.use('/', WebRouter);

// Static files
app.use(express.static('public'));
app.use(express.static('uploads'));

// 404 handler
app.use(function(req, res, next) {
   res.status = 404;
   if(req.accepts('html')) {
      res.sendFile(path.join(ViewDir, '/errors/404.html'));
   } else {
      res.json({
         message: 'Endpoint not exists!'
      })
   }
   return;
});

const start = async () => {
   try {
      // DB connection
      await mongoose.connect(DB_CONN, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      consola.success('Database connected...');
      // Listen server
      app.listen(PORT, () => consola.success('Server running on port: '+PORT));
   } catch (err) { 
      consola.error('Server Error: ' + err.message);
   };
};

// Start the application
start();