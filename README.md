# Chillax

**A full-stack social media platform built with the MERN stack, Socket.io real-time messaging, and a production-grade security layer.**

> Built from scratch. Every line of code written by hand, no boilerplate generators, no starter kits.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-27187e?style=flat-square)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-27187e?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-27187e?style=flat-square)

-----

## What it is

Chillax is a social platform where people post, connect, and chat in real time. It covers the full surface area of a modern social app: authentication, a live feed, follow relationships, notifications, direct messaging with typing indicators, dark mode, and a responsive mobile layout with a bottom navigation bar.

The goal was to build something that works like a real product, not a tutorial project. That means proper security middleware, paginated APIs, optimistic UI updates, lazy-loaded routes, and a deployable production build.

-----

## Live Demo

**Frontend:** [chillax-web-ruddy.vercel.app](https://chillax-web-ruddy.vercel.app)  
**API:** [chillaxweb-api.onrender.com](https://chillax-api.onrender.com/health)

-----

## Feature Overview

**Core social features**

- Register and log in with JWT authentication
- Create text and image posts (URL-based)
- Like, comment, and delete posts
- Infinite scroll feed powered by paginated API and IntersectionObserver
- Follow and unfollow users
- User profiles with cover photo, bio, avatar, follower and following counts

**Real-time layer (Socket.io)**

- Direct messaging with instant delivery
- Typing indicators with animated dots
- Online and offline presence detection
- Live notifications for likes, comments, and follows
- Optimistic message rendering replaced by server confirmation

**UX and design**

- Dark mode with system preference detection and local persistence
- Mobile-first layout with a fixed bottom navigation bar
- Responsive 3-column desktop layout that collapses gracefully
- Skeleton loading screens while data fetches
- Framer Motion animations on post cards, auth pages, and page transitions
- Barlow Condensed font with a custom `#27187e` and `#f7f7ff` color system

**Pages**

- Landing page with parallax hero, feature grid, and testimonials
- Feed, Explore, Notifications, Messages, Profile, Settings
- Edit profile form with live avatar preview
- Password change with bcrypt re-hash

-----

## Tech Stack

|Layer       |Technology                                                         |
|------------|-------------------------------------------------------------------|
|Frontend    |React 18, Vite, React Router v6                                    |
|State       |Zustand with persistence middleware                                |
|Server state|TanStack Query (React Query v5)                                    |
|Animations  |Framer Motion                                                      |
|Backend     |Node.js, Express 5                                                 |
|Database    |MongoDB Atlas, Mongoose 8                                          |
|Real-time   |Socket.io 4                                                        |
|Auth        |JWT, bcryptjs (salt rounds: 12)                                    |
|Security    |Helmet, custom XSS sanitizer, express-rate-limit, express-validator|
|Deployment  |Vercel (frontend), Render (backend)                                |

-----

## Security Implementation

This is the part most portfolio projects skip. Chillax does not.

**NoSQL injection prevention** via a recursive sanitizer that strips MongoDB operators (`$where`, `$gt`, etc.) from all incoming request bodies and params before they touch the database.

**XSS protection** via a custom middleware built on the `xss` package that sanitizes every string value recursively across `req.body`. React renders content as text by default, so there is no `dangerouslySetInnerHTML` anywhere in the codebase.

**Rate limiting** with two tiers: 100 requests per hour per IP on general API routes, and 10 requests per 15 minutes on auth routes to prevent brute force attacks. Both use `express-rate-limit` with proxy-aware IP detection for Codespaces and cloud environments.

**Hardened HTTP headers** via `helmet` with a custom Content Security Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` for HTTPS enforcement.

**Account enumeration prevention:** the login endpoint returns the same error message for a wrong email and a wrong password. An attacker cannot use the response to determine whether an account exists.

**JWT secrets** are 64-character random hex strings generated with Node’s `crypto` module, stored in environment variables, and never logged.

**Body size limits** are set to 10kb on all JSON and URL-encoded payloads to prevent denial-of-service via oversized request bodies.

**Socket.io authentication middleware** verifies the JWT token before allowing a WebSocket connection. Unauthenticated sockets are rejected at the handshake level.

-----

## Project Structure

```
chillax/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── api/              # Axios instance with JWT interceptors
│   │   ├── components/
│   │   │   ├── feed/         # PostCard, CreatePost, CommentSection, FeedList, Skeletons
│   │   │   ├── layout/       # Sidebar, RightPanel, BottomNav
│   │   │   └── ui/           # Avatar, InputField, Spinner
│   │   ├── context/          # SocketContext (real-time layer)
│   │   ├── hooks/            # usePosts, useUsers (React Query wrappers)
│   │   ├── pages/            # Feed, Profile, Explore, Notifications, Messages, Settings, Landing
│   │   ├── store/            # authStore, themeStore (Zustand)
│   │   └── styles/           # global.css with CSS custom properties
│   └── public/               # favicon.svg, manifest.json
│
└── server/                   # Express backend
    ├── config/               # MongoDB connection
    ├── controllers/          # auth, posts, users, notifications, messages
    ├── middleware/            # auth, rateLimiter, sanitize, errorHandler, securityHeaders
    ├── models/               # User, Post, Notification, Message
    └── routes/               # auth, posts, users, notifications, messages
```

-----

## API Reference

**Auth**

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/change-password
```

**Posts**

```
GET    /api/posts/feed?page=1&limit=10
POST   /api/posts
PUT    /api/posts/:id/like
POST   /api/posts/:id/comment
DELETE /api/posts/:id
DELETE /api/posts/:postId/comment/:commentId
```

**Users**

```
GET    /api/users/search?q=query
GET    /api/users/suggestions
GET    /api/users/:username
PUT    /api/users/:id/follow
PUT    /api/users/profile/update
```

**Notifications**

```
GET    /api/notifications
GET    /api/notifications/unread-count
PUT    /api/notifications/read-all
```

**Messages**

```
GET    /api/messages/conversations
GET    /api/messages/unread-count
GET    /api/messages/:userId
POST   /api/messages/:userId
```

-----

## Socket.io Events

|Event             |Direction       |Description                                   |
|------------------|----------------|----------------------------------------------|
|`message:send`    |Client to server|Send a direct message                         |
|`message:receive` |Server to client|Deliver a message to recipient                |
|`message:sent`    |Server to client|Confirm delivery to sender, replace optimistic|
|`typing:start`    |Client to server|User started typing                           |
|`typing:stop`     |Client to server|User stopped typing                           |
|`user:online`     |Server to client|Broadcast presence on connect                 |
|`user:offline`    |Server to client|Broadcast presence on disconnect              |
|`notification:new`|Server to client|Push a live notification                      |

-----

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB Atlas account

**Clone the repo**

```bash
git clone https://github.com/Aisha-Aliyu/social-media-app.git
cd social-media-app
```

**Backend setup**

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm run dev
```

**Frontend setup**

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm run dev
```

**Generate a secure JWT secret**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

-----

## Environment Variables

**server/.env**

```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/chillax
JWT_SECRET=your_64_char_hex_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**client/.env**

```
VITE_API_URL=http://localhost:5000/api
```

-----

## Deployment

**Frontend on Vercel**

Connect the repo, set the root directory to `client`, and add the `VITE_API_URL` environment variable pointing to your Render backend URL. The `vercel.json` file handles SPA routing so refreshing any route works correctly.

**Backend on Render**

Create a Web Service, set the root directory to `server`, build command `npm install`, start command `node index.js`. Add all server environment variables in the Render dashboard. Set `NODE_ENV=production` and update `CLIENT_URL` to your Vercel URL.

-----

## Design Decisions

**Why plain CSS-in-JS over Tailwind or a component library?**  
Full control over every pixel. The design system lives in CSS custom properties and gets swapped at runtime for dark mode without a page reload or class toggle. No build step dependency on a CSS framework.

**Why Zustand over Redux?**  
Redux is the right tool for apps with deeply nested shared state across many slices. For this project, two stores (auth and theme) handle everything. Zustand gets it done in fewer lines with less ceremony and built-in `persist` middleware.

**Why TanStack Query alongside Zustand?**  
Zustand handles client state (who is logged in, what theme is active). TanStack Query handles server state (the feed, profiles, conversations). They solve different problems. Using one for both leads to either cache management headaches or bloated stores.

**Why JWT over sessions?**  
The app is stateless by design. JWTs work naturally with Socket.io authentication at the handshake level, which sessions would complicate. Tokens are stored in localStorage with an Axios interceptor that attaches them to every request and redirects to login on a 401.

**Why not use a third-party auth provider?**  
Building it from scratch demonstrates understanding of the full auth flow: hashing, salting, token generation, expiry, refresh, and secure comparison. A provider abstracts all of that away.

-----

## What I learned building this

Handling Socket.io authentication at the middleware level (not just in route handlers) was one of the harder problems. The solution was verifying the JWT during the socket handshake using `io.use()`, which means unauthenticated connections never reach any event handler at all.

The optimistic message UI required careful coordination between the local state update, the socket emit, and the server confirmation event that replaces the temporary message with the real one. Getting the tempId reconciliation right took a few iterations.

Dark mode via CSS custom properties instead of a class toggle meant the theme applies instantly with no flash on load, and works independently of React’s render cycle.

Building the rate limiter to work correctly behind a reverse proxy (Codespaces, Render) required setting `trust proxy: 1` on the Express app and writing a custom `keyGenerator` that reads the forwarded IP correctly instead of seeing every request come from the same proxy address.

-----

## Author

**Aisha Aliyu (Hums)**  
Founder, BLOODLINE Studios  
Fullstack Software Engineer and Aspiring Roboticist

[GitHub](https://github.com/Aisha-Aliyu) · [Portfolio](https://humairah.netlify.app) · [LinkedIn](https://linkedin.com/in/aisha-aliyu-dev)

-----

## License

MIT. Build on it, learn from it, ship something.
