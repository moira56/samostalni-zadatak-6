import { listaGlumaca } from '../routes/actors.js';

const pronadiGlumcaPoId = (req, res, next) => {
    const glumacId = parseInt(req.params.id);
    const glumac = listaGlumaca.find(glumac => glumac.id === glumacId);

    if (!glumac) {
        return res.status(404).json({ message: 'Glumac nije pronađen' });
    }

    req.glumac = glumac;
    next();
};

export { pronadiGlumcaPoId };
