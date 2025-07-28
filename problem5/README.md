# Task Management API

A RESTful API for managing tasks built with Express.js, TypeScript, Prisma ORM, and PostgreSQL. This project provides a complete task management system with CRUD operations, priority levels, due dates, and tagging capabilities.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Validation**: Comprehensive input validation
- **Docker Support**: Containerized development and production environments
- **E2E Testing**: Complete end-to-end test suite

## Tech Stack

- **Runtime**: Node.js 24 with TypeScript
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL 16 with Prisma ORM
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest with E2E tests
- **Validation**: express-validator

## Prerequisites

- Node.js 24 or higher
- pnpm
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (for local development)

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   cd problem5
   ```

2. **Start the application with Docker Compose**:
   ```bash
   docker-compose -f docker/docker-compose.yaml up --build
   ```

   This will:
   - Start a PostgreSQL database
   - Run database migrations
   - Start the API server on `http://localhost:3000`

3. **Access the API**:
   - API Base URL: `http://localhost:3000/api/v1`
   - Health Check: `http://localhost:3000/api/v1/tasks`

### Option 2: Local Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the project root:
   ```bash
   # Database Configuration
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/99tech"
   
   # Application Configuration
   PORT=3000
   HOST=localhost
   ENV=development
   ```

3. **Set up the database**:
   ```bash
   # Generate Prisma client
   pnpm run prisma:generate
   
   # Run database migrations
   pnpm run prisma:migrate
   ```

4. **Start the development server**:
   ```bash
   pnpm run dev
   ```

   The server will start on `http://localhost:3000`

## API Response Format

All API responses follow a standardized structure for consistency and debugging:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Success message",
  "requestId": "uuid-string",
  "timeExec": 123,
  "statusCode": 200
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `data` | any | The actual response data |
| `message` | string | Human-readable message |
| `requestId` | string | Unique identifier for request tracking |
| `timeExec` | number | Request execution time in milliseconds |
| `statusCode` | number | HTTP status code |

### Error Response Format

```json
{
  "success": false,
  "data": {
    // Error details or validation errors
  },
  "message": "Error message",
  "requestId": "uuid-string",
  "timeExec": 45,
  "statusCode": 400
}
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Task Endpoints

#### Get All Tasks
```http
GET /tasks
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "task-1",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "completed": false,
      "priority": "MEDIUM",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "tags": ["documentation", "api"],
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "message": "Tasks retrieved successfully",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timeExec": 45,
  "statusCode": 200
}
```

#### Get Task by ID
```http
GET /tasks/{id}
```

**Parameters**:
- `id` (integer): Task ID

#### Create Task
```http
POST /tasks
```

**Request Body**:
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "MEDIUM",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "tags": ["tag1", "tag2"]
}
```

**Required Fields**:
- `title` (string): Task title
- `description` (string): Task description

**Optional Fields**:
- `completed` (boolean): Task completion status
- `priority` (enum): NONE, LOW, MEDIUM, HIGH, URGENT
- `dueDate` (date): Task due date
- `tags` (array): Array of tag strings

#### Update Task
```http
PUT /tasks/{id}
```

**Parameters**:
- `id` (integer): Task ID

**Request Body** (all fields optional):
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "priority": "HIGH",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "tags": ["updated", "tags"]
}
```

#### Delete Task
```http
DELETE /tasks/{id}
```

**Parameters**:
- `id` (integer): Task ID

## Database Schema

### Task Model
```prisma
model Task {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    PRIORITY  @default(MEDIUM)
  dueDate     DateTime?
  tags        String[]
  createdAt   DateTime? @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([slug])
  @@map("tasks")
}

enum PRIORITY {
  NONE
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `PORT` | Server port | 3000 | No |
| `HOST` | Server host | localhost | No |
| `ENV` | Environment (development/production) | development | No |

### Docker Configuration

The project includes a complete Docker setup with:

- **PostgreSQL 16**: Database service with health checks
- **Application**: Node.js service with hot reload
- **Migration Service**: Automated database migrations
- **Networking**: Isolated network for services
- **Volumes**: Persistent database storage

## Development

### Available Scripts

```bash
# Development
pnpm run dev              # Start development server with nodemon
pnpm run prisma:generate  # Generate Prisma client
pnpm run prisma:migrate   # Run database migrations
pnpm run prisma:reset     # Reset database and run migrations
pnpm run prisma:seed      # Run seed migrations

# Testing
pnpm run test:e2e         # Run end-to-end tests
```

### Project Structure

```
problem5/
├── docker/                 # Docker configuration
│   ├── docker-compose.yaml # Multi-service setup
│   └── Dockerfile         # Multi-stage build
├── e2e/                   # End-to-end tests
│   ├── config/            # Test configuration
│   ├── tests/             # Test files
│   └── utils/             # Test utilities
├── prisma/                # Database configuration
│   ├── migrations/        # Database migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
├── src/                   # Application source
│   ├── config/           # Configuration management
│   ├── middleware/       # Express middleware
│   ├── router/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Testing

### E2E Tests

Run the complete end-to-end test suite:

```bash
# Using Docker (recommended)
docker-compose -f docker/docker-compose.yaml up --build -d
pnpm run test:e2e

# Local development
pnpm run dev
pnpm run test:e2e
```

The E2E tests cover:
- API endpoint functionality
- Request/response validation
- Error handling
- Database operations

## Deployment

### Production with Docker

1. **Build production image**:
   ```bash
   docker build -f docker/Dockerfile --target prod -t task-api:prod .
   ```

2. **Run with environment variables**:
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-production-db-url" \
     -e ENV="production" \
     task-api:prod
   ```

### Environment-Specific Configuration

- **Development**: Uses local PostgreSQL with Docker Compose
- **Production**: Requires external PostgreSQL database
- **Testing**: Uses isolated test database

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Ensure PostgreSQL is running
   - Check `DATABASE_URL` environment variable
   - Verify database credentials

2. **Port Already in Use**:
   - Change `PORT` environment variable
   - Stop conflicting services

3. **Migration Errors**:
   - Reset database: `pnpm run prisma:reset`
   - Check schema compatibility

4. **Docker Issues**:
   - Clean up containers: `docker-compose down -v`
   - Rebuild images: `docker-compose build --no-cache`

5. **Dependency Not Found**:
   - **Issue**: New dependencies not available in Docker container
   - **Solution**: Rebuild Docker image after adding dependencies
   ```bash
   # Stop containers
   docker-compose -f docker/docker-compose.yaml down
   
   # Rebuild with new dependencies
   docker-compose -f docker/docker-compose.yaml up --build
   
   # Or rebuild specific service
   docker-compose -f docker/docker-compose.yaml build backend
   docker-compose -f docker/docker-compose.yaml up backend
   ```

### Logs

- **Application logs**: Check console output
- **Database logs**: `docker-compose logs db`
- **API logs**: `docker-compose logs backend`

