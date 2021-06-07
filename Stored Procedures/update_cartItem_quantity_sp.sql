CREATE DEFINER=`root`@`localhost` PROCEDURE `update_cartItem_quantity`(IN cartId INT, IN productId INT, IN quantity INT)
BEGIN
	UPDATE shopping_cart.cartItems SET cartItems.quantity = quantity, updatedAt = now() WHERE cartItems.cartId = cartId AND cartItems.productId = productId; 
END