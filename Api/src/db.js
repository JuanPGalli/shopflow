require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DB_DEPLOY, DATABASE_URL } =
  process.env;

const isDeployed = DB_DEPLOY === 'true';

const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      logging: false,
      native: false,
      dialectOptions: isDeployed ? { ssl: { require: true, rejectUnauthorized: false } } : {},
    })
  : new Sequelize(
      `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      {
        logging: false,
        native: false,
        dialectOptions: isDeployed ? { ssl: { require: true, rejectUnauthorized: false } } : {},
      },
    );

// Explicit model registration. (The previous version loaded every file
// in /models dynamically via fs.readdirSync and then re-cased every
// key of sequelize.models to force a capital first letter, purely to
// paper over User.js internally calling itself "user". That's fragile
// — it silently changes behavior if a model file is added/removed —
// so instead each model factory is required directly and assigned to
// the exact name every controller already expects.)
const Product = require('./models/Product')(sequelize);
const CategoryProduct = require('./models/CategoryProduct')(sequelize);
const Review = require('./models/Review')(sequelize);
const ShoppingCar = require('./models/ShoppingCar')(sequelize);
const Buys = require('./models/Buy')(sequelize);
const User = require('./models/User')(sequelize);

// ---- Associations ----

// A CategoryProduct ("beauty", "furniture", ...) has many Products.
CategoryProduct.hasMany(Product);
Product.belongsTo(CategoryProduct);

// A User can leave many Reviews; a Product can have many Reviews.
User.hasMany(Review);
Review.belongsTo(User);

Product.hasMany(Review);
Review.belongsTo(Product);

// A User has many cart line items (one row per product in the cart).
User.hasMany(ShoppingCar);
ShoppingCar.belongsTo(User);
// NOTE: the previous version also had `User.belongsTo(ShoppingCar)`
// alongside `ShoppingCar.belongsTo(User)`. That's two belongsTo in
// opposite directions on the same pair, which gives User a single
// ShoppingCarId FK — meaningless once a user has more than one item
// in their cart (which shoppingCarController already assumes). It's
// been replaced with the correct one-to-many above.

// A User has many purchase records (Buys). Each Buys row is a full
// order snapshot (see models/Buy.js) rather than a join-table row.
// NOTE: the previous version instead declared
// `Product.belongsToMany(User, { through: 'Buys' })` /
// `User.belongsToMany(Product, { through: 'Buys' })`, treating Buys as
// a pure User<->Product junction table. None of the controllers
// (createBuys.js, buysController.js, webhook.js) ever used that
// association's generated helpers (addProduct/getProducts/etc.) —
// they all read/write Buys directly, storing an entire order (every
// item in the purchase, payer info, status) as one JSON string per
// row. Keeping the M:N declaration alongside that usage pattern is
// inconsistent and was never functioning as intended, so it's been
// replaced with the simple one-to-many relationship the code actually
// relies on.
User.hasMany(Buys);
Buys.belongsTo(User);

module.exports = {
  conn: sequelize,
  Product,
  CategoryProduct,
  Review,
  ShoppingCar,
  Buys,
  User,
};
