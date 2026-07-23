# DraftBox

A mini blog platform with JWT-based authentication and an editorial approval workflow, built to learn and practice Spring Security fundamentals: authentication, role-based authorization, and ownership-based access control.

**Live app:** [https://draft-box-ruddy.vercel.app/login](https://draft-box-ruddy.vercel.app/login)
**Backend API:** `https://draftbox-production.up.railway.app`

---

## What it does

DraftBox is a two-role blog platform:

- **Writers (`USER` role)** can write articles (saved as `DRAFT`), submit their own drafts for review, and view their own articles regardless of status.
- **Editors (`ADMIN` role)** review the queue of submitted articles and either publish or reject them.
- Anyone logged in can browse the public feed of `PUBLISHED` articles.

Articles move through a status lifecycle: `DRAFT` → `PENDING_REVIEW` → `PUBLISHED` or `REJECTED`.

## Why this project exists

This was built as a second, from-scratch practice project after implementing JWT authentication and role-based access in a larger Student Result Management System. The goal was to reinforce the same concepts in a smaller, faster-to-build app, and to specifically practice a pattern the first project didn't cover: **ownership-based authorization** — checking not just "what role is this user" but "does this specific record belong to this specific user."

## Tech stack

**Backend:** Spring Boot 4, Spring Security, Spring Data JPA, PostgreSQL, JJWT (JSON Web Tokens), Maven
**Frontend:** React (Vite), Tailwind CSS, React Router, Axios
**Deployment:** Railway (backend + Postgres), Vercel (frontend)

## Authentication & authorization architecture

The backend implements a complete JWT authentication system from scratch:

1. **`User` entity** implementing Spring Security's `UserDetails`, with a `Role` enum (`ADMIN`, `USER`)
2. **BCrypt** password hashing via a `PasswordEncoder` bean
3. **`JwtService`** — signs and verifies tokens using HMAC-SHA, embedding the user's role as a custom claim
4. **`JwtAuthFilter`** — a custom `OncePerRequestFilter` that validates the `Authorization: Bearer <token>` header on every request and populates Spring Security's `SecurityContextHolder`
5. **`SecurityConfig`** — defines public vs. authenticated routes, wires the JWT filter into the security filter chain, and enables method-level security

On top of authentication, two authorization layers are combined:

- **Role-based access**, enforced declaratively with `@PreAuthorize("hasRole('ADMIN')")` on endpoints like publish/reject/pending-review — Spring Security handles this before the method body runs.
- **Ownership-based access**, implemented explicitly in the service layer: a writer can only submit *their own* drafts for review, verified by comparing the authenticated user's ID against the article's author ID. This isn't something a framework annotation can express on its own, since it depends on the specific record being accessed.

## API overview

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/auth/register` | POST | Public | Create an account |
| `/auth/login` | POST | Public | Log in, receive a JWT |
| `/api/articles` | POST | Any authenticated user | Create a new draft article |
| `/api/articles` | GET | Any authenticated user | View all published articles |
| `/api/articles/mine` | GET | Any authenticated user | View your own articles (any status) |
| `/api/articles/{id}/submit` | PATCH | Article's author only | Submit a draft for review |
| `/api/articles/pending` | GET | `ADMIN` only | View articles awaiting review |
| `/api/articles/{id}/publish` | PATCH | `ADMIN` only | Publish a pending article |
| `/api/articles/{id}/reject` | PATCH | `ADMIN` only | Reject a pending article |

## Running locally

**Backend:**
```bash
cd DraftBox-backend
# Set environment variables (or rely on the local defaults in application.yml):
# DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd DraftBox-frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:8080` by default (configurable via `VITE_API_BASE_URL`).

## What I'd add next

- Link `User` accounts to their own record more explicitly for finer-grained "view only your own X" patterns elsewhere in the app
- Email notifications when an article is published or rejected
- Pagination on the public feed
