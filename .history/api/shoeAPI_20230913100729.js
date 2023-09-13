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
    

    return {
        getAll,
        add
    }
}
