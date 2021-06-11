CREATE DEFINER=`root`@`localhost` PROCEDURE `cart_functionalities`(IN cartId INT, IN productId INT, IN quantity INT)
BEGIN
	SET @requiredCartItem = null;
    SELECT cartItems.quantity INTO @requiredCartItem FROM shopping_cart.cartItems WHERE cartItems.cartId = cartId AND cartItems.productId = productId;
	if(@requiredCartItem > 0) THEN
		if(quantity = 0) THEN
			DELETE from shopping_cart.cartItems WHERE cartitems.cartID = cartId AND cartitems.productId = productId;
		else
			UPDATE shopping_cart.cartItems SET cartItems.quantity = quantity, updatedAt = now() WHERE cartItems.cartId = cartId AND cartItems.productId = productId;
		end if;
    else
		INSERT INTO shopping_cart.cartItems(quantity, createdAt, updatedAt, cartId, productId) VALUES(quantity, now(), now(), cartId, productId);
	end if;
END