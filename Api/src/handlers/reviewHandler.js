const { getAllreviews, postreviews, updatereviews,  getUserreviews } = require("../controllers/reviewController");
//const getUserByEmail = require("../controllers/getUserByEmail");
  
  const getreviewHandler = async (req, res) => {
   
    try {
      const result = await getAllreviews();
  
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const postreviewHandler = async (req, res) => {
    const {
      ProductId,
      comment,
      rating,
    } = req.body;
    // Identity comes from the verified Firebase token (see
    // middleware/verifyToken.js), never from the request body —
    // otherwise anyone could submit a review as any email.
    const emailUser = req.user.email;

    try {
      await postreviews(ProductId, comment, rating, emailUser);

      res.status(200).json(`The Review was successfully created`);
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: error.message });
    }
  };

  const putreviewHandler = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    try {
      const updated = await updatereviews(id, rating, comment, req.user.email);

      res.status(200).json(updated);
    } catch (error) {
      console.log(error)
      const status = error.message === 'Forbidden' ? 403 : 400;
      res.status(status).json({ error: error.message });
    }
  };  
 
  const userreviewHandler = async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await getUserreviews(userId);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  module.exports = { getreviewHandler, postreviewHandler, putreviewHandler, userreviewHandler };