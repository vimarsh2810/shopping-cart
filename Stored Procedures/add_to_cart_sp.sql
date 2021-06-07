CREATE DEFINER=`root`@`localhost` PROCEDURE `add_to_cart`(IN cartId INT, IN productId INT, IN quantity INT)
BEGIN
	SET @requiredCartItem = null;
    SELECT cartItems.quantity INTO @requiredCartItem FROM shopping_cart.cartItems WHERE cartItems.cartId = cartId AND cartItems.productId = productId;
	if(@requiredCartItem > 0) THEN
		UPDATE shopping_cart.cartItems SET cartItems.quantity = cartItems.quantity + quantity, updatedAt = now() WHERE cartItems.cartId = cartId AND cartItems.productId = productId;
	else
		INSERT INTO shopping_cart.cartItems(quantity, createdAt, updatedAt, cartId, productId) VALUES(quantity, now(), now(), cartId, productId);
	end if;
END