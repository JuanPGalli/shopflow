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
      emailUser      
    } = req.body;
  
    try {
      //const userId = await getUserByEmail(emailUser)
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
      const updated = await updatereviews(id, rating, comment);
  
      res.status(200).json(updated);
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: error.message });
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