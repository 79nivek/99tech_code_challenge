# Live Scoreboard API Module Specification

## Overview

The Live Scoreboard API Module is a real-time scoring system that maintains a dynamic leaderboard of user scores with live updates. The system provides secure score updates, real-time notifications, and prevents unauthorized score manipulation.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Architecture Overview](#architecture-overview)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Authentication & Security](#authentication--security)
6. [Real-time Updates](#real-time-updates)
7. [Database Design](#database-design)
8. [Implementation Guidelines](#implementation-guidelines)
9. [Error Handling](#error-handling)
10. [Performance Considerations](#performance-considerations)
11. [Testing Strategy](#testing-strategy)
12. [Deployment](#deployment)
13. [Monitoring & Logging](#monitoring--logging)
14. [Future Improvements](#future-improvements)

## System Requirements

### Functional Requirements

1. **Score Management**
   - Update user scores via API calls
   - Maintain top 10 leaderboard
   - Support score increments and decrements
   - Handle score validation and constraints

2. **Real-time Updates**
   - Live scoreboard updates via WebSocket
   - Push notifications for score changes
   - Real-time leaderboard refresh

3. **Security & Authorization**
   - Prevent unauthorized score updates
   - Rate limiting for score updates
   - User authentication and authorization
   - Audit trail for score changes

4. **Data Persistence**
   - Store user scores and leaderboard data
   - Maintain score history
   - Handle concurrent updates

### Non-Functional Requirements

- **Performance**: Handle 1000+ concurrent users
- **Latency**: Real-time updates within 100ms
- **Availability**: 99.9% uptime
- **Scalability**: Horizontal scaling capability
- **Security**: Protection against score manipulation

## Architecture Overview

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   (Website)     │◄──►│   (Rate Limit)  │◄──►│   (Traffic)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │◄──►│   Scoreboard    │◄──►│   Authentication│
│   Server        │    │   API Service   │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cache Layer   │◄──►│   Database      │    │   Audit Log     │
│   (Redis)       │    │   (PostgreSQL)  │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL (primary), Redis (cache)
- **Real-time**: Socket.io or WebSocket
- **Authentication**: JWT tokens
- **Rate Limiting**: Redis-based rate limiting
- **Message Queue**: Redis Pub/Sub or RabbitMQ
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack

## API Endpoints

### Authentication Endpoints

```http
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Score Management Endpoints

```http
POST /api/v1/scores/update
GET /api/v1/scores/leaderboard
GET /api/v1/scores/user/{userId}
GET /api/v1/scores/history/{userId}
```

### WebSocket Events

```javascript
// Client to Server
socket.emit('join-leaderboard')
socket.emit('leave-leaderboard')

// Server to Client
socket.emit('leaderboard-update', leaderboardData)
socket.emit('score-updated', { userId, newScore, rank })
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  lastActive: Date;
  isActive: boolean;
}
```

### Score Model
```typescript
interface Score {
  id: string;
  userId: string;
  score: number;
  lastUpdated: Date;
  version: number; // For optimistic locking
  metadata?: {
    actionType: string;
    actionId: string;
    timestamp: Date;
  };
}
```

### Leaderboard Entry
```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  lastUpdated: Date;
}
```

### Score Update Request
```typescript
interface ScoreUpdateRequest {
  userId: string;
  scoreIncrement: number;
  actionId: string;
  actionType: string;
  timestamp: Date;
  signature: string; // For verification
}
```

## Authentication & Security

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
  jti: string; // JWT ID for token revocation
}
```

### Rate Limiting
- **Score Updates**: 10 requests per minute per user
- **Leaderboard Queries**: 100 requests per minute per user
- **Authentication**: 5 attempts per 15 minutes per IP

### Security Measures

1. **Request Signing**
   ```typescript
   // Client-side signature generation
   const signature = crypto
     .createHmac('sha256', secretKey)
     .update(`${userId}${scoreIncrement}${actionId}${timestamp}`)
     .digest('hex');
   ```

2. **Input Validation**
   - Score increment limits (e.g., max 1000 points per action)
   - Action type validation
   - Timestamp validation (prevent replay attacks)

3. **Audit Trail**
   - Log all score changes
   - Track IP addresses
   - Monitor suspicious patterns

## Real-time Updates

### WebSocket Connection Flow

```mermaid
sequenceDiagram
    participant Client
    participant WebSocket
    participant ScoreboardAPI
    participant Cache
    participant Database

    Client->>WebSocket: Connect with JWT
    WebSocket->>ScoreboardAPI: Validate token
    ScoreboardAPI->>WebSocket: Token valid
    WebSocket->>Client: Connection established
    Client->>WebSocket: Join leaderboard room
    WebSocket->>Cache: Subscribe to leaderboard updates
    Cache->>WebSocket: Current leaderboard data
    WebSocket->>Client: Send leaderboard data
```

### Score Update Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Auth
    participant Cache
    participant Database
    participant WebSocket

    Client->>API: POST /scores/update
    API->>Auth: Validate JWT & rate limit
    Auth->>API: Authorization granted
    API->>Database: Update score (with lock)
    Database->>API: Score updated
    API->>Cache: Update leaderboard cache
    Cache->>WebSocket: Notify leaderboard change
    WebSocket->>Client: Broadcast update
    API->>Client: Success response
```

## Database Design

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Scores table
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score BIGINT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    UNIQUE(user_id)
);

-- Score history table
CREATE TABLE score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    old_score BIGINT NOT NULL,
    new_score BIGINT NOT NULL,
    increment INTEGER NOT NULL,
    action_id VARCHAR(255),
    action_type VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard cache table
CREATE TABLE leaderboard_cache (
    rank INTEGER PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    score BIGINT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_score_history_user_id ON score_history(user_id);
CREATE INDEX idx_score_history_created_at ON score_history(created_at);
```

### Redis Cache Structure

```redis
# Leaderboard cache
LEADERBOARD:TOP10 -> JSON array of top 10 users
LEADERBOARD:LAST_UPDATED -> timestamp

# User scores cache
USER:SCORE:{userId} -> score value
USER:SCORE:{userId}:VERSION -> version number

# Rate limiting
RATE_LIMIT:SCORE_UPDATE:{userId} -> request count
RATE_LIMIT:LEADERBOARD:{userId} -> request count

# WebSocket rooms
WS:ROOM:LEADERBOARD -> set of connected socket IDs
```

## Implementation Guidelines

### Project Structure

```
src/
├── config/
│   ├── database.ts
│   ├── redis.ts
│   └── websocket.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── score.controller.ts
│   └── leaderboard.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── validation.middleware.ts
├── models/
│   ├── user.model.ts
│   ├── score.model.ts
│   └── leaderboard.model.ts
├── services/
│   ├── auth.service.ts
│   ├── score.service.ts
│   ├── leaderboard.service.ts
│   └── websocket.service.ts
├── utils/
│   ├── crypto.utils.ts
│   ├── validation.utils.ts
│   └── cache.utils.ts
└── websocket/
    ├── events/
    │   ├── leaderboard.events.ts
    │   └── score.events.ts
    └── handlers/
        ├── leaderboard.handler.ts
        └── score.handler.ts
```

### Core Service Implementation

```typescript
// score.service.ts
export class ScoreService {
  async updateScore(request: ScoreUpdateRequest): Promise<ScoreUpdateResult> {
    // 1. Validate request signature
    if (!this.validateSignature(request)) {
      throw new UnauthorizedError('Invalid signature');
    }

    // 2. Check rate limits
    await this.checkRateLimit(request.userId);

    // 3. Update score with optimistic locking
    const result = await this.updateScoreWithLock(request);

    // 4. Update leaderboard cache
    await this.updateLeaderboardCache();

    // 5. Broadcast update via WebSocket
    await this.broadcastScoreUpdate(result);

    return result;
  }

  private async updateScoreWithLock(request: ScoreUpdateRequest): Promise<ScoreUpdateResult> {
    return await this.db.transaction(async (trx) => {
      const score = await trx('scores')
        .where('user_id', request.userId)
        .forUpdate()
        .first();

      if (!score) {
        throw new NotFoundError('User score not found');
      }

      const newScore = score.score + request.scoreIncrement;
      const newVersion = score.version + 1;

      await trx('scores')
        .where('user_id', request.userId)
        .update({
          score: newScore,
          version: newVersion,
          last_updated: new Date()
        });

      // Log score change
      await trx('score_history').insert({
        user_id: request.userId,
        old_score: score.score,
        new_score: newScore,
        increment: request.scoreIncrement,
        action_id: request.actionId,
        action_type: request.actionType,
        ip_address: request.ipAddress,
        user_agent: request.userAgent
      });

      return {
        userId: request.userId,
        oldScore: score.score,
        newScore: newScore,
        rank: await this.calculateRank(newScore)
      };
    });
  }
}
```

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    requestId: string;
    timestamp: string;
  };
}
```

### Error Codes

- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `INVALID_SIGNATURE`: Invalid request signature
- `SCORE_NOT_FOUND`: User score not found
- `CONCURRENT_UPDATE`: Concurrent update conflict
- `INVALID_SCORE_INCREMENT`: Invalid score increment
- `USER_NOT_FOUND`: User not found

## Performance Considerations

### Caching Strategy

1. **Leaderboard Cache**: Redis cache for top 10 leaderboard
2. **User Score Cache**: Redis cache for individual user scores
3. **Cache Invalidation**: Update cache on score changes
4. **Cache Warming**: Pre-populate cache on startup

### Database Optimization

1. **Indexes**: Proper indexing on frequently queried columns
2. **Connection Pooling**: Efficient database connection management
3. **Query Optimization**: Optimized queries for leaderboard retrieval
4. **Partitioning**: Consider partitioning for large datasets

### Scalability

1. **Horizontal Scaling**: Multiple API instances behind load balancer
2. **Database Sharding**: Shard by user ID for large datasets
3. **CDN**: Use CDN for static assets
4. **Microservices**: Consider splitting into separate services

## Testing Strategy

### Unit Tests

```typescript
describe('ScoreService', () => {
  describe('updateScore', () => {
    it('should update score successfully', async () => {
      // Test implementation
    });

    it('should reject invalid signature', async () => {
      // Test implementation
    });

    it('should handle rate limiting', async () => {
      // Test implementation
    });
  });
});
```

### Integration Tests

- API endpoint testing
- Database integration testing
- WebSocket connection testing
- Authentication flow testing

### Load Testing

- Simulate 1000+ concurrent users
- Test rate limiting under load
- Measure response times
- Test WebSocket connection limits

## Deployment

### Docker Configuration

```dockerfile
# Base image
FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack prepare pnpm@10.13.1 --activate
RUN corepack enable

WORKDIR /app

FROM base AS prod
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod --no-optional

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start"]
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=10

# WebSocket
WS_PORT=3001
WS_PATH=/socket.io

# Security
SIGNATURE_SECRET=your-signature-secret
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scoreboard-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: scoreboard-api
  template:
    metadata:
      labels:
        app: scoreboard-api
    spec:
      containers:
      - name: scoreboard-api
        image: scoreboard-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

## Monitoring & Logging

### Metrics to Monitor

1. **Performance Metrics**
   - Response time (p50, p95, p99)
   - Throughput (requests per second)
   - Error rate
   - Database query performance

2. **Business Metrics**
   - Active users
   - Score updates per minute
   - Leaderboard changes
   - Top score values

3. **Infrastructure Metrics**
   - CPU and memory usage
   - Database connections
   - Redis memory usage
   - Network I/O

### Logging Strategy

```typescript
// Structured logging
logger.info('Score updated', {
  userId: request.userId,
  oldScore: result.oldScore,
  newScore: result.newScore,
  actionId: request.actionId,
  ipAddress: request.ipAddress,
  userAgent: request.userAgent,
  requestId: request.requestId
});
```

## Future Improvements

### Phase 2 Enhancements

1. **Advanced Security**
   - Multi-factor authentication
   - Device fingerprinting
   - Behavioral analysis for fraud detection
   - Blockchain-based score verification

2. **Enhanced Real-time Features**
   - Live user activity feed
   - Achievement notifications
   - Social features (friends, challenges)
   - Real-time chat

3. **Analytics & Insights**
   - Score trend analysis
   - User behavior analytics
   - Performance dashboards
   - A/B testing framework

4. **Scalability Improvements**
   - Event sourcing architecture
   - CQRS pattern implementation
   - GraphQL API
   - Mobile app support

### Technical Debt

1. **Code Quality**
   - Comprehensive test coverage
   - Code documentation
   - Static analysis tools
   - Performance profiling

2. **Infrastructure**
   - Infrastructure as Code
   - Automated deployment pipelines
   - Disaster recovery procedures
   - Security scanning

3. **Monitoring**
   - Advanced alerting
   - Distributed tracing
   - Performance monitoring
   - Security monitoring

---

## Implementation Checklist

### Phase 1 (MVP)
- [ ] Basic API endpoints
- [ ] Authentication system
- [ ] Database schema
- [ ] Score update logic
- [ ] Basic leaderboard
- [ ] Rate limiting
- [ ] Basic security measures

### Phase 2 (Real-time)
- [ ] WebSocket implementation
- [ ] Real-time leaderboard updates
- [ ] Caching layer
- [ ] Performance optimization

### Phase 3 (Production Ready)
- [ ] Comprehensive testing
- [ ] Monitoring and logging
- [ ] Deployment automation
- [ ] Security hardening
- [ ] Documentation

### Phase 4 (Advanced Features)
- [ ] Advanced analytics
- [ ] Social features
- [ ] Mobile optimization
- [ ] Advanced security

---

**Note**: This specification should be treated as a living document and updated as requirements evolve or new insights are gained during implementation. 