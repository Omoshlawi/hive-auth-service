# The Hive Properties service

# Oauth resources

- https://developers.google.com/identity/gsi/web/guides/overview
- https://developers.google.com/identity/sign-in/web/backend-auth
- https://github.com/Shahzayb/mern-google-login?tab=readme-ov-file

## Step-by-Step OAuth Flow with Google, Github, Apple for your Microservices App:

### 1. User initiates login from your front-end application:

The user clicks a "Login" button or selects a provider (Google, Github, Apple) on your login page.
Your front-end app (React, Flutter, etc.) makes a request to your API gateway with the chosen provider as a parameter.
### 2. Gateway redirects to provider's login page:

The gateway identifies the provider and constructs the appropriate OAuth authorization URL with your app's client ID and redirect URI.
The gateway redirects the user's browser to the provider's login page (e.g., Google Sign-in, Github authorization page).
### 3. User logs in and grants access:

The user enters their credentials and logs in to the chosen provider.
If successful, the provider asks the user for permission to share their information with your app.
Upon user consent, the provider redirects the user's browser back to your app using the pre-configured redirect URI.
### 4. Gateway receives authorization code from provider:

The redirect URI specified in your gateway configuration receives the response from the provider.
This response typically includes an authorization code and potentially some additional information.
### 5. Gateway exchanges code for tokens and user information:

The gateway sends a request to the provider's token endpoint with the authorization code and app secrets.
The provider returns an access token and Refresh token (optional) for your app to access user data.
Additionally, the gateway retrieves user information (ID, email, etc.) from the provider using OpenID Connect claims.
### 6. Gateway forwards information to Authentication service:

The gateway sends the received access token and user information to your Authentication service.
### 7. Authentication service validates token and creates/updates user:

The Authentication service verifies the access token with the provider's token endpoint.
If valid, the service checks if a user with the corresponding ID already exists.
If not, a new user is created based on the retrieved information.
Otherwise, the existing user's information is updated.
### 8. Authentication service issues session token:

The Authentication service generates a session token (JWT or similar) specific to your app.
This token contains user information and is signed with your app's secret for secure validation.
### 9. Gateway returns session token to client:

The gateway receives the session token from the Authentication service and sends it back to the front-end application.
This can be done by including the token in the response body, setting a cookie, or using other secure methods.
### 10. Client stores and uses session token:

The front-end application securely stores the received session token (e.g., local storage, secure cookie).
Subsequent API calls to your services from the client application include the session token in the authorization header.
### 11. Gateway validates session token on subsequent requests:

For any protected API resource in your microservices, the gateway intercepts the request and extracts the session token.
The gateway forwards the token to the Authentication service for validation.
If valid, the gateway grants access to the requested resource.
If invalid, the request is denied with an appropriate error response.
Additional Notes:

This flow assumes the use of OpenID Connect for user information claims. You can also implement a simpler flow without claims if user information is not needed.
Refresh tokens can be used to obtain new access tokens without user interaction when the current access token expires.
Remember to implement proper error handling and security measures throughout the flow.
By following these steps and customizing them to your specific providers and technologies, you can achieve a secure and efficient OAuth integration for your microservices app with seamless user experience for various frontend frameworks.
http://localhost:3000/
---

Achieving a combination of both methods (using cookies for web-based clients and the Authorization header for mobile or non-browser clients) involves implementing logic on your server to handle both scenarios. Here's a general guide on how you might approach this:

### 1. Server-Side Implementation:

#### Handling Cookies:
1. **Configure Cookie Middleware:**
   - Use a cookie-parser middleware to parse incoming cookies in your Express app.

     ```javascript
     const cookieParser = require('cookie-parser');
     app.use(cookieParser());
     ```

2. **Generate and Send Token as a Cookie:**
   - When a user logs in or authenticates, generate a JWT token.
   - Set the token as a secure HTTP-only cookie.

     ```javascript
     res.cookie('jwtToken', yourGeneratedToken, { httpOnly: true, secure: true });
     ```

#### Handling Authorization Header:
1. **Verify Token in Authorization Header:**
   - For requests that include an Authorization header, extract the token and verify it.

     ```javascript
     const jwt = require('jsonwebtoken');

     // Extract token from Authorization header
     const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

     // Verify and decode the token
     jwt.verify(token, 'your-secret-key', (err, decoded) => {
       if (err) {
         // Handle token verification failure
         return res.status(401).json({ message: 'Unauthorized' });
       }

       // Token is valid, proceed with the request
       req.user = decoded;
       next();
     });
     ```

