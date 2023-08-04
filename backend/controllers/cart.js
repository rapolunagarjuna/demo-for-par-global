const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

const getCartByUser = async (req, res) => {
    try {
      if (req.user === null || req.user === undefined) {
        return res.status(404).json({ message: "Needed to be logged in"});
      }

      let cart = await Cart.findOne({ userId: req.user._id });
      if (cart == null) {
        // Create a new cart if it doesn't exist
        cart = new Cart({ userId: req.user._id , description: 'new cart created for user'});
        await cart.save();
      }
  
      // Populate the cart with CartItems
      const cartItems = await CartItem.find({ cartId: cart._id }).populate('productId', 'cartId');
      const filteredCartItems = cartItems.map((item) => {
        const product = item.productId;
        const imagePath = path.join(__dirname, "..", product.image);
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

        const productData = {
          productCode: product.productCode,
          name: product.name,
          description: product.description,
          category: product.category.name,
          // Add any other fields you want to include here
          imgSrc: imageBase64,
        };

        return {
          ...item, productId: productData
        }
      });

      return res.json({cart: filteredCartItems });
    } catch (err) {
        console.log({ message: err.message });
        return res.status(500).json({ message: 'Internal error, please try again' });
    }
};


const helperFunctionForGetCart = async (user) => {
  try {
    let cart = await Cart.findOne({ userId: user._id });
    
    if (cart == null) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId: user._id, description: 'New cart made',});
      await cart.save();
    }
    // Populate the cart with CartItems
    const cartItems = await CartItem.find({ cartId: cart._id });
    
    return {description:cart.description, items: cartItems };
  } catch (err) {
      console.log({ message: err.message });
      return null;
  }
}

const updateCartItem = async (req, res) => {
    try {
      if (req.body.quantity == null || req.body.price == null) {
        return res.status(422).json({ message: 'Quantity and price are required' });
      }
  
      if (typeof req.body.quantity !== 'number' || req.body.quantity <= 0 ||
          typeof req.body.price !== 'number' || req.body.price <= 0) {
        return res.status(422).json({ message: 'Quantity and price must be positive numbers' });
      }
  
      let cart = await Cart.findOne({ userId: req.body.user._id });
      if (cart == null) {
        return res.status(404).json({ message: 'No cart found for this user' });
      }
  
      let cartItem = await CartItem.findOne({ cartId: cart._id, productId: req.body.productId });
  
      if (cartItem == null) {
        // Create a new cart item if it doesn't exist
        cartItem = new CartItem({ 
          cartId: cart._id, 
          productId: req.body.productId, 
          quantity: req.body.quantity,
          price: req.body.price
        });
      } else {
        cartItem.quantity = req.body.quantity;
        cartItem.price = req.body.price;
      }
  
      const updatedCartItem = await cartItem.save();
      return res.json(updatedCartItem);
    } catch (err) {
        console.log({ message: err.message });
        return res.status(500).json({ message: 'Internal error, please try again' });
    }
};
  
module.exports = {
    getCartByUser,
    updateCartItem,
    helperFunctionForGetCart
};
