CREATE DEFINER=`root`@`localhost` PROCEDURE `remove_from_cart`(IN cartId INT, IN productId INT)
BEGIN
	DELETE FROM shopping_cart.cartitems WHERE cartitems.cartID = cartId AND cartitems.productId = productId;
END