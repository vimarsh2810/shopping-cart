const { Coupon } = require("../models/coupon")

const verifyCouponCode = async (couponCode, userId) => {
  try {
    const coupon = await Coupon.findOne({ where: { userId: userId } });
    if(coupon.code !== couponCode || coupon.isUsed) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyCouponCode };