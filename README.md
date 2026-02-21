# PotatoVotes 🥔

A fun, mobile-first voter card generator that lets users create beautiful election guide cards and share them on social media. Built with Next.js 14, TypeScript, Tailwind CSS, and the HTML5 Canvas API.

## 🎯 What It Does

PotatoVotes lets users:
- Fill out their voting picks (candidates, measures, decisions)
- Select from 5 different potato avatars
- Generate a 1080×1920px social media image in real-time as they type
- Download the card as PNG
- Share directly to Instagram, TikTok, Twitter, and messaging apps (on mobile)

**Target Audience**: Mobile users sharing to Instagram Stories, TikTok, and Twitter.

## ✨ Key Features

- 📱 **Mobile-First Design**: Optimized for phone screens with sticky action buttons
- 🎨 **Live Preview**: Updates in real-time (300ms debounce) as users type
- 🔐 **Private & Secure**: All processing happens client-side; nothing is stored
- ♿ **Fully Accessible**: WCAG compliant with screen reader support
- 🛡️ **Security Headers**: XSS/CSRF protection, CSP, Permissions-Policy
- 🥔 **Fun**: Choose your potato! 5 different designs included
- 📤 **Web Share API**: Native mobile sharing to any app (SMS, WhatsApp, etc.)

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ (check with `node --version`)
- **npm** or **yarn** (npm comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd wethepotato-singleton

# 2. Install dependencies
npm install

# 3. Set up environment (optional)
cp .env.example .env.local

# 4. Run the development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:3000
```

### Building for Production

```bash
# Build the project
npm run build

# Start the production server
npm run start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (landing)
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── VoterCardGenerator.tsx    # Main component (state, live preview)
│   ├── VoterCardForm.tsx         # Form inputs (name, title, rows)
│   ├── VoterCardPreview.tsx      # Canvas preview + download/share
│   └── ShareButton.tsx           # Mobile Web Share API integration
│
└── lib/                   # Utilities & constants
    ├── drawCard.ts       # Canvas drawing logic with error handling
    ├── types.ts          # TypeScript interfaces
    └── constants.ts      # Config (canvas size, char limits, potato images)

public/
└── og-image.svg          # Social media preview image (1200×630px)

.env.example              # Environment variable template
.gitignore               # Git exclusions
next.config.mjs          # Next.js config with security headers
tsconfig.json            # TypeScript config
tailwind.config.ts       # Tailwind CSS config
postcss.config.mjs       # PostCSS config
```

## 🏗️ Architecture Overview

### Data Flow

```
User Input (Form)
    ↓
VoterCardGenerator (state management)
    ↓
useEffect (debounced 300ms)
    ↓
drawCard() (Canvas drawing)
    ↓
VoterCardPreview (display + actions)
    ↓
Download / Share
```

### Key Components

#### **VoterCardGenerator** (Main Container)
- Manages form state (`VoterCardData`)
- Implements 300ms debounce for live preview
- Handles errors and loading states
- Auto-scrolls to preview on mobile

#### **VoterCardForm** (User Input)
- Inputs: name, election title, voting rows
- Buttons: add/remove rows, swap potato, generate (sticky on mobile)
- Error banner display
- Form validation via HTML attributes

#### **VoterCardPreview** (Output)
- Canvas element showing live preview
- Download PNG button
- Mobile-only Share button (Web Share API)
- Loading and error states

#### **drawCard()** (Canvas Drawing)
- Draws 1080×1920px PNG to canvas
- Handles missing potato images with fallback
- Error handling: canvas context check, image load timeout

## 🎨 Customization Guide

### Adding a New Potato Image

1. **Add image file**: Place PNG (500×500px recommended) in `public/images/potatoes/`
   - Name it `p6.png` (sequential numbering)

2. **Update constants**: Edit `src/lib/constants.ts`:
   ```typescript
   export const POTATO_IMAGES = [
     "/images/potatoes/p1.png",
     "/images/potatoes/p2.png",
     "/images/potatoes/p3.png",
     "/images/potatoes/p4.png",
     "/images/potatoes/p5.png",
     "/images/potatoes/p6.png",  // ← Add this
   ] as const;
   ```

3. **Done!** The randomizer will automatically pick from the new array.

### Changing Canvas Size

Edit `src/lib/constants.ts`:
```typescript
export const CANVAS_WIDTH = 1080;  // Adjust here
export const CANVAS_HEIGHT = 1920; // Adjust here
```

Then update `public/og-image.svg` dimensions to match for consistency.

### Modifying Colors

1. **Canvas colors**: Edit `src/lib/drawCard.ts` (hardcoded in drawing logic)
2. **UI colors**: Edit `src/components/*.tsx` (Tailwind classes)
3. **Brand colors**: Update `tailwind.config.ts` if needed

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Desktop**: Form → generates card → can download
- [ ] **Mobile**: Form sticky button → card updates live → can download/share
- [ ] **Error handling**: Try missing potato image → should show emoji fallback
- [ ] **Canvas error**: Open in older browser → should show user-friendly error
- [ ] **Accessibility**: Tab through form → all inputs reachable
- [ ] **Screen reader**: Use VoiceOver/NVDA → can navigate and understand content

## 🔒 Security & Privacy

### Client-Side Only
- ✅ All processing happens in the browser
- ✅ No data is sent to any server
- ✅ No analytics, tracking, or cookies
- ✅ Canvas data never leaves the device

### Security Headers (Implemented)
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Content-Security-Policy` - Restricts script/resource loading
- `Permissions-Policy` - Blocks unnecessary APIs (camera, mic, geolocation)

### Environment Variables
- ✅ All sensitive keys in `.env.local` (not committed)
- ✅ `.env.example` shows what variables are available
- ✅ Only `NEXT_PUBLIC_*` variables exposed to frontend

## ♿ Accessibility

The app meets **WCAG 2.1 AA** standards:

- ✅ All form inputs have associated labels (visible or hidden)
- ✅ Canvas has `role="img"` and descriptive `aria-label`
- ✅ Error messages use `role="alert"` for screen readers
- ✅ Live preview updates announced with `aria-live="polite"`
- ✅ All buttons have `aria-label` descriptions
- ✅ Full keyboard navigation support
- ✅ Proper heading hierarchy and semantic HTML

Test with:
- **Screen reader**: VoiceOver (Mac), NVDA (Windows), or TalkBack (Android)
- **Keyboard**: Tab through the entire form without a mouse

## 📊 Performance Tips

### Current Optimizations
- ✅ Live preview uses 300ms debounce (prevents excessive redraws)
- ✅ Canvas only redraws when data changes
- ✅ Images use blob URLs (not re-fetched)
- ✅ ShareButton only renders on mobile (Web Share API available)

### Further Optimizations
- Consider lazy-loading `shareButton` with dynamic import
- Memoize expensive calculations with `useMemo`
- Use `useCallback` for event handlers passed to child components

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Canvas not appearing | Check browser console for "Canvas not supported" error; use modern browser |
| Potato image missing | Verify file exists at `public/images/potatoes/pX.png`; will show emoji fallback |
| Form not responsive on mobile | Check viewport meta tag in `layout.tsx`; test with device toolbar in DevTools |
| Share button not showing | Share API only works on mobile with HTTPS; test on actual device |
| Sticky button overlapping content | Check `pb-24` bottom padding on form (prevents overlap) |

## 🚀 Deployment

### Vercel (Recommended for Next.js)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repo to Vercel dashboard
# https://vercel.com/new

# 3. Vercel auto-deploys on push
# Your site is live at https://potatovotes.vercel.app
```

### Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add any `NEXT_PUBLIC_*` variables (optional for future features)
3. Redeploy

### Other Platforms
- **Netlify**: Similar to Vercel; connect GitHub repo
- **Traditional Server**: Run `npm run build && npm run start`

## 📝 Code Style & Conventions

### TypeScript
- ✅ Strict mode enabled (`"strict": true` in tsconfig.json)
- ✅ Use interfaces for component props
- ✅ Avoid `any`; use proper types

### React
- ✅ Functional components only
- ✅ Use hooks (useState, useEffect, useCallback, useRef)
- ✅ Prop drilling is fine for small trees; consider Context API for larger apps

### Tailwind CSS
- ✅ Mobile-first: default styles apply to mobile, use `lg:` for desktop
- ✅ Use semantic classes: `flex`, `gap`, `p-4`, not inline styles
- ✅ Responsive: `md:`, `lg:` for tablet/desktop breakpoints

### Accessibility
- ✅ Every input needs a label (visible or `sr-only`)
- ✅ Every interactive element needs an `aria-label`
- ✅ Use semantic HTML: `<button>`, `<section>`, `<main>`

## 📚 Learning Resources

### Next.js 14 (App Router)
- [Next.js Official Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Canvas API
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Canvas Cheat Sheet](https://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/)

### Accessibility
- [WCAG 2.1 Overview](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

## 🤝 Contributing

### Before You Code
1. Create a new branch: `git checkout -b feature/your-feature`
2. Read the code style section above
3. Keep commits small and focused

### Common Tasks

**Add a new voting option type:**
1. Update `src/lib/types.ts` → `VotingRowType`
2. Update `src/lib/drawCard.ts` → styling logic
3. Test in form

**Change form validation limits:**
1. Update `src/lib/constants.ts` → MAX_* values
2. Update labels in components (if needed)

**Fix a bug:**
1. Identify the component
2. Add error logs to understand flow
3. Test the fix on mobile + desktop

## 📞 Support

For questions or issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review browser console for error messages
3. Test in an incognito/private window (clears cache)
4. Create an issue with steps to reproduce

## 📄 License

This project is open source. Check the LICENSE file for details.

---

**Happy Coding! 🥔✨**

Remember: Keep the code simple, accessible, and fun. The junior developers of the future will thank you!
