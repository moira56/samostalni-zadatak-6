import express from 'express';
import moviesRouter from './routes/movies.js';
import actorsRouter from './routes/actors.js';

const server = express();
const PORT = 3000;

server.use(express.json());

server.use((req, res, next) => {
  const trenutniTimestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
  const metodaZahtjeva = req.method;
  const putanjaZahtjeva = req.originalUrl;

  console.log(`[movie-server] [${trenutniTimestamp}] ${metodaZahtjeva} ${putanjaZahtjeva}`);
  next();
});

server.get('/', (req, res) => {
  res.send('Welcome to the movie-server!');
});

server.use('/movies', moviesRouter);
server.use('/actors', actorsRouter);

server.listen(PORT, (error) => {
  if (error) {
    console.error(`Error starting the server: ${error.message}`);
  } else {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});
