POLL VAULT

## Configuration
Create a `.env` file and configure it with the following environment variables 
``` bash
PORT=3000 
DEBUG=true
CORS_ORIGINS=<url of front end)> 
MONGO_URI=<mongo uri>
SECRET=<random string>
```

```
PORT=3000 
DEBUG=true
CORS_ORIGIN=http://localhost:8080
MONGO_URI=mongodb://localhost/firepolls-test
SECRET=superSecret
```

## Running SOCKET PARTY 
* Start a mongodb `npm run db-on`
* Start the server `npm run start` or `npm run watch`

## API Resources
#### User Model
The user model is used in the backend strictly for authentication and authorization. The user model will never be returned from the API, however userID's are stored on profiles for authorization validation.

* `_id` - a unique database generated string which uniquely identifies a user
* `email` - a unique string which stores the users email
* `username` - a unique string that stores the users username
* `passwordHash` - a string that holds a users hashed password
* `tokenSeed` - a unique and random string used to generate authorization tokens 

## Auth 
SOCKET uses Basic authentication and Bearer authorization to enforce access controls. Basic and Bearer auth both use the HTTP `Authorization` header to pass credentials on a request.

#### Basic Authentication
Once a user account has been created Basic Authentication can be used to make a request on behalf of the account. To create a Basic Authorization Header the client must base64 encode a string with the username and password separated by a colon. Then the encoded string can be appended to the string `'Basic '` and set to an `Authorization` header on an HTTP Request.    

``` javascript
// Example of formating a Basic Authentication header in Javascript 
let username = 'coolDude'
let password = 'abcd1234'

let encoded = window.btoa(`${username}:${password}`)
let headers = {
  Authorization: `Basic ${encoded}`
}
```

#### Bearer Authorization
After a successful signup or login request the client will receive a token. Bearer Authorization uses that token to make a request on behalf of that user account. The token should be appended to the string `'Bearer '` and set to an Authorization header on an HTTP Request.

``` javascript
// Example of formating a Bearer Authorization header in Javascript
let token = '11983261983261982643918649814613298619823698243'

let headers = {
  Authorization: `Beaer ${token}`
}
```

---


#### POST `/signup`
a HTTP POST request to /signup will create a new user account.

###### request 
* Expected Headers
  * Content-Type: application/json
* Request Body
  * JSON containing a username, email and password

``` json 
{
  "username": "coolDude",
  "email": "coolDude@coolGuy.com",
  "password": "abcd1234"
}
```

###### response
The response body will be a **bearer token**.

--- 

#### GET `/login`
A HTTP GET request to /login will login (fetch a token) to an existing user account.

###### request
* Expected Headers 
  * Basic Authorization for the user account

###### response 
The response body will be a **bearer token**.
