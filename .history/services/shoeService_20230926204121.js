export default function shoesService(db) {
    // Existing Methods
    async function getAllShoes() {
      return await db.any('SELECT * FROM "public"."shoes" ORDER BY id ASC');
    }
    
  
    async function addShoe( { name, color, brand, price, size, in_stock, image_url } ) {
      // const = shoe;
      return await db.none('INSERT INTO "public"."shoes"(name, color, brand, price, size, in_stock, image_url) VALUES($1, $2, $3, $4, $5, $6, $7)', 
                           [name, color, brand, price, size, in_stock, image_url]);
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
  console.log(`Removing from cart: Cart ID = ${cart_id}`);
  
  const cartItem = await db.one('SELECT * FROM "public"."carts" WHERE cart_id = $1', [cart_id]);
  
  // Update the stock in the shoes table
  await db.none('UPDATE "public"."shoes" SET in_stock = in_stock + $1 WHERE id = $2', [cartItem.quantity, cartItem.shoe_id]);
  
  // Delete the item from the cart
  return await db.none('DELETE FROM "public"."carts" WHERE cart_id = $1', [cart_id]);
}


async function updateCartQuantity(cart_id, newQuantity) {
  console.log('Received cart_id:', cart_id, ' newQuantity:', newQuantity);

  try {
    const result = await db.oneOrNone('SELECT quantity FROM "public"."carts" WHERE cart_id = $1', [cart_id]);
    console.log('Database now has quantity:', result ? result.quantity : 'Not found');
    
      return result;
  } catch (err) {
      console.error("Error updating cart: ", err);
      throw err;
  }
}

async function getCartItems(user_id) {
    console.log(`Fetching cart items: User ID = ${user_id}`);
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
    console.log(`Checking out: User ID = ${user_id}`);
    return await db.none('DELETE FROM "public"."carts" WHERE user_id = $1', [user_id]);
}

async function getCartItemById(cart_id) {
    console.log(`Fetching cart item by ID: Cart ID = ${cart_id}`);
    return await db.oneOrNone('SELECT * FROM "public"."carts" WHERE cart_id = $1', [cart_id]);
}

async function getShoeById(shoeId) {
  console.log('Inside service.getShoeById');
  try {
    return await db.oneOrNone('SELECT * FROM "public"."shoes" WHERE id = $1', [shoeId]);
  } catch (err) {
    console.error(`Error fetching shoe by ID: ${err}`);
    return null;
  }
}


  
    return  {
      getAllShoes,
      addShoe,
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
  