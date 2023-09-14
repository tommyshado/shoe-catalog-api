export default function shoesService(db) {
    // Existing Methods
    async function getAllShoes() {
      return await db.any('SELECT * FROM "public"."shoes"');
    }
  
    async function addShoe(shoe) {
      const { name, color, brand, price, size, in_stock, image_url } = shoe;
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
  


  
    return  {
      getAllShoes,
      addShoe,
      getShoesByBrand,
      getShoesBySize,
      getShoesByBrandAndSize,
      getShoesByColor,
      getShoesByPrice,
      getFilterData
    }
  }
  