### 2. Client-Side Implementation:

#### Web-Based Clients (Cookies):
1. **Include Credentials in Fetch Requests:**
   - When making a request from a web-based client, include the `credentials: 'include'` option in your Fetch API calls.

     ```javascript
     fetch('your-api-endpoint', {
       method: 'GET',
       credentials: 'include',
       // other options...
     });
     ```

   - This ensures that cookies are sent with the request.

#### Mobile or Non-Browser Clients (Authorization Header):
1. **Include Token in Headers:**
   - When making a request from mobile or non-browser clients, include the JWT token in the Authorization header.

     ```javascript
     fetch('your-api-endpoint', {
       method: 'GET',
       headers: {
         Authorization: 'Bearer your-jwt-token',
         // other headers...
       },
       // other options...
     });
     ```

### 3. Handling Cross-Origin Resource Sharing (CORS):

- If you are dealing with cross-origin requests, configure your server to handle CORS properly. You may need to set appropriate headers and options to allow the cross-origin requests.

### 4. Considerations:

- Ensure proper error handling and security measures in both scenarios.
- Adjust the code snippets based on your specific authentication and authorization logic.
- Always use HTTPS to secure communication.

This approach allows your server to handle authentication in a flexible way, accommodating both web-based and non-browser clients. Adjust the details according to the authentication mechanism and library you are using, and keep your security measures up to date.

# Instructions

- All entities must extend the Entity in the shared/types
- All Repo must extend Repositories in the shared/types
- All repos concrete classes must implement repository
- All features folders structur must follow feature template, copy paste and rename to feature name
  all routes
- Server configuration to be done inside server/index, follow comments on them n e where to place routes and db config
- All midleware to be in middlewares folders
- Create `.env` file in project route directory and add bellow content

```
PORT=5000
NODE_ENV=development
DB_URL=<DB CONF>
```

To run

- `npm i` to install all dependancy
- `npm run dev` to run server
- Open `http://localhost:8000` in browser to tes if it return 404 not found

### Possible Microservices for your Real Estate SaaS Platform:

Here are some potential microservices you can consider, along with their main responsibilities:

Core Functionality:

**Property Service** :

- Manage property data (create, read, update, delete)
- Handle different property types (apartment, building, land, etc.)
- Associate properties with groups and locations
- Track amenities, features, and rental/ownership details

**User Service** :

- Manage user accounts (create, update, delete)
- Define user roles and permissions
- Handle authentication and authorization

**Group Service:**

- Manage property groups (create, read, update, delete)
- Link groups to properties and staff
- Handle nested groups (if applicable)

**Financial Service:**

- Manage financial transactions (rent, expenses, deposits)
- Generate invoices and manage payments
- Track financial performance and generate reports

**Staff Service:**

- Manage staff data (create, update, delete)
- Assign roles and permissions to staff
- Track staff activity and performance

**Reporting Service:**

- Generate reports on various aspects (property occupancy, financial performance, maintenance requests)
- Provide data visualizations and analytics

Additional Services:

Messaging Service:

Facilitate communication between users (staff, tenants, owners)
Manage internal and external messages
Maintenance Service:

Manage maintenance requests and work orders
Track maintenance history and costs
Tenant Portal:

Provide self-service features for tenants (rent payments, maintenance requests, lease documents)
Integration Service:

Connect with external systems (payment gateways, accounting software)
Responsibilities:

Each microservice should be responsible for a specific domain of functionality and own its data store. They should communicate with each other through well-defined APIs to fulfill user requests and complete tasks.

Considerations:

Start with the core functionalities first and gradually add additional services based on your needs and user feedback.
Choose an appropriate technology stack for microservices development, considering scalability, performance, and ease of maintenance.
Implement clear API documentation and ensure seamless integration between services.

# Listings research

Consists of a list of apartments available for purchase or renting, within the user's location, agents and managers of the apartments

**Requirements(Features)**
Requirements for the listings app:

- Type of property(house): Apartments, Houses, e.t.c.
- Property size.
- Prices:
  Sell
  Buy
  Rent
- Google maps: House locations within the user's location
- Pictures: Interior and exterior appearence of the houses
- Status: e.g. Available for sale, rent.
- Advantages for different properties: E.g Transport availablity, electricity



```
docker exec -it <container-id> psql -U <username> -d postgres -c "DROP DATABASE <database-name>;"
```