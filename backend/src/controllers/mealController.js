// src/controllers/mealController.js
const { MealMenu, MealReservation, Cafeteria, User } = require('../models');
const MealService = require('../services/mealService');
const { Op } = require('sequelize');

const getMenus = async (req, res) => {
  try {
    const { date, mealType, cafeteriaId } = req.query;
    const where = { isPublished: true };
    
    if (date) where.date = date;
    if (mealType) where.mealType = mealType;
    if (cafeteriaId) where.cafeteriaId = cafeteriaId;

    const menus = await MealMenu.findAll({
      where,
      include: [{ model: Cafeteria }],
      order: [['date', 'ASC'], ['mealType', 'ASC']]
    });

    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await MealMenu.findByPk(id, {
      include: [{ model: Cafeteria }]
    });

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menü bulunamadı' });
    }

    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createMenu = async (req, res) => {
  try {
    const { cafeteriaId, date, mealType, items, nutrition, price } = req.body;
    
    const menu = await MealMenu.create({
      cafeteriaId,
      date,
      mealType,
      items,
      nutrition,
      price: price || 25.00,
      isPublished: false
    });

    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const menu = await MealMenu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menü bulunamadı' });
    }

    await menu.update(updates);
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await MealMenu.findByPk(id);
    
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menü bulunamadı' });
    }

    await menu.destroy();
    res.json({ success: true, message: 'Menü silindi' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuId, date, mealType } = req.body;

    const result = await MealService.createReservation({
      userId,
      menuId,
      date,
      mealType
    });

    res.status(201).json({
      success: true,
      data: result.reservation,
      qrCode: result.qrCodeImage
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reservation = await MealService.cancelReservation(id, userId);

    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await MealReservation.findAll({
      where: { userId },
      include: [
        { model: MealMenu, include: [Cafeteria] }
      ],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const useMeal = async (req, res) => {
  try {
    const { qrCode } = req.body;

    const reservation = await MealService.useMeal(qrCode);

    res.json({
      success: true,
      message: 'Yemek başarıyla kullanıldı',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  createReservation,
  cancelReservation,
  getMyReservations,
  useMeal
};