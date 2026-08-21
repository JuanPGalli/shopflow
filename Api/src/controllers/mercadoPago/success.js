// * La información que envía mercado pago, la envía por query
require('dotenv').config();

module.exports = (req, res) => {
  console.log(req.query);

  const target =
    process.env.BACK_URL_SUCCESS || 'https://help-community-ecommerce.vercel.app/shoppingCart';
  res.redirect(`${target}${target.includes('?') ? '&' : '?'}paid=true`);
}; //agrego un flag que indique que el producto fue pagado con éxito. Para tomarlo y vaciar el carrito.

//'https://help-community-theta.vercel.app' --> deploy grupal
