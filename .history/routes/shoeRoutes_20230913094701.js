
export default function shoeRoute(shoe_api) {
    
    async function get(req, res) {
        try {
            // Use the API layer
            await shoe_api.getAll(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    async function add(req, res) {
        try {
            // Use the API layer
            await shoe_api.add(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    async function showShoeForm(req, res) {
        try {
            res.render('ShoeForm');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    
    return {
        get,
        add
    }
}








