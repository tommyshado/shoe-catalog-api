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


});
