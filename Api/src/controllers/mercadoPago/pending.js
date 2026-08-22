// * La información que envía mercado pago, la envía por query
module.exports = (req, res) => {
  console.log(req.query);
  // res.send('Pago realizado')
  res.redirect('https://shopflow-beta-ten.vercel.app/shoppingCart');
};

//'https://help-community-theta.vercel.app' --> deploy grupal
