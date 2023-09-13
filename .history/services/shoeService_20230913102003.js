export default function shoesService(db) {


 // Update to include imageURL when fetching all shoes
async function getAllShoes() {
    return await db.any('SELECT * FROM "public"."shoes"');
}

// Update to include imageURL when adding a new shoe
async function addShoe(shoe) {
    const { name, color, brand, price, size, in_stock, image_url } = shoe;
    return await db.none('INSERT INTO "public"."shoes"(name, color, brand, price, size, in_stock, image_url) VALUES($1, $2, $3, $4, $5, $6, $7)', 
                         [name, color, brand, price, size, in_stock, image_url]);
}



   return  {
       getAllShoes,
       addShoe
   }
   
}