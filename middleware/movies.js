import { filmovi } from '../routes/movies.js';

const pronadiFilmPoId = (req, res, next) => {
    const filmId = parseInt(req.params.id);
    const film = filmovi.find(film => film.id === filmId);

    if (!film) {
        return res.status(404).json({ message: 'Film nije pronađen' });
    }

    req.film = film;
    next();
};

export { pronadiFilmPoId };
