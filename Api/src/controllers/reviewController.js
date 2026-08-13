const { Review, User, Buys } = require("../db");
const getUserByEmail = require("../controllers/getUserByEmail");

const getAllreviews = async function () {
    const rawArrayDB = await Review.findAll({
      include: [
        {
          model: User,
          attributes: [
            "name",
          ]
        }
      ],
    })
    return rawArrayDB;
  };

// A user must have actually purchased the product before they can
// review it. Buys.products is a JSON string snapshot of the purchase:
// { items: [...], statusDetail, ... } (see models/Buy.js).
const userPurchasedProduct = async (userId, productId) => {
  if (!userId) return false;
  const buys = await Buys.findAll({ where: { userId } });
  return buys.some((buy) => {
    try {
      const purchase = JSON.parse(buy.products);
      const items = purchase?.items || [];
      const wasDelivered =
        !purchase?.statusDetail || purchase.statusDetail === 'accredited';
      return wasDelivered && items.some((item) => item.id === productId);
    } catch {
      return false;
    }
  });
};

const postreviews = async (
      ProductId,
      comment,
      rating,
      emailUser,
) => {
  const userId = await getUserByEmail(emailUser);
  if (!userId) {
    throw new Error("User not found");
  }

  const alreadyReviewed = await Review.findOne({
    where: { ProductId, userId },
  });
  if (alreadyReviewed) {
    throw new Error("You have already reviewed this product");
  }

  const purchased = await userPurchasedProduct(userId, ProductId);
  if (!purchased) {
    throw new Error("You can only review products you have purchased");
  }

  const newReview = await Review.create({
      ProductId,
      comment,
      rating,
      userId,
    });

  return newReview;
};

const updatereviews = async (id, rating, comment) => {
    const review = await Review.findByPk(id);

    if (!review) {
      throw new Error(`Review with ID: ${id} not found`);
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    return review;
  };

const getUserreviews = async (userId) => {
  return Review.findAll({ where: { userId } });
};

module.exports = {
  getAllreviews,
  postreviews,
  updatereviews,
  getUserreviews,
};
