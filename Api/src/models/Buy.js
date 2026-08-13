const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Buys", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    products: {
      // JSON-serialized snapshot of the purchase: { items, payer,
      // transaction, status, statusDetail }. Stored as TEXT (not
      // ARRAY) because it's always a single object, not a list of
      // rows — the frontend reads it back as buy.products.items /
      // buy.products.statusDetail.
      type: DataTypes.TEXT,
      allowNull: false
    },
    mp_payment_id: {
      // Mercado Pago payment id, used by the webhook to avoid
      // registering the same purchase twice.
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};