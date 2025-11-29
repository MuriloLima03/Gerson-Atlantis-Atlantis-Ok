# Atlantis Server with MongoDB

This project uses MongoDB via Mongoose for data persistence.

## Configuration

The server requires a MongoDB connection string through the `MONGODB_URI` environment variable.

### Local MongoDB (Development)

For local development, you can use a local MongoDB instance:

```powershell
# Windows PowerShell
$env:MONGODB_URI = "mongodb://localhost:27017/atlantis"
npm run start:api

# Command Prompt
set MONGODB_URI=mongodb://localhost:27017/atlantis
npm run start:api

# Bash/Linux/macOS
export MONGODB_URI="mongodb://localhost:27017/atlantis"
npm run start:api
```

### MongoDB Atlas (Production)

For production, we recommend using MongoDB Atlas:

1. Create a cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string from the Atlas dashboard
3. Replace `<username>`, `<password>`, and `<dbname>` in the connection string
4. Set it as your MONGODB_URI:

```powershell
$env:MONGODB_URI = "mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority"
npm run start:api
```

## Models

The server uses Mongoose models in `src/server/models/`:

### Acomodacao (Accommodation)
- `name` (String, required) - Accommodation name
- `type` (String, required) - Type of accommodation
- `rate` (Number, required) - Daily rate
- `CamaSolteiro` (Number) - Number of single beds
- `CamaCasal` (Number) - Number of double beds
- `Climatizacao` (Boolean) - Has air conditioning
- `Garagem` (Number) - Number of parking spots
- `Suite` (Number) - Number of suites
- `disponivel` (Boolean) - Availability status

## API Endpoints

### Accommodation Types
- `GET /api/v1/accommodation-types` - List all types
- `GET /api/v1/accommodation-types-specs` - Get detailed specifications

### Accommodations
- `GET /api/v1/accommodations` - List all
- `POST /api/v1/accommodations` - Create new
- `PUT /api/v1/accommodations/:id` - Update
- `DELETE /api/v1/accommodations/:id` - Delete

### Health Check
- `GET /api/health` - Server and database status

## Server Details
- Port: 3000 (default, override with PORT environment variable)
- Database connection: Required, set via MONGODB_URI
- Error handling: Automatic with standardized error responses
- CORS: Enabled for all origins
