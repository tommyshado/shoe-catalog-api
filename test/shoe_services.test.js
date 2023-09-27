// Import the necessary modules
import assert from "assert";
import shoesService from "../services/shoeService.js";  // Make sure the path is correct
import pgPromise from "pg-promise";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Database connection
const connectionOptions = {
  connectionString: process.env.Shoe_catalog_URL_test,
  ssl: { rejectUnauthorized: false },
};
const pgp = pgPromise();
const db = pgp(connectionOptions);

// Test Suite for Shoe Services
describe("Shoe Services", function () {
  this.timeout(5000);

  // Initialize the shoe service
  const shoe = shoesService(db);

  // Run before each test case
  beforeEach(async function () {
    // Truncate all related tables
    await db.none('TRUNCATE TABLE "public"."users", "public"."shoes", "public"."carts" RESTART IDENTITY CASCADE');
  
    // Insert a user record for the tests
    await db.none('INSERT INTO "public"."users"(username, email, password) VALUES($1, $2, $3)', ['testuser', 'testuser@email.com', 'testpass']);
  
    // Insert a shoe record for the tests
    await db.none('INSERT INTO "public"."shoes"(color, brand, price, size, in_stock) VALUES($1, $2, $3, $4, $5)', ['Red', 'Nike', 100, 9, 5]);
  });
  

  // Test case 1: Test fetching all shoes
  it("should fetch all shoes", async function () {
    // Insert a shoe for test
  
    // Fetch all shoes
    const allShoes = await shoe.getAllShoes();
    
    // Assert that the result is an array and has the correct length
    assert.strictEqual(Array.isArray(allShoes), true);
    assert.strictEqual(allShoes.length, 1);
  });


  it("should add a new shoe", async function () {
    const newShoe = {
      color: "Blue",
      brand: "Adidas",
      price: 200,
      size: 10,
      in_stock: 4
    };

    await shoe.addShoe(newShoe);
    const allShoes = await shoe.getAllShoes();
    
    assert.strictEqual(allShoes.length, 2); // Changed from 1 to 2
    assert.deepStrictEqual(allShoes.find(s => s.color === newShoe.color).color, newShoe.color); // Find the newly added shoe and check its color
});


// Test case 3: Test filtering shoes by brand
it("should filter shoes by brand", async function () {
    // Add multiple shoes
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await shoe.addShoe({ color: "Blue", brand: "Adidas", price: 200, size: 10, in_stock: 4 });
  
    // Filter by brand "Nike"
    const nikeShoes = await shoe.getShoesByBrand("Nike");
    
    // Expecting 2 Nike shoes: one from beforeEach and another from within this test
    assert.strictEqual(nikeShoes.length, 2);
    
    // Check that all filtered shoes are Nike
    nikeShoes.forEach(shoe => assert.strictEqual(shoe.brand, "Nike"));
  });
  
  // Test case 4: Test filtering shoes by size
  it("should filter shoes by size", async function () {
    // Add multiple shoes
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await shoe.addShoe({ color: "Blue", brand: "Adidas", price: 200, size: 10, in_stock: 4 });

    // Filter by size 10
    const size10Shoes = await shoe.getShoesBySize(10);
    assert.strictEqual(size10Shoes.length, 1);
    assert.strictEqual(size10Shoes[0].size, 10);
  });


  it("should filter shoes by color", async function () {
    // Add multiple shoes
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await shoe.addShoe({ color: "Blue", brand: "Adidas", price: 200, size: 10, in_stock: 4 });
  
    // Filter by color "Blue"
    const blueShoes = await shoe.getShoesByColor("Blue");
    assert.strictEqual(blueShoes.length, 1);
    assert.strictEqual(blueShoes[0].color, "Blue");
  });
  
  // Test case 6: Test filtering shoes by price
it("should filter shoes by price", async function () {
    // Add multiple shoes
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await shoe.addShoe({ color: "Blue", brand: "Adidas", price: 200, size: 10, in_stock: 4 });
  
    // Filter by price <= 150
    const affordableShoes = await shoe.getShoesByPrice(150);
    
    // Expecting 2 affordable shoes: one from beforeEach and another from within this test
    assert.strictEqual(affordableShoes.length, 2);
    
    // Check that all filtered shoes are priced at or below 150
    affordableShoes.forEach(shoe => assert.strictEqual(shoe.price <= 150, true));
  });
  
  
// Test case 7: Test fetching filtered shoes based on multiple filters
it("should fetch filtered shoes based on multiple filters", async function () {
    // Add multiple shoes
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await shoe.addShoe({ color: "Blue", brand: "Adidas", price: 200, size: 10, in_stock: 4 });
  
    // Apply multiple filters: brand = "Nike" and size = 9
    const filters = { brand: "Nike", size: 9 };
    const filteredShoes = await shoe.getFilteredShoes(filters);
  
    // Expecting 2 shoes that match the filters: one from beforeEach and another from within this test
    assert.strictEqual(filteredShoes.length, 2);
  
    // Check that all filtered shoes match the criteria
    filteredShoes.forEach(shoe => {
      assert.strictEqual(shoe.brand, "Nike");
      assert.strictEqual(shoe.size, 9);
    });
  });
  


  it("should add an item to the cart", async function () {
    // Add a shoe first
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    
    // Add the shoe to the cart
    await shoe.addToCart(1, 1, 1); // shoe_id, quantity, user_id
    
    const cartItems = await shoe.getCartItems(1); // user_id
    assert.strictEqual(cartItems.length, 1);
    assert.strictEqual(cartItems[0].quantity, 1);
  });

  it("should remove an item from the cart", async function () {
    await shoe.addToCart(1, 1, 1);
    await shoe.removeFromCart(1); // cart_id
    
    const cartItems = await shoe.getCartItems(1); // user_id
    assert.strictEqual(cartItems.length, 0);
  });

  it("should update cart quantity", async function () {
    await shoe.addToCart(1, 1, 1);
    await shoe.updateCartQuantity(1, 2); // cart_id, newQuantity
    
    const cartItem = await shoe.getCartItemById(1); // cart_id
    assert.strictEqual(cartItem.quantity, 2);
  });


});



