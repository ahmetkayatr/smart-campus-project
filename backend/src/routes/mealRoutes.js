const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { authenticate } = require('../middleware/auth');

// Menus
router.get('/menus', authenticate, mealController.getMenus);
router.get('/menus/:id', authenticate, mealController.getMenu);
router.post('/menus', authenticate, mealController.createMenu);
router.put('/menus/:id', authenticate, mealController.updateMenu);
router.delete('/menus/:id', authenticate, mealController.deleteMenu);

// Reservations
router.post('/reservations', authenticate, mealController.createReservation);
router.delete('/reservations/:id', authenticate, mealController.cancelReservation);
router.get('/reservations/my', authenticate, mealController.getMyReservations);
router.post('/reservations/use', authenticate, mealController.useMeal);

module.exports = router;