<============ PromptVerse ===========>

AI Prompt Marketplace — Discover, create, and share AI prompts across categories like Writing, Coding, Marketing, and Design.

<== Live URL ==>

**Frontend:** [https://promptverse-client-beta.vercel.app](https://promptverse-client-beta.vercel.app)

**Backend:** [https://promptverse-server-kfuw.onrender.com](https://promptverse-server-kfuw.onrender.com)

<=== Key Features ===>

**Prompt Discovery**  Search, filter, and browse prompts by category, AI tool, and difficulty level
**Live AI Testing**  Test prompts directly against ChatGPT, Gemini, Claude, and Copilot
**Rich Text Editor**  Create and publish prompts with formatting support
**Reviews & Ratings**  Star ratings and comments on prompts
**Fork & Customize**  Clone and modify existing prompts
**Bookmark System**  Save prompts for later use
**Premium Subscription**  Stripe-powered lifetime access for premium content
**Dark/Light Theme**  Toggle between themes with glassmorphism design
**Real-Time Notifications**  Socket.io powered instant updates
**PDF Export**  Export prompts as PDF documents
**Social Sharing**  Share prompts on Twitter, Facebook, LinkedIn, WhatsApp
**Three-Role System**  User, Creator, and Admin roles with dashboards
**Responsive Design**  Mobile-first UI built with Tailwind CSS and DaisyUI

## Tech Stack (Client)

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework (App Router) |
| React 19 | UI library |
| TypeScript 6 | Type safety |
| Tailwind CSS 4 | Utility-first styling |
| DaisyUI 5 | Component library |
| Framer Motion | Animations & page transitions |
| TanStack React Query | Server-state management |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Axios | HTTP client with JWT interceptors |
| Firebase Auth | Google OAuth |
| Socket.io Client | Real-time communication |
| React Quill | Rich text editor |
| React Markdown | Markdown rendering |
| Recharts | Charts & analytics |
| React Hot Toast | Toast notifications |

## NPM Packages (Client)

### Production Dependencies

```
next@^16.2.9
react@^19.2.7
react-dom@^19.2.7
@tanstack/react-query@^5.101.1
axios@^1.18.1
firebase@^12.15.0
@stripe/stripe-js@^9.8.0
@stripe/react-stripe-js@^6.6.0
framer-motion@^12.41.0
react-hook-form@^7.80.0
@hookform/resolvers@^5.4.0
zod@^4.4.3
socket.io-client@^4.8.3
react-quill-new@^3.8.3
react-markdown@^10.1.0
remark-gfm@^4.0.1
rehype-raw@^7.0.0
react-hot-toast@^2.6.0
react-icons@^5.6.0
recharts@^3.9.0
html2canvas@^1.4.1
jspdf@^4.2.1
clsx@^2.1.1
```

### Dev Dependencies

```
typescript@^6.0.3
tailwindcss@^4.3.1
daisyui@^5.5.23
postcss@^8.5.15
autoprefixer@^10.5.2
@tailwindcss/postcss@^4.3.1
@tailwindcss/typography@^0.5.20
@types/node@^26.0.1
@types/react@^19.2.17
@types/react-dom@^19.2.3
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run development server: `npm run dev`

## License

MIT
