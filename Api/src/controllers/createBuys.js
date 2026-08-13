const { Buys } = require('../db');

const createBuys = async (allData) => {
  /*  console.log(allData);
        //allData = [[...allData], [userUuId]]
        try {
            const products= allData[0]
        let userId= allData[1]
        userId = userId[0]

        const createBuy = await Buys.create({
            userId,
            products,
        })
        return createBuy
        } catch (error) {
        console.log(error.message)
        } */
  try {
    const [purchaseData] = allData[0];
    const userId = allData[1][0];
    const mp_payment_id = allData[2]; // MercadoPago payment id

    const status = purchaseData?.status || null;
    // Store the whole purchase snapshot (items, payer, transaction,
    // status, statusDetail) as one JSON string.
    const products = JSON.stringify(purchaseData || {});

    // findOrCreate on mp_payment_id prevents the webhook from
    // registering the same MercadoPago notification twice.
    const [buy] = await Buys.findOrCreate({
      where: { mp_payment_id },
      defaults: { userId, products, status, mp_payment_id },
    });

    return buy;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = createBuys;