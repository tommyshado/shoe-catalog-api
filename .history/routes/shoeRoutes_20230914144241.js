
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


    async function getByBrand(req, res) {
        try {
            await shoe_api.getByBrand(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function getBySize(req, res) {
        try {
            await shoe_api.getBySize(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function getByColor(req, res) {
        try {
            await shoe_api.getByColor(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function getByPrice(req, res) {
        try {
            await shoe_api.getByPrice(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function getFilters(req, res) {
        try {
            // Use the API layer to fetch filter data
            await shoe_api.getFilters(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    async function getFiltered(req, res) {
        try {
            // Use the API layer
            await shoe_api.getFiltered(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function addToCart(req, res) {
        try {
            await shoe_api.addToCart(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function removeFromCart(req, res) {
        try {
            await shoe_api.removeFromCart(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function updateCartQuantity(req, res) {
        try {
            await shoe_api.updateCartQuantity(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function getCartItems(req, res) {
        try {
            await shoe_api.getCartItems(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function getCartItemCount(req, res) {
        try {
            await shoe_api.getCartItemCount(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function checkout(req, res) {
        try {
            await shoe_api.checkout(req, res);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    
    return {
        get,
        add,
        showShoeForm,
        getByBrand,
        getBySize,
        getByColor,
        getByPrice,
        getFilters,
        getFiltered,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartItems,
        getCartItemCount,
        checkout
    }
}








