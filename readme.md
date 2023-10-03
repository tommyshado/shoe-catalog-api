

[![Node.js CI](https://github.com/lasity34/shoe-catalog-api/actions/workflows/node.js.yml/badge.svg)](https://github.com/lasity34/shoe-catalog-api/actions/workflows/node.js.yml)


# Shoe Catalogue API 👟🛒

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [API Routes](#api-routes)
4. [Setup](#setup)
5. [Testing](#testing)
6. [Learnings and Reflection](#learnings-and-reflection)
7. [What's Next](#whats-next)

---

## Overview 📝

A comprehensive API designed for Lubabalo's shoe shop. The API integrates with his existing system, providing a wide range of functionalities like listing available shoes, filtering them by brand and size, updating stock levels, and more.

---

## Tech Stack 💻

- **ExpressJS**: For creating the API server.
- **PostgreSQL**: For data storage.
- **Handlebars**: Server-side templating.
- **Bcrypt**: For security.
- **Axios**: HTTP client for API calls.
- **CORS**: Cross-Origin Resource Sharing.
- **Deployed on Heroku**: Cloud platform for deployment.

---

## API Routes 🌐

- `GET /api/shoes`: List all available shoes.
- `GET /api/shoes/brand/:brandname`: List shoes by brand.
- `GET /api/shoes/size/:size`: List shoes by size.
- `GET /api/shoes/brand/:brandname/size/:size`: List shoes by brand and size.
- `POST /api/shoes/sold/:id`: Update stock levels.
- `POST /api/shoes`: Add new shoe to stock.

---

## Setup 🛠️

The project is set up in a folder called `shoes_api` and deployed to Heroku.

---

## Testing 🧪

API can be tested using Postman and supertest.

---

## Learnings and Reflection 📘

- **Skills Used**: Already knew Express, Handlebars, Mocha, HTML, CSS, and Bcrypt.
- **New Skills**: Learned Axios for client-side HTTP calls.
- **Obstacles**: Faced challenges in differentiating between HTML and Handlebars, and connecting APIs to the front end.
- **Takeaways**: Learned how to create and set up APIs, and how to integrate them on the client-side using Axios.

---

## What's Next 🛠️

- **User Authentication**: Implement stronger authentication methods.
- **Rate Limiting**: To avoid API abuse.
- **API Versioning**: To make the API more future-proof.

