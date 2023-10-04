export default function shoesService(db) {
    // Existing Methods
    async function getAllShoes() {
      return await db.any('SELECT * FROM "public"."shoes" ORDER BY id ASC');
    }
    
    async function addOrUpdateShoe({ name, color, brand, price, size, in_stock, image_url }) {
    
      // Debugging: Check for close matches
      const similarShoes = await db.any('SELECT * FROM "public"."shoes" WHERE name LIKE $1', [`%${name}%`]);
    
      if (similarShoes.length > 0) {
        // If a match exists, update only the stock
        return await db.none(
          `UPDATE "public"."shoes" 
           SET in_stock = in_stock + $1
           WHERE name = $2`,
          [in_stock, name]
        );
      } else {
        // If it doesn't exist, insert it as a new shoe with all attributes
        return await db.none(
          'INSERT INTO "public"."shoes"(name, color, brand, price, size, in_stock, image_url) VALUES($1, $2, $3, $4, $5, $6, $7)',
          [name, color, brand, price, size, in_stock, image_url]
        );
      }
    }
    
    

    

    async function getFilterData() {
        const colors = await db.any('SELECT DISTINCT color FROM "public"."shoes"');
        const sizes = await db.any('SELECT DISTINCT size FROM "public"."shoes"');
        const brands = await db.any('SELECT DISTINCT brand FROM "public"."shoes"');
        const prices = await db.any('SELECT DISTINCT price FROM "public"."shoes"');
        return { colors, sizes, brands, prices };
      }
  
    // New Methods
    async function getShoesByBrand(brand) {
      return await db.any('SELECT * FROM "public"."shoes" WHERE brand = $1', [brand]);
    }
  
    async function getShoesBySize(size) {
      return await db.any('SELECT * FROM "public"."shoes" WHERE size = $1', [size]);
    }
  
    async function getShoesByBrandAndSize(brand, size) {
      return await db.any('SELECT * FROM "public"."shoes" WHERE brand = $1 AND size = $2', [brand, size]);
    }
  
    async function getShoesByColor(color) {
      return await db.any('SELECT * FROM "public"."shoes" WHERE color = $1', [color]);
    }
  
    async function getShoesByPrice(price) {
      return await db.any('SELECT * FROM "public"."shoes" WHERE price <= $1', [price]);
    }

    async function getFilteredShoes(filters) {
      let query = 'SELECT * FROM "public"."shoes"';
      let whereClauses = [];
      let values = [];
      let index = 1;
  
      for (let [key, value] of Object.entries(filters)) {
          whereClauses.push(`${key} = $${index}`);
          values.push(value);
          index++;
      }
  
      if (whereClauses.length > 0) {
          query += ' WHERE ' + whereClauses.join(' AND ');
      }
  
      return await db.any(query, values);
  }

  async function addToCart(shoe_id, quantity, user_id) {
    
    await db.tx(async t => {
        // Add to cart
        await t.none('INSERT INTO "public"."carts"(shoe_id, quantity, user_id) VALUES($1, $2, $3)', [shoe_id, quantity, user_id]);

        // Update in_stock count in the shoes table
        await t.none('UPDATE "public"."shoes" SET in_stock = in_stock - $1 WHERE id = $2', [quantity, shoe_id]);
    });
}


async function removeFromCart(cart_id) {
  try {
    console.log(`Attempting to remove cart item with ID: ${cart_id}`);
    const cartItem = await db.oneOrNone('SELECT * FROM "public"."carts" WHERE cart_id = $1', [cart_id]);
    
    if (!cartItem) {
      console.log(`No cart item found for cart_id: ${cart_id}`);
      return { status: 'error', message: 'No cart item found' };
    }

    // Add your logic here to actually remove the item.
    await db.none('DELETE FROM "public"."carts" WHERE cart_id = $1', [cart_id]);
    console.log(`Successfully removed cart item with ID: ${cart_id}`);

    return { status: 'success', message: 'Item removed' };

  } catch (err) {
    console.error('Error in removeFromCart:', err);
    return { status: 'error', message: 'Failed to remove item from cart' };
  }
}


async function updateCartQuantity(cart_id, newQuantity) {
  try {
    const result = await db.oneOrNone('UPDATE "public"."carts" SET quantity = $1 WHERE cart_id = $2 RETURNING quantity', [newQuantity, cart_id]);
    return result;
  } catch (err) {
    console.error("Error updating cart: ", err);
    throw err;
  }
}




async function getCartItems(user_id) {

    return await db.any(`
        SELECT 
            carts.cart_id,
            carts.shoe_id,
            carts.quantity,
            shoes.name,
            shoes.size,
            shoes.image_url,
            shoes.price
        FROM "public"."carts" 
        INNER JOIN "public"."shoes" ON carts.shoe_id = shoes.id
        WHERE carts.user_id = $1
    `, [user_id]);
}

async function getCartItemCount(user_id) {
    console.log(`Fetching cart item count: User ID = ${user_id}`);
    const result = await db.oneOrNone('SELECT COUNT(*) FROM "public"."carts" WHERE user_id = $1', [user_id]);
    return result ? parseInt(result.count, 10) : 0;
}

async function checkout(user_id) {


  // Start transaction
  await db.tx(async t => {
    // Fetch all cart items for the user
    const cartItems = await t.any('SELECT * FROM "public"."carts" WHERE user_id = $1', [user_id]);

    // Update the in_stock for each cart item
    for (const item of cartItems) {
      await t.none('UPDATE "public"."shoes" SET in_stock = in_stock - $1 WHERE id = $2', [item.quantity, item.shoe_id]);
    }

    // Delete all cart items for the user
    await t.none('DELETE FROM "public"."carts" WHERE user_id = $1', [user_id]);
  });

  return { message: 'Checkout successful' };
}

async function getCartItemById(cart_id) {

    return await db.oneOrNone('SELECT * FROM "public"."carts" WHERE cart_id = $1', [cart_id]);
}

async function getShoeById(shoeId) {

  try {
    return await db.oneOrNone('SELECT * FROM "public"."shoes" WHERE id = $1', [shoeId]);
  } catch (err) {
    console.error(`Error fetching shoe by ID: ${err}`);
    return null;
  }
}


  
    return  {
      getAllShoes,
      addOrUpdateShoe,
      getShoesByBrand,
      getShoesBySize,
      getShoesByBrandAndSize,
      getShoesByColor,
      getShoesByPrice,
      getFilterData,
      getFilteredShoes,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      getCartItems,
      getCartItemCount,
      checkout,
      getCartItemById,
      getShoeById
    }
  }
  