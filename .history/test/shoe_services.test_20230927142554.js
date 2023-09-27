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
    // Truncate the shoes table and reset any states if needed
    await db.none('TRUNCATE TABLE "public"."shoes" RESTART IDENTITY CASCADE');
  });

  // Test case 1: Test fetching all shoes
  it("should fetch all shoes", async function () {
    // Insert a shoe for test
    await shoe.addShoe({
      name: "Test Shoe",
      color: "Red",
      brand: "Nike",
      price: 100,
      size: 9,
      in_stock: 5,
      image_url: "http://example.com/image.jpg"
    });

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
    
    assert.strictEqual(allShoes.length, 1);
    assert.deepStrictEqual(allShoes[0].color, newShoe.color);
  });

  // Test case 3: Test filtering shoes by brand
  it("should filter shoes by brand", async function () {
    // Add multiple shoes
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await shoe.addShoe({ color: "Blue", brand: "Adidas", price: 200, size: 10, in_stock: 4 });

    // Filter by brand "Nike"
    const nikeShoes = await shoe.getShoesByBrand("Nike");
    assert.strictEqual(nikeShoes.length, 1);
    assert.strictEqual(nikeShoes[0].brand, "Nike");
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
    assert.strictEqual(affordableShoes.length, 1);
    assert.strictEqual(affordableShoes[0].price, 100);
  });
  
  // Test case 7: Test fetching filtered shoes based on multiple filters
  it("should fetch filtered shoes based on multiple filters", async function () {
    // Add multiple shoes
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await shoe.addShoe({ color: "Blue", brand: "Adidas", price: 200, size: 10, in_stock: 4 });
  
    // Apply multiple filters: brand = "Nike" and size = 9
    const filters = { brand: "Nike", size: 9 };
    const filteredShoes = await shoe.getFilteredShoes(filters);
    assert.strictEqual(filteredShoes.length, 1);
    assert.strictEqual(filteredShoes[0].brand, "Nike");
    assert.strictEqual(filteredShoes[0].size, 9);
  });


});


describe("Cart and Misc Services", function () {
  this.timeout(5000);

  const shoe = shoesService(db);
  const cart = cartService(db);  // Assuming you've made a cartService similar to shoeService

  beforeEach(async function () {
    await db.none('TRUNCATE TABLE "public"."shoes", "public"."carts" RESTART IDENTITY CASCADE');
  });

  it("should add an item to the cart", async function () {
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    await cart.addToCart(1, 2, 1);
    
    const cartItems = await cart.getCartItems(1);
    assert.strictEqual(cartItems.length, 1);
    assert.strictEqual(cartItems[0].quantity, 2);
  });

  it("should remove an item from the cart", async function () {
    await cart.addToCart(1, 2, 1);
    await cart.removeFromCart(1);
    
    const cartItems = await cart.getCartItems(1);
    assert.strictEqual(cartItems.length, 0);
  });

  it("should update cart quantity", async function () {
    await cart.addToCart(1, 2, 1);
    await cart.updateCartQuantity(1, 3);
    
    const updatedCartItem = await cart.getCartItemById(1);
    assert.strictEqual(updatedCartItem.quantity, 3);
  });

  it("should fetch all cart items for a user", async function () {
    await cart.addToCart(1, 2, 1);
    await cart.addToCart(2, 1, 1);
    
    const cartItems = await cart.getCartItems(1);
    assert.strictEqual(cartItems.length, 2);
  });

  it("should get the count of cart items for a user", async function () {
    await cart.addToCart(1, 2, 1);
    
    const itemCount = await cart.getCartItemCount(1);
    assert.strictEqual(itemCount, 1);
  });

  it("should checkout successfully", async function () {
    await cart.addToCart(1, 2, 1);
    const response = await cart.checkout(1);
    
    assert.strictEqual(response.message, "Checkout successful");
  });

  it("should fetch a shoe by its ID", async function () {
    await shoe.addShoe({ color: "Red", brand: "Nike", price: 100, size: 9, in_stock: 5 });
    const fetchedShoe = await shoe.getShoeById(1);
    
    assert.strictEqual(fetchedShoe.color, "Red");
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
