import { Router } from 'express';
import { getAllPets, getPetById, createPet, updatePet, deletePet, searchPets } from './services.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const result = await getAllPets(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { q: searchTerm } = req.query;
    const pets = await searchPets(
      searchTerm as string | undefined,
    );
    res.json(pets);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const pet = await getPetById(Number(req.params.id));
    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    res.json(pet);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const pet = await createPet(req.body);
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const pet = await updatePet(Number(req.params.id), req.body);
    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    res.json(pet);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deletePet(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
