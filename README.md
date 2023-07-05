# node-crud-api
# НАПОМНЮ ЧТО КОМИТЫ В СЛУЖЕБНЫХ ФАЙЛАХ НЕ ВХОДЯТ В ЭТО ПРАВИЛО
# Commits after deadline (except commits that affect only Readme.md, .gitignore, etc.) 

To use this project, you will need to download and install several dependencies. Please follow the steps below:

Make sure you have Node.js 18 LTS installed. You can download it from the official Node.js website.

After installing Node.js, open the terminal (or command prompt) and navigate to the project directory.

Execute the following command to install the required dependencies:
```npm i```

## Available commands in the project:
`build` Compiles the project.

`start:dev` Launches the project in development mode using Nodemon in single mode.

`start:prod` Compiles the project using TypeScript and runs the compiled index.js file.

`start:multi` Launches the project in development mode using Nodemon in scalable mode with cluster support.

`test` Runs tests using Jest with detailed output and sequential execution. Execute the following command:

## API Documentation

This documentation outlines the available endpoints and their expected behaviors for the `/api/users` route.

### `GET /api/users`

- **Description:** Retrieves all user records.
- **Response:**
  - **Status code:** 200
  - **Body:** Array of user records

### `GET /api/users/{userId}`

- **Description:** Retrieves a user record with the specified `userId`.
- **Parameters:**
  - `userId` (string): The unique identifier of the user.
- **Response:**
  - **Status code:** 200
  - **Body:** User record with the matching `userId`
  - **Status code:** 400
  - **Body:** Error message if `userId` is invalid (not a UUID)
  - **Status code:** 404
  - **Body:** Error message if no user record with the specified `userId` exists

### `POST /api/users`

- **Description:** Creates a new user record and stores it in the database.
- **Request Body:**
  - `username` (string, required): The name of the user.
  - `age` (number, required): The age of the user.
  - `hobbies` (array of strings, required): The hobbies of the user.
- **Response:**
  - **Status code:** 201
  - **Body:** Newly created user record
  - **Status code:** 400
  - **Body:** Error message if the request body is missing required fields

### `PUT /api/users/{userId}`

- **Description:** Updates an existing user record with the specified `userId`.
- **Parameters:**
  - `userId` (string): The unique identifier of the user.
- **Request Body:**
  - 
    ```
    {
    id: string; // UUID string
    username: string;
    age: number;
    hobbies: string[];
    }
    ```
- **Response:**
  - **Status code:** 200
  - **Body:** Updated user record
  - **Status code:** 400
  - **Body:** Error message if `userId` is invalid (not a UUID)
  - **Status code:** 404
  - **Body:** Error message if no user record with the specified `userId` exists

### `DELETE /api/users/{userId}`

- **Description:** Deletes an existing user record with the specified `userId`.
- **Parameters:**
  - `userId` (string): The unique identifier of the user.
- **Response:**
  - **Status code:** 204
  - **No content**
  - **Status code:** 400
  - **Body:** Error message if `userId` is invalid (not a UUID)
  - **Status code:** 404
  - **Body:** Error message if no user record with the specified `userId` exists

## types

### User
```
{
  id: string; // UUID string
  username: string;
  age: number;
  hobbies: string[];
}
```
