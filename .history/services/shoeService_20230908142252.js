export default function shoesService(db) {


    async function getAllShoes() {
       return await db.any('SELECT * FROM "public"."shoes"');
   }
   
    async function addShoe(shoe) {
       const { color, brand, price, size, in_stock } = shoe;
       return await db.none('INSERT INTO "public"."shoes"(color, brand, price, size, in_stock) VALUES($1, $2, $3, $4, $5)', [color, brand, price, size, in_stock]);
   }


   return  {
       getAllShoes,
       addShoe
   }
   
}