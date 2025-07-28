# 99Tech Code Challenge - Live Scoreboard API

## About Me

Hello! I'm Kevin, a passionate software engineer with expertise in building scalable, high-performance web applications. I specialize in:

- **Backend Development**: Node.js, TypeScript, Python, Go
- **Database Design**: PostgreSQL, Redis, MongoDB
- **System Architecture**: Microservices, Event-driven architecture, CQRS
- **DevOps & Cloud**: Docker, Kubernetes, AWS, CI/CD
- **Testing**: Unit testing, integration testing, E2E testing
- **Performance Optimization**: Caching strategies, database optimization, load balancing

I believe in writing clean, maintainable code and designing systems that can scale with business growth. This code challenge demonstrates my approach to solving complex problems with practical, production-ready solutions.

## Project Overview

This repository contains my solutions for the 99Tech Live Scoreboard API code challenge. The challenge involved building a real-time scoreboard system with the following requirements:

- **Real-time Updates**: WebSocket-based live score updates
- **Security**: Authentication, rate limiting, and fraud prevention
- **Scalability**: Handle high concurrent users and score updates
- **Performance**: Fast response times and efficient caching
- **Reliability**: Robust error handling and data consistency

## Problem Solutions & Time Spent

### Problem 4: Three Ways to Sum to N (1 hour)
**Location**: `problem4/`

**Solution**: Implemented three different approaches to calculate the sum of numbers from 1 to n:
1. **Brute Force**: Using array methods and reduce
2. **Recursive**: Using recursion to sum numbers
3. **Mathematical**: Using Gauss's formula for optimal performance

**Key Features**:
- Three different algorithmic approaches
- Performance comparison between methods
- Comprehensive test suite with edge cases
- Mathematical optimization with Gauss's formula

**Time Breakdown**:
- Problem analysis and research: 15 minutes
- Implementation: 30 minutes
- Testing & optimization: 15 minutes

### Problem 5: A Crude Server (6 hours)
**Location**: `problem5/`

**Solution**: Built a simply REST API server for task management with CRUD operations.

**Key Features**:
- Express.js with TypeScript
- PostgreSQL database with Prisma ORM
- Logging middleware
- Transform Response middleware
- Task CRUD operations (Create, Read, Update, Delete)
- Comprehensive error handling
- Docker containerization
- E2E testing with Jest

**Time Breakdown**:
- Project setup & architecture: 0.5 hour
- Database design & Prisma setup: 0.5 hour
- Core API endpoints: 2 hours
- Testing & debugging: 1 hour
- Fix bug and improve test case 2 hour

### Problem 6: Architecture (4 hours)
**Location**: `problem6/`

**Solution**: Comprehensive system design documentation including architecture diagrams, implementation guide, and scalability considerations.

**Key Features**:
- Detailed system architecture diagrams (Mermaid)
- Security and performance analysis
- Scalability strategies
- Implementation roadmap
- Risk mitigation plans

**Time Breakdown**:
- Architecture design: 1.5 hours
- Diagram creation: 1.5 hours
- Implementation guide: 1 hour

## Total Time Spent: 11 hours

#

## Getting Started

### Prerequisites
- Node.js 24
- PostgreSQL 16
- Redis 8
- Docker
- pnpm 10

### ⚠️ Important: Install pnpm via Corepack
Before running the project, make sure to install pnpm using Node.js corepack:

```bash
# Enable corepack (comes with Node.js 16.10+)
corepack enable

# Install pnpm
corepack prepare pnpm@latest-10 --activate
```

**Note**: Do not install pnpm via npm (`npm install -g pnpm`) as it may cause version conflicts. Always use corepack for package manager installation.

### Quick Start
```bash
# Clone the repository
git clone https://github.com/79nivek/99tech_code_challenge
cd 99tech_code_challeng

# Problem 4 - Algorithm
cd problem4
pnpm install
## Run test
pnpm problem4:test
## Run benchmark
pnpm problem4:benchmark

# Problem 5 - API
cd ../problem5
pnpm install
docker-compose up -d

# Problem 6 - Documentation
# Open problem6/README.md for architecture overview
```

## Project Structure

```
99tech_code_challenge/
├── problem4/          # Algorithm implementation
│   ├── src/          # Source code
├── problem5/          # REST API with WebSocket
│   ├── src/          # Source code
│   ├── e2e/          # End-to-end tests
│   ├── docker/       # Docker configuration
│   └── prisma/       # Database schema
└── problem6/          # System design documentation
    ├── README.md     # Architecture overview
    ├── architecture-diagrams.md
    └── implementation-guide.md
```

## Contact

I'm excited about the opportunity to contribute to your team and would love to discuss this implementation or any other technical challenges. Feel free to reach out with questions or feedback!

---

**Note**: This implementation represents my best effort within the given time constraints. In a real-world scenario, I would collaborate with the team to refine requirements and iterate on the solution based on feedback and changing needs.
