# Technology Stack

## Final Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- TypeScript

### Backend / Platform
- Supabase

Use Supabase for:
- PostgreSQL database
- Authentication
- Server-side/backend functionality where appropriate
- Data access and persistence

### Development
- VS Code
- Git
- GitHub

## Important Rule
Do not introduce another framework or database unless there is a clear technical reason and the change is explicitly approved.

## Architecture
Next.js + Tailwind
        ↓
Supabase
        ↓
PostgreSQL

Authentication and database access should be designed around Supabase.

## Priority
Keep the stack simple. This is a student project, so avoid unnecessary infrastructure and dependencies.
