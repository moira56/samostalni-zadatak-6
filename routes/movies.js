import express from 'express';
import { pronadiFilmPoId } from '../middleware/movies.js';
import { query, param, body, validationResult } from 'express-validator';

const routerFilmovi = express.Router();

export let filmovi = [
  {
    id: 4222334,
    naziv: "The Shawshank Redemption",
    godina: 1994,
    zanr: "Drama",
    redatelj: "Frank Darabont",
  },
  {
    id: 5211223,
    naziv: "The Godfather",
    godina: 1972,
    zanr: "Crime",
    redatelj: "Francis Ford Coppola",
  },
  {
    id: 4123123,
    naziv: "The Dark Knight",
    godina: 2008,
    zanr: "Action",
    redatelj: "Christopher Nolan",
  },
];

routerFilmovi.get(
  '/',
  [
    query('min_godina')
      .optional()
      .trim()
      .isInt().withMessage('Min_godina mora biti cijeli broj'),
    query('max_godina')
      .optional()
      .trim()
      .isInt().withMessage('Max_godina mora biti cijeli broj'),
    query('min_godina').custom((value, { req }) => {
      if (value && req.query.max_godina && parseInt(value) >= parseInt(req.query.max_godina)) {
        throw new Error('Min_godina mora biti manja od max_godina');
      }
      return true;
    }),
  ],
  (req, res) => {
    const greske = validationResult(req);
    if (!greske.isEmpty()) {
      return res.status(400).json({ greske: greske.array() });
    }

    const { min_godina, max_godina } = req.query;
    let filtriraniFilmovi = filmovi;

    if (min_godina) {
      filtriraniFilmovi = filtriraniFilmovi.filter(film => film.godina >= parseInt(min_godina));
    }
    if (max_godina) {
      filtriraniFilmovi = filtriraniFilmovi.filter(film => film.godina <= parseInt(max_godina));
    }

    if (filtriraniFilmovi.length === 0) {
      return res.status(404).json({ poruka: 'Nema filmova u traženom rasponu godina' });
    }

    return res.status(200).json(filtriraniFilmovi);
  }
);

routerFilmovi.get(
  '/:id',
  [
    param('id').isInt().withMessage('ID mora biti cijeli broj'),
  ],
  (req, res, next) => {
    const greske = validationResult(req);
    if (!greske.isEmpty()) {
      return res.status(400).json({ greske: greske.array() });
    }
    next();
  },
  pronadiFilmPoId,
  (req, res) => {
    return res.status(200).json(req.film);
  }
);

routerFilmovi.post(
  '/',
  [
    body('naziv')
      .notEmpty().withMessage('Naziv je obavezan')
      .trim()
      .escape()
      .matches(/^[\p{L}\s]+$/u),
    body('godina')
      .notEmpty().withMessage('Godina je obavezna')
      .trim()
      .escape()
      .isInt(),
    body('zanr')
      .notEmpty().withMessage('Žanr je obavezan')
      .trim()
      .escape()
      .matches(/^[\p{L}\s/]+$/u),
    body('redatelj')
      .notEmpty().withMessage('Redatelj je obavezan')
      .trim()
      .escape()
      .matches(/^[\p{L}\s]+$/u),
  ],
  (req, res) => {
    const greske = validationResult(req);
    if (!greske.isEmpty()) {
      return res.status(400).json({ greske: greske.array() });
    }

    const { naziv, godina, zanr, redatelj } = req.body;

    const noviFilm = {
      id: Date.now(),
      naziv,
      godina,
      zanr,
      redatelj,
    };

    filmovi.push(noviFilm);
    res.status(201).json({ poruka: "Film uspješno dodan", film: noviFilm });
  }
);

routerFilmovi.patch(
  '/:id',
  [
    body('naziv')
      .optional()
      .notEmpty().withMessage('Naziv ne smije biti prazan')
      .trim()
      .escape()
      .matches(/^[\p{L}\s/]+$/u),
    body('godina')
      .optional()
      .notEmpty().withMessage('Godina ne smije biti prazna')
      .trim()
      .escape()
      .isInt(),
    body('zanr')
      .optional()
      .notEmpty().withMessage('Žanr ne smije biti prazan')
      .trim()
      .escape()
      .matches(/^[\p{L}\s/]+$/u),
    body('redatelj')
      .optional()
      .notEmpty().withMessage('Redatelj ne smije biti prazan')
      .trim()
      .escape()
      .matches(/^[\p{L}\s]+$/u),
  ],
  (req, res) => {
    const greske = validationResult(req);
    if (!greske.isEmpty()) {
      return res.status(400).json({ greske: greske.array() });
    }

    const idParam = parseInt(req.params.id);
    const film = filmovi.find(film => film.id === idParam);

    if (!film) {
      return res.status(404).json({ poruka: 'Film nije pronađen' });
    }

    const { naziv, godina, zanr, redatelj } = req.body;
    if (naziv) film.naziv = naziv;
    if (godina) film.godina = godina;
    if (zanr) film.zanr = zanr;
    if (redatelj) film.redatelj = redatelj;

    console.log(filmovi);
    return res.status(200).json({ poruka: 'Film uspješno ažuriran', film });
  }
);

export default routerFilmovi;
