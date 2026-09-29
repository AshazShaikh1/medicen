# Development Roadmap

Build the project incrementally. Keep each phase working before moving to the next.

## Phase 1 — Project Setup
- Create Next.js project with TypeScript
- Configure Tailwind CSS
- Set up Supabase project
- Configure environment variables
- Establish clean folder structure
- Create base layout/navigation

## Phase 2 — Authentication
- Supabase authentication
- Register
- Login
- Logout
- Protected application routes
- Basic user profile handling

## Phase 3 — Database
Create the core tables:
- users/profiles
- medicines
- reminders
- notifications

Add appropriate relationships and security policies.

## Phase 4 — Medicine Management
- Add medicine
- View medicine list
- Edit medicine
- Delete medicine
- Store name, quantity, batch number, category and expiry date
- Validation

## Phase 5 — Expiry Tracking
- Calculate remaining days
- Active status
- Expiring-soon status
- Expired status
- Sorting/filtering by expiry status

## Phase 6 — Dashboard
Show:
- Total medicines
- Active medicines
- Expiring-soon medicines
- Expired medicines
- Useful upcoming-expiry information

## Phase 7 — Reminders & Notifications
- Configurable reminder period
- Generate reminders for approaching expiry
- Store reminder status
- Store notification history
- Implement the simplest reliable notification method first

## Phase 8 — Search & Reports
- Search medicines
- Filter medicines
- Basic expiry summary/report

## Phase 9 — Polish & Testing
- Responsive UI
- Loading/error/empty states
- Form validation
- Security checks
- Test expiry calculations
- Test reminder logic
- Fix bugs

## Phase 10 — Final Demo
- Add realistic sample data
- Verify complete user flow
- Clean UI
- Prepare project documentation
- Prepare demo/presentation

## Agent Rule
Do not jump ahead unnecessarily. Finish and verify the current phase before starting major work in the next phase.
