# Database Plan

## Core Entities

### profiles
Stores application user/profile information.

Suggested fields:
- id
- name
- email
- created_at

### medicines
Stores medicine records belonging to a user.

Suggested fields:
- id
- user_id
- medicine_name
- batch_number
- expiry_date
- quantity
- category
- created_at
- updated_at

### reminders
Stores reminder configuration and status.

Suggested fields:
- id
- medicine_id
- reminder_date
- status
- channel
- created_at

### notifications
Stores generated notification history.

Suggested fields:
- id
- reminder_id
- message
- sent_at
- status

## Relationships
profiles 1 → N medicines
medicines 1 → N reminders
reminders 1 → N notifications

## Security
Medicine, reminder, and notification records must be protected so users can access only records belonging to them.

Use Supabase Row Level Security policies.

## Important
Treat this as the initial database plan. Before implementation, verify field names, constraints, indexes, relationships, and RLS policies against the actual application requirements.
