# Backend

This directory is reserved for Savora's shared backend services.

## Scope

- FastAPI API
- PostgreSQL database (local dev via docker-compose)
- recipe import and normalization
- pantry and meal planner data
- AI-assisted parsing and substitution orchestration

## Core Principle

The backend should serve multiple clients, but its earliest contracts must optimize for the mobile app's cooking loop.

## Known Limitations

- Refresh tokens are not currently revocable server-side (a stolen refresh token stays valid until it expires).
