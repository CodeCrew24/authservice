# Auth API

This API provides endpoints for user registration, login, and client credential management.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Swagger Documentation](#swagger-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/CodeCrew24/authservice
```

2. Install Dependencies

```bash
cd authservice
npm install
```

3. Set up environment variables:
```bash
PORT=3000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
```

## Usage
Start the server:
```bash
nodemon start
```
The server will run on port 3000 by default. You can change the port by setting the PORT environment variable.

## Endpoints

The API provides the following endpoints:

- `POST /register`: Registers a new user.
- `POST /login/client`: Logs in a user using client ID and secret.
- `GET /client`: Retrieves client ID and secret.
- `POST /regenerate-client-credentials`: Regenerates client credentials.

For detailed information on each endpoint, refer to the [Swagger Documentation](swagger.json).

## Swagger Documentation

You can view the Swagger documentation for this API by visiting the following URL:

```bash
https://auth-service-latest.onrender.com
```
# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- [S V S K Devi Prakash Kandikonda](https://github.com/dprakash2101)
