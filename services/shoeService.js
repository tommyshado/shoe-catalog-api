export default function shoesService(db) {


 // Update to include imageURL when fetching all shoes
async function getAllShoes() {
    return await db.any('SELECT * FROM "public"."shoes"');
}

// Update to include imageURL when adding a new shoe
async function addShoe(shoe) {
    const { color, brand, price, size, in_stock, imageURL } = shoe;
    return await db.none('INSERT INTO "public"."shoes"(color, brand, price, size, in_stock, image_url) VALUES($1, $2, $3, $4, $5, $6)', 
                         [color, brand, price, size, in_stock, imageURL]);
}



   return  {
       getAllShoes,
       addShoe
   }
   
}