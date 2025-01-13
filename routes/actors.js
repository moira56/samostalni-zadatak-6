import express from 'express';
import { pronadiGlumcaPoId } from '../middleware/actors.js';
import { query, param, body, validationResult } from 'express-validator';

const routerGlumci = express.Router();

export let listaGlumaca = [
    {
        id: 123,
        ime: "Morgan Freeman",
        godinaRodjenja: 1937,
        filmovi: [4222334],
    },
    {
        id: 234,
        ime: "Marlon Brando",
        godinaRodjenja: 1924,
        filmovi: [5211223],
    },
    {
        id: 345,
        ime: "Al Pacino",
        godinaRodjenja: 1940,
        filmovi: [5211223],
    },
];

routerGlumci.get(
    '/',
    query('ime')
        .optional()
        .trim()
        .escape()
        .matches(/^[A-Za-z\s]+$/).withMessage('Ime smije sadržavati samo slova i razmake'),
    (req, res) => {
        const greske = validationResult(req);
        if (!greske.isEmpty()) {
            return res.status(400).json({ greske: greske.array() });
        }

        const { ime } = req.query;
        let filtriraniGlumci = listaGlumaca;

        if (ime) {
            filtriraniGlumci = listaGlumaca.filter(glumac =>
                glumac.ime.toLowerCase().includes(ime.toLowerCase())
            );
        }

        if (filtriraniGlumci.length > 0) {
            return res.status(200).json(filtriraniGlumci);
        }

        return res.status(404).json({ poruka: 'Nema dostupnih glumaca' });
    }
);


routerGlumci.get(
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
    pronadiGlumcaPoId,
    (req, res) => {
        return res.status(200).json(req.glumac);
    }
);


routerGlumci.post(
    '/',
    [
        body('ime')
            .notEmpty().withMessage('Ime je obavezno')
            .trim()
            .escape()
            .matches(/^[\p{L}\s]+$/u).withMessage('Ime smije sadržavati samo slova i razmake'),
        body('godinaRodjenja')
            .notEmpty().withMessage('Godina rođenja je obavezna')
            .trim()
            .escape()
            .isInt(),
    ],
    (req, res) => {
        const greske = validationResult(req);
        if (!greske.isEmpty()) {
            return res.status(400).json({ greske: greske.array() });
        }

        const { ime, godinaRodjenja, filmovi } = req.body;
        const noviGlumac = {
            id: Date.now(),
            ime,
            godinaRodjenja,
            filmovi,
        };

        listaGlumaca.push(noviGlumac);
        res.status(201).json({ poruka: "Glumac uspješno dodan u listu", glumac: noviGlumac });
    }
);

routerGlumci.patch(
    '/:id',
    [
        body('ime')
            .optional()
            .notEmpty().withMessage('Ime ne smije biti prazno')
            .trim()
            .escape()
            .matches(/^[\p{L}\s]+$/u).withMessage('Ime smije sadržavati samo slova i razmake'),
        body('godinaRodjenja')
            .optional()
            .notEmpty().withMessage('Godina rođenja ne smije biti prazna')
            .trim()
            .escape()
            .isInt(),
    ],
    (req, res) => {
        const greske = validationResult(req);
        if (!greske.isEmpty()) {
            return res.status(400).json({ greske: greske.array() });
        }

        const idGlumca = parseInt(req.params.id);
        const glumac = listaGlumaca.find(glumac => glumac.id === idGlumca);

        if (!glumac) {
            return res.status(404).json({ poruka: 'Traženi glumac nije pronađen' });
        }

        const { ime, godinaRodjenja, filmovi } = req.body;
        if (ime) glumac.ime = ime;
        if (godinaRodjenja) glumac.godinaRodjenja = godinaRodjenja;
        if (filmovi) glumac.filmovi = filmovi;

        console.log(listaGlumaca);
        return res.status(200).json({ poruka: 'Podaci o glumcu su uspješno ažurirani', glumac });
    }
);

export default routerGlumci;