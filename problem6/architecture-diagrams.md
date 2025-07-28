# Live Scoreboard API - Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Website/Client]
        B[Mobile App]
    end
    
    subgraph "Load Balancer Layer"
        C[Load Balancer]
    end
    
    subgraph "API Gateway Layer"
        D[API Gateway]
        E[Rate Limiter]
        F[Authentication]
    end
    
    subgraph "Application Layer"
        G[Scoreboard API]
        H[WebSocket Server]
        I[Authentication Service]
    end
    
    subgraph "Data Layer"
        J[PostgreSQL]
        K[Redis Cache]
        L[Audit Log]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    G --> J
    G --> K
    G --> L
    H --> K
    H --> G
```

## Score Update Flow

```mermaid
sequenceDiagram
    participant Client as Client
    participant LB as Load Balancer
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant API as Scoreboard API
    participant Cache as Redis Cache
    participant DB as PostgreSQL
    participant WS as WebSocket Server
    participant Audit as Audit Log

    Client->>LB: POST /api/v1/scores/update
    LB->>Gateway: Forward request
    Gateway->>Auth: Validate JWT token
    Auth->>Gateway: Token valid
    Gateway->>API: Rate limit check
    API->>Cache: Check rate limit
    Cache->>API: Rate limit OK
    API->>DB: Begin transaction
    API->>DB: SELECT score FOR UPDATE
    DB->>API: Current score
    API->>DB: UPDATE score
    API->>DB: INSERT score_history
    DB->>API: Transaction committed
    API->>Cache: Update leaderboard cache
    API->>WS: Broadcast score update
    WS->>Client: Emit 'score-updated'
    API->>Audit: Log score change
    API->>Client: Success response
```

## Real-time Leaderboard Flow

```mermaid
sequenceDiagram
    participant Client as Client
    participant WS as WebSocket Server
    participant Auth as Auth Service
    participant Cache as Redis Cache
    participant API as Scoreboard API
    participant DB as PostgreSQL

    Client->>WS: Connect with JWT
    WS->>Auth: Validate token
    Auth->>WS: Token valid
    WS->>Client: Connection established
    Client->>WS: Join 'leaderboard' room
    WS->>Cache: Get current leaderboard
    Cache->>WS: Leaderboard data
    WS->>Client: Send leaderboard data
    
    Note over API,DB: Score update occurs
    API->>Cache: Update leaderboard
    Cache->>WS: Notify leaderboard change
    WS->>Client: Broadcast 'leaderboard-update'
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client as Client
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant DB as PostgreSQL
    participant Cache as Redis Cache

    Client->>Gateway: POST /auth/login
    Gateway->>Auth: Forward login request
    Auth->>DB: Validate credentials
    DB->>Auth: User data
    Auth->>Auth: Generate JWT token
    Auth->>Cache: Store refresh token
    Auth->>Client: Return JWT token
    
    Note over Client,Gateway: Subsequent requests
    Client->>Gateway: Request with JWT
    Gateway->>Auth: Validate JWT
    Auth->>Client: Valid token response
```

## Security Flow

```mermaid
sequenceDiagram
    participant Client as Client
    participant Gateway as API Gateway
    participant API as Scoreboard API
    participant Cache as Redis Cache
    participant DB as PostgreSQL

    Client->>Gateway: Score update with signature
    Gateway->>API: Forward request
    API->>API: Validate request signature
    API->>Cache: Check rate limit
    Cache->>API: Rate limit status
    API->>DB: Update score with lock
    DB->>API: Update successful
    API->>DB: Log audit trail
    API->>Client: Success response
    
    Note over Client,Gateway: Malicious attempt
    Client->>Gateway: Invalid signature
    Gateway->>API: Forward request
    API->>API: Signature validation fails
    API->>Client: Unauthorized response
```

## Caching Strategy

```mermaid
graph LR
    subgraph "Cache Layers"
        A[Application Cache]
        B[Redis Cache]
        C[Database Cache]
    end
    
    subgraph "Cache Keys"
        D[LEADERBOARD:TOP10]
        E[USER:SCORE:userId]
        F[RATE_LIMIT:userId]
        G[WS:ROOM:LEADERBOARD]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
