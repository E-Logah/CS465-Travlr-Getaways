# CS 465 Full Stack Development: Travlr Getaways

Travlr Getaways is a full stack MEAN (MongoDB, Express, Angular, Node.js) web application built over the course of CS 465 at Southern New Hampshire University. It has two sides:

- **Customer website** (`app_server/`): an Express site that uses Handlebars (HBS) templates to show travel packages to customers at `/travel`.
- **Admin single-page application** (`app_admin/`): an Angular SPA where administrators log in and add, edit, and delete trips.
- **REST API** (`app_api/`): an Express API that both sides use, backed by MongoDB through Mongoose. Admin changes are protected with JWT authentication.

## REST API

| Method | URL                  | Purpose                        |
|--------|----------------------|--------------------------------|
| POST   | /api/register        | Create an admin, returns a JWT |
| POST   | /api/login           | Log in, returns a JWT          |
| GET    | /api/trips           | List all trips                 |
| GET    | /api/trips/:tripCode | Get one trip                   |
| POST   | /api/trips           | Add a trip (token required)    |
| PUT    | /api/trips/:tripCode | Update a trip (token required) |
| DELETE | /api/trips/:tripCode | Delete a trip (token required) |

## Run locally

1. Start MongoDB on `mongodb://127.0.0.1:27017`.
2. In the project folder run `npm install`, then seed the data once with `node app_api/models/travlrSeed.js`.
3. Copy `.env.example` to a new file named `.env` and set `JWT_SECRET` to any long random string.
4. Start the API and customer website with `npm start` (http://localhost:3000).
5. Register an admin once: POST `/api/register` with JSON `{"name":"...","email":"...","password":"..."}`.
6. In a second terminal: `cd app_admin`, `npm install`, then `npm start`.
7. Open the admin SPA at http://localhost:4200 and log in.

---

# Module Eight Journal: Reflection

## Architecture

**Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**

The project used three kinds of frontend development. It started as static HTML pages served by Express, where every page was a separate file and every click loaded a whole new page from the server. I then converted those pages into Handlebars templates rendered by Express. The server filled the templates with trip data, first from a JSON file and later from the API, so the content became dynamic, but the page was still built on the server and reloaded on each request. Plain JavaScript added small behaviors in the browser on top of those pages.

The admin side was built as an Angular single-page application, which works very differently. The SPA loads once, and after that Angular swaps components in and out and calls the API in the background, so the page never fully reloads. That makes the admin tools faster and more interactive, like a desktop app. The tradeoff is that an SPA is more complex to build, relies on JavaScript running in the browser, and is harder for search engines to read. Server-rendered Express pages are simpler and better for a public, content-focused site, which is why they fit the customer side, while the SPA fits the admin side, where users do a lot of create, update, and delete work.

**Why did the backend use a NoSQL MongoDB database?**

MongoDB stores data as flexible JSON-like documents, which matches the JavaScript used everywhere else in the MEAN stack. A trip is naturally a single document with its code, name, length, start date, resort, price, image, and description, so there is no need to split it across tables or write joins. Data moves from the database to Express to Angular in almost the same shape. MongoDB also has a flexible schema, so fields can be added as the application grows, and it scales well for web applications. Mongoose added a schema and validation on top of it, which gave the data structure and rules without losing that flexibility.

## Functionality

**How is JSON different from JavaScript and how does JSON tie together the frontend and backend development pieces?**

JavaScript is a programming language, while JSON (JavaScript Object Notation) is only a text format for data. JSON borrows JavaScript's object syntax, but it is stricter: keys must be in double quotes, and it cannot hold functions, comments, or variables, only data such as strings, numbers, booleans, arrays, and objects. Because it is plain text, almost any language can read and write it.

JSON is the common language that connects every layer of the project. MongoDB stores trips as JSON-like documents, the Express API sends and receives trips as JSON, and the Angular SPA turns that JSON into TypeScript `Trip` objects to display and edit. When an admin saves a trip, Angular sends JSON in the request body, Express parses it with `express.json()`, and Mongoose saves it to MongoDB. Login works the same way: the API returns the JWT inside a JSON response.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**

- **Static HTML to Handlebars templates:** I replaced hard-coded travel pages with one template and a list of trips. Adding a trip now means adding data, not copying and editing HTML.
- **Templates fed by the API:** I moved the customer site from reading a local JSON file to calling the REST API, so the customer and admin sides now share one source of truth in MongoDB.
- **Shared API helper:** in the trips controller I pulled the repeated field mapping into one `tripFromBody` function used by both the add and update endpoints, which removed duplicated code and keeps the two in sync.
- **Angular data service:** all HTTP calls live in `TripDataService` instead of inside each component, so components focus on display and the API URL is defined in one place.
- **JWT interceptor:** instead of adding the token to each request by hand, an HTTP interceptor attaches the `Authorization: Bearer` header to every API call automatically.

The `trip-card` component shows the benefit of reusable UI components. One component displays every trip in the listing, so each card looks and behaves the same, a design change only has to be made once, and the code is smaller and easier to test. The add, edit, and login forms followed the same idea, each one a self-contained component with its own template, logic, and styling.

## Testing

**Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.**

An endpoint is a URL on the API, such as `/api/trips` or `/api/trips/:tripCode`, and the HTTP method says what action to take on it. GET retrieves data, POST creates a new record, PUT updates an existing one, and DELETE removes one. I tested each method and endpoint with Postman and in the browser, checking both the data returned and the status codes: 200 for a successful read or update, 201 for a created trip, 204 for a deletion, 400 for bad input, 404 for a trip that doesn't exist, and 500 for a server error.

Security made testing harder. After I added JWT authentication, POST, PUT, and DELETE required a valid token, while GET stayed public so the customer site still works. To test the protected endpoints, I first had to register an admin, log in to get a token, and then send it in the `Authorization: Bearer <token>` header. I also tested the failure cases: requests with no token, a badly formatted header, or an expired or invalid token all had to return 401 Unauthorized. Passwords are salted and hashed before they are stored, so they are never saved in plain text, and the JWT secret is kept in a `.env` file instead of in the code. On the Angular side, a route guard keeps logged-out users away from admin pages. Testing security this way showed me that a full stack application has to be checked both for what authorized users can do and for what unauthorized users are blocked from doing.

## Reflection

**How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**

This course gave me experience building a complete web application from the database to the user interface, which is what employers look for in full stack and software development roles. I learned to design and build a RESTful API with Express and Node.js, to model and store data in MongoDB with Mongoose, and to build an Angular single-page application with components, services, routing, and forms. I also practiced converting a static site into a dynamic, data-driven one.

Security was one of the most valuable parts for me because of my interest in cybersecurity. Implementing JWT authentication, password hashing, protected routes, and environment variables for secrets showed me how security is built into an application rather than added at the end. I also strengthened my skills with Git and GitHub for version control, Postman for API testing, and debugging across the frontend and backend. Together, these skills make me a stronger candidate for roles in full stack development and secure software development, and this project is a working example I can show employers in my portfolio.
