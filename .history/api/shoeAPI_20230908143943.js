export default function shoeAPI(shoeService) {
  
    async function getAll(req, res) {
      try {
        const allShoes = await shoeService.getAllShoes();
        res.json({
          status: 'success',
          data: allShoes
        });
      } catch (err) {
        res.status(500).json({
          status: 'error',
          message: 'Could not retrieve shoes.'
        });
      }
    }
  
    async function add(req, res) {
      try {
        const newShoe = req.body;
        await shoeService.addShoe(newShoe);
        res.json({
          status: 'success',
          message: 'Shoe added successfully.'
        });
      } catch (err) {
        res.status(500).json({
          status: 'error',
          message: 'Could not add the shoe.'
        });
      }
    }
  
    return {
      getAll,
      add
    };
  }
  