```

## Database Schema Relationships

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        timestamp created_at
        timestamp last_active
        boolean is_active
    }
    
    SCORES {
        uuid id PK
        uuid user_id FK
        bigint score
        timestamp last_updated
        integer version
    }
    
    SCORE_HISTORY {
        uuid id PK
        uuid user_id FK
        bigint old_score
        bigint new_score
        integer increment
        varchar action_id
        varchar action_type
        inet ip_address
        text user_agent
        timestamp created_at
    }
    
    LEADERBOARD_CACHE {
        integer rank PK
        uuid user_id FK
        varchar username
        bigint score
        timestamp last_updated
    }
    
    USERS ||--o{ SCORES : has
    USERS ||--o{ SCORE_HISTORY : generates
    USERS ||--o{ LEADERBOARD_CACHE : appears_in
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Load Balancer Tier"
            LB1[Load Balancer 1]
            LB2[Load Balancer 2]
        end
        
        subgraph "Application Tier"
            API1[API Instance 1]
            API2[API Instance 2]
            API3[API Instance 3]
            WS1[WebSocket Instance 1]
            WS2[WebSocket Instance 2]
        end
        
        subgraph "Data Tier"
            DB1[(PostgreSQL Primary)]
            DB2[(PostgreSQL Replica)]
            REDIS1[(Redis Master)]
            REDIS2[(Redis Replica)]
        end
        
        subgraph "Monitoring Tier"
            MON1[Prometheus]
            MON2[Grafana]
            MON3[ELK Stack]
        end

        subgraph "Monitoring Tier"
            MON1[Prometheus]
            MON2[Grafana]
            MON3[Logging monitor (ELK|PLG Stack)]
        end
    end
    
    LB1 --> API1
    LB1 --> API2
    LB1 --> API3
    LB2 --> WS1
    LB2 --> WS2
    
    API1 --> DB1
    API2 --> DB1
    API3 --> DB1
    WS1 --> REDIS1
    WS2 --> REDIS1
    
    DB1 --> DB2
    REDIS1 --> REDIS2
    
    API1 --> MON1
    API2 --> MON1
    API3 --> MON1
    API1 --> MON3
    API2 --> MON3
    API3 --> MON3
    MON1 --> MON2
```

## Error Handling Flow

```mermaid
flowchart TD
    A[Request Received] --> B{Authentication Valid?}
    B -->|No| C[Return 401 Unauthorized]
    B -->|Yes| D{Rate Limit Exceeded?}
    D -->|Yes| E[Return 429 Too Many Requests]
    D -->|No| F{Signature Valid?}
    F -->|No| G[Return 401 Invalid Signature]
    F -->|Yes| H{Score Increment Valid?}
    H -->|No| I[Return 400 Invalid Increment]
    H -->|Yes| J[Update Score]
    J --> K{Update Successful?}
    K -->|No| L[Return 500 Database Error]
    K -->|Yes| M[Update Cache]
    M --> N[Broadcast Update]
    N --> O[Log Audit Trail]
    O --> P[Return 200 Success]
```

## Performance Monitoring Flow

```mermaid
sequenceDiagram
    participant App as Application
    participant Metrics as Metrics Collector
    participant Prometheus as Prometheus
    participant Grafana as Grafana
    participant Alert as Alert Manager

    App->>Metrics: Emit performance metrics
    Metrics->>Prometheus: Store metrics
    Prometheus->>Grafana: Provide metrics data
    Grafana->>Grafana: Generate dashboards
    
    loop Monitoring
        Prometheus->>Alert: Check alert rules
        Alert->>Alert: Evaluate conditions
        alt Alert triggered
            Alert->>Alert: Send notification
        end
    end
```

## Security Monitoring Flow

```mermaid
flowchart TD
    A[Request Logged] --> B{Pattern Analysis}
    B --> C{Suspicious Activity?}
    C -->|Yes| D[Flag for Review]
    C -->|No| E[Continue Processing]
    D --> F[Generate Alert]
    F --> G[Log Security Event]
    G --> H[Update Threat Score]
    H --> I{Threat Score > Threshold?}
    I -->|Yes| J[Block User/IP]
    I -->|No| K[Monitor Closely]
    J --> L[Notify Security Team]
    K --> M[Continue Monitoring]
```

## Scalability Considerations

```mermaid
graph TB
    subgraph "Current Architecture"
        A1[Single API Instance]
        B1[Single Database]
        C1[Single Redis]
    end
    
    subgraph "Scaled Architecture"
        A2[Multiple API Instances]
        B2[Database Cluster]
        C2[Redis Cluster]
        D2[Load Balancer]
        E2[CDN]
    end
    
    A1 --> A2
    B1 --> B2
    C1 --> C2
    A2 --> D2
    A2 --> E2
```

---

## Key Design Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Fault Tolerance**: System continues to operate even if some components fail
3. **Scalability**: Architecture supports horizontal scaling
4. **Security**: Multiple layers of security validation
5. **Performance**: Caching and optimization at multiple levels
6. **Monitoring**: Comprehensive observability and alerting
7. **Audit Trail**: Complete logging of all score changes
8. **Real-time Updates**: WebSocket-based live updates 