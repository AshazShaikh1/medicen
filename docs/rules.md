# AI Agent Rules

## General
1. Read all project documentation before making changes.
2. Follow `idea.md`, `stack.md`, and `roadmap.md` as the source of truth.
3. Do not invent features that are outside the project scope.
4. Keep the implementation simple and student-project appropriate.
5. Do not add unnecessary libraries, services, or architecture.

## Stack
6. Use Next.js + TypeScript + Tailwind CSS.
7. Use Supabase for authentication and database functionality.
8. Do not replace Supabase with another backend/database.
9. Avoid unnecessary state-management libraries unless genuinely required.

## Code Quality
10. Keep components modular and readable.
11. Use clear naming.
12. Avoid duplicated logic.
13. Keep business logic separate from UI where practical.
14. Validate user input.
15. Handle loading, error, and empty states.
16. Never hard-code secrets or API keys.
17. Use environment variables for Supabase configuration.

## Supabase / Security
18. Design database relationships carefully.
19. Use Row Level Security where appropriate.
20. Users must only access their own medicine-related records.
21. Never expose Supabase service-role secrets to the client.

## UI
22. Use Tailwind CSS consistently.
23. Keep the interface clean, responsive, and easy for ordinary users.
24. Prioritize usability over unnecessary animations or visual complexity.

## Medicine Logic
25. Expiry calculations must be date-accurate.
26. Clearly distinguish active, expiring-soon, and expired medicines.
27. Do not provide medical advice or treatment recommendations.
28. The application is an expiry-management/reminder tool, not a medical decision system.

## Working Method
29. Before coding, inspect the existing implementation.
30. Make small, focused changes.
31. Do not rewrite working code without a reason.
32. Test important functionality after implementation.
33. If a requirement is ambiguous, inspect the project documents first rather than guessing.
