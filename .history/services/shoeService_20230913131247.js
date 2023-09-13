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
  
    return  {
      getAllShoes,
      addShoe,
      getShoesByBrand,
      getShoesBySize,
      getShoesByBrandAndSize,
      getShoesByColor,
      getShoesByPrice
    }
  }
  