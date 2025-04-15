const CartModel = require('../models/cart');

const addCart = async (req, res) => {
  const userId = req.user.id;
  const { cart } = req.body;

  try {
    await CartModel.updateOne({ userId }, { cart }, { upsert: true });
    res.status(200).json({ message: 'Cart saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save cart', error });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartDoc = await CartModel.findOne({ userId });
    if (cartDoc) {
      res.status(200).json(cartDoc);
    } else {
      res.status(200).json({ cart: [] }); // Trả mảng trống nếu chưa có
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error });
  }
};

module.exports = {
  addCart,
  getCart,
};
