export default function shoeAPI(shoeService) {
  
    async function getAll(req, res) {
      try {
        const shoes = await shoeService.getAllShoes();
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function add(req, res) {
      try {
        await shoeService.addShoe(req.body);
        res.json({ message: "Shoe added successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    
    async function getByBrand(req, res) {
      try {
        const shoes = await shoeService.getShoesByBrand(req.params.brand);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function getBySize(req, res) {
      try {
        const shoes = await shoeService.getShoesBySize(req.params.size);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function getByColor(req, res) {
      try {
        const shoes = await shoeService.getShoesByColor(req.params.color);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function getByPrice(req, res) {
      try {
        const shoes = await shoeService.getShoesByPrice(req.params.price);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

    async function getFilters(req, res) {
        try {
          const filterData = await shoeService.getFilterData();
          res.status(200).json(filterData);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
  
    return {
      getAll,
      add,
      getByBrand,
      getBySize,
      getByColor,
      getByPrice,
      getFilters
    }
  }
  