# Deploying PotatoVotes to Vercel 🚀

This guide walks you through deploying PotatoVotes to Vercel, from start to finish. Estimated time: **10-15 minutes**.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Push Code to GitHub](#step-1-push-code-to-github)
3. [Step 2: Create Vercel Account](#step-2-create-vercel-account)
4. [Step 3: Import Project to Vercel](#step-3-import-project-to-vercel)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Deploy](#step-5-deploy)
7. [Step 6: Verify Deployment](#step-6-verify-deployment)
8. [Step 7 (Optional): Set Up Custom Domain](#step-7-optional-set-up-custom-domain)
9. [Troubleshooting](#troubleshooting)
10. [What's Next](#whats-next)

---

## Prerequisites

Before you start, make sure you have:

✅ **GitHub Account** - [Create one here](https://github.com/signup)
✅ **Code Pushed to GitHub** - Your PotatoVotes repo on GitHub
✅ **Node.js v18+** - (Vercel uses this automatically)
✅ **Git installed** - (for pushing code)

**Don't have GitHub yet?** [Sign up (free)](https://github.com/signup), then follow Step 1 below.

---

## Step 1: Push Code to GitHub

### 1.1 Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **New** (top left)
3. Name your repo: `potatovotes` (or any name you prefer)
4. Add description: "A fun voter card generator for social media"
5. Choose **Public** (so Vercel can access it)
6. Click **Create repository**

### 1.2 Push Your Code to GitHub

```bash
# Navigate to your project directory
cd /Users/yong-gyunchoi/projects/wethepotato-singleton

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: PotatoVotes app"

# Add GitHub as remote (replace USERNAME/REPO with your values)
git remote add origin https://github.com/USERNAME/potatovotes.git

# Push to GitHub (you'll be prompted to authenticate)
git branch -M main
git push -u origin main
```

**Stuck on authentication?**
- GitHub now requires Personal Access Tokens instead of passwords
- [Generate a PAT here](https://github.com/settings/tokens/new)
- Use the token as your password when prompted

### 1.3 Verify on GitHub

1. Go to your GitHub repo: `https://github.com/USERNAME/potatovotes`
2. You should see all your files (src/, public/, README.md, etc.)

✅ **Code is now on GitHub!**

---

## Step 2: Create Vercel Account

### 2.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** (top right)
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account
   - Click **Authorize vercel[bot]**
   - Enter your GitHub password if prompted

### 2.2 Complete Your Profile

1. Vercel redirects you to onboarding
2. You can skip most steps or fill out your info
3. When asked "What do you want to build?", select **Other**
4. Click **Continue**

✅ **Vercel account created!**

---

## Step 3: Import Project to Vercel

### 3.1 Import GitHub Repository

1. You should see the Vercel dashboard
2. Click **Add New...** → **Project**
3. Click **Import Git Repository**
4. Find and click your **potatovotes** repo
   - If you don't see it, click **Adjust GitHub App permissions** to grant access
5. Click **Import**

### 3.2 Configure Project Settings

Vercel auto-detects Next.js! You should see:

```
Framework: Next.js
Node Version: 18.x (default)
Build Command: next build
Start Command: next start
Output Directory: .next
```

**Leave these settings as-is** (they're perfect for PotatoVotes).

Click **Deploy** at the bottom right.

✅ **Project imported to Vercel!**

---

## Step 4: Configure Environment Variables

### 4.1 Check if You Need Environment Variables

Currently, PotatoVotes doesn't require any environment variables (all processing is client-side). However, if you plan to add analytics or features later:

1. Go to your **Vercel Project Dashboard**
2. Click **Settings** (top menu)
3. Go to **Environment Variables** (left sidebar)

### 4.2 Add Environment Variables (Optional for Future)

If you want to add Google Analytics later:

1. Click **Add New**
2. Enter variable:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX` (your GA ID)
3. Click **Save**
4. Redeploy project

**Why `NEXT_PUBLIC_`?** Vercel exposes these to the browser automatically. Other env vars stay secret.

✅ **Environment configured!**

---

## Step 5: Deploy

### 5.1 Automatic Deployment

Good news: **Vercel auto-deploys on every push to GitHub!**

When you created the project, Vercel already started building. Check the status:

1. Go to **Vercel Dashboard** → Your Project
2. Look at **Deployments** (top tabs)
3. You should see a deployment in progress or completed

### 5.2 Wait for Build to Complete

- ⏳ **Building**: Compiling Next.js (usually 1-2 minutes)
- ✅ **Completed**: Ready to use
- ❌ **Failed**: Check logs (see Troubleshooting)

---

## Step 6: Verify Deployment

### 6.1 View Your Live Site

1. Once deployment is **Completed**, you'll see a URL:
   ```
   https://potatovotes-[random-hash].vercel.app
   ```
2. Click it or copy the URL to your browser
3. Test the app:
   - [ ] Form loads
   - [ ] Can type in inputs
   - [ ] Canvas preview updates
   - [ ] Download button works
   - [ ] (Mobile) Share button works

### 6.2 Check Deployment Details

1. Click the **Completed** deployment
2. View **Logs** tab:
   - Should show `> ready - started server on 0.0.0.0:3000`
   - No errors in red

### 6.3 Run Production Build Locally (Optional)

To test before pushing to Vercel:

```bash
# Build the project
npm run build

# Start production server
npm run start

# Visit http://localhost:3000
```

✅ **Site is live!**

---

## Step 7 (Optional): Set Up Custom Domain

### 7.1 Add Custom Domain

If you own a domain (e.g., `potatovotes.com`):

1. Go to **Vercel Dashboard** → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `potatovotes.com`
4. Vercel shows DNS records to add

### 7.2 Update DNS Records

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **DNS Settings** or **Advanced**
3. Add Vercel's DNS records:
   - Usually `CNAME` record pointing to `cname.vercel-dns.com`
4. Save changes
5. Wait 24-48 hours for DNS to propagate

### 7.3 Verify Domain

```bash
# Check if domain resolves
nslookup potatovotes.com

# Should show Vercel's IP address
```

### 7.4 Enable SSL (HTTPS)

Vercel auto-enables free SSL certificates:

1. Go to **Vercel Dashboard** → **Settings** → **Domains**
2. Your domain should show a green checkmark ✅
3. HTTPS is automatically enabled

✅ **Custom domain configured!**

---

## Auto-Deployments: How It Works

### Every Time You Push to GitHub:

```
You commit & push code
        ↓
GitHub notifies Vercel
        ↓
Vercel triggers build
        ↓
Vercel runs: npm run build
        ↓
Vercel deploys to CDN
        ↓
Your site is updated instantly
```

### Test Auto-Deployments

1. Make a small change (e.g., update README.md)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update README"
   git push origin main
   ```
3. Go to **Vercel Dashboard** → **Deployments**
4. You should see a new deployment building
5. Once completed, refresh your site to see changes

✅ **Continuous deployment working!**

---

## Troubleshooting

### ❌ Deployment Failed

**Step 1: Check Build Logs**
1. Go to **Vercel Dashboard** → Failed deployment
2. Click **Build Logs** tab
3. Look for error messages in red

**Common Issues:**

| Error | Solution |
|-------|----------|
| `Module not found: 'canvas'` | Canvas is in browser; you're probably using it on server-side. Move to client component (`"use client"`) |
| `Environment variable not found` | Check `.env.example`; add missing variables in Vercel settings |
| `Build timeout` | Rare; wait a few minutes and redeploy |
| `Out of memory` | Increase Vercel Pro plan (usually for large projects) |

**Step 2: Debug Locally**
```bash
# Run build locally to reproduce
npm run build

# Check for errors
npm run dev
```

**Step 3: Check Dependencies**
```bash
# Verify all packages installed
npm ls

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

### ❌ Site Shows Blank Page

**Likely cause:** JavaScript error in browser

**Fix:**
1. Open browser DevTools (`F12`)
2. Check **Console** tab for errors
3. Common causes:
   - Canvas not supported (older browser)
   - Image not loading (check `public/images/potatoes/`)

### ❌ Images Not Loading

**Check:**
1. Images in `public/images/potatoes/` ?
2. File paths correct in `src/lib/constants.ts` ?
3. Try hard-refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

### ❌ Slow Deployment

**Vercel is usually fast, but:**
- First deployment: 2-3 minutes (normal)
- Subsequent: < 1 minute
- If slower, check build logs for hanging processes

### ❌ Domain Not Working

**If custom domain shows error:**
1. DNS might not be propagated yet (wait up to 48 hours)
2. Check DNS records are correct in registrar
3. Use `nslookup` to verify:
   ```bash
   nslookup potatovotes.com
   ```

---

## Rollback to Previous Version

If something breaks in production:

1. Go to **Vercel Dashboard** → **Deployments**
2. Find the working deployment
3. Click the deployment
4. Click **Promote to Production**

Done! Your site is back to the previous version.

---

## Enable Preview URLs for PRs

Great for testing before merging:

### How It Works:
1. Push code to new branch: `git checkout -b feature/new-potato`
2. Create Pull Request on GitHub
3. Vercel automatically creates a **Preview URL**
4. Click the Preview URL to test
5. Merge PR → Vercel deploys to production

No extra setup needed! Vercel does this automatically.

---

## Monitor Your Deployment

### Vercel Analytics (Free)

1. Go to **Vercel Dashboard** → **Analytics**
2. See:
   - Page views
   - Response times
   - Top pages

### Real-Time Logs

1. Go to **Vercel Dashboard** → **Logs**
2. See live request logs
3. Useful for debugging production issues

### Uptime Monitoring

Vercel maintains 99.99% uptime for free tier. Your site stays up!

---

## Performance Tips

### 1. Check Performance Score

```bash
# Local Lighthouse audit
npm run build

# Or visit:
https://your-site.vercel.app/ (then press F12, Lighthouse tab)
```

### 2. Optimize Images

- Keep potato images under 200KB each
- Use WebP format if possible
- Vercel automatically optimizes with Next.js Image

### 3. Enable Caching

Vercel caches static assets automatically. Add to `next.config.mjs`:

```javascript
const nextConfig = {
  headers: async () => {
    return [
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000" },
        ],
      },
    ];
  },
};
```

---

## Upgrade to Vercel Pro (Optional)

### Benefits:
- Unlimited serverless functions (not needed for PotatoVotes)
- Custom analytics
- Team collaboration
- Priority support

### Cost: $20/month

For PotatoVotes, **free tier is plenty!** Only upgrade if you need advanced features.

---

## What's Next?

### 🎯 Post-Deployment Checklist

- [ ] Site is live and working
- [ ] All forms submit correctly
- [ ] Images load on mobile
- [ ] Share button works (test on phone)
- [ ] No console errors (F12 → Console)
- [ ] Verify with different browsers/devices

### 🚀 Future Enhancements

1. **Add Analytics** (Google Analytics)
   - Add `NEXT_PUBLIC_GA_ID` env var
   - Install analytics library

2. **Custom Domain**
   - Register domain
   - Set up DNS records
   - Enable HTTPS

3. **Collaboration**
   - Upgrade to Vercel Pro
   - Invite teammates
   - Share Preview URLs

4. **A/B Testing**
   - Use Vercel's built-in A/B testing
   - Test different UI variations

### 📈 Monitoring in Production

- Set up error tracking (Sentry, etc.)
- Monitor performance (Vercel Analytics)
- Check logs for issues
- Collect user feedback

---

## Quick Reference: Common Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Test production build locally
npm run start

# Push changes (auto-deploys)
git push origin main

# Create new branch for feature
git checkout -b feature/potato-8

# Switch back to main
git checkout main
```

---

## Need Help?

### Resources:
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Ask on your repo
- **Vercel Support**: https://vercel.com/support

### Ask in Forums:
- Stack Overflow (tag: `vercel`)
- Next.js Discord
- GitHub Discussions

---

## Security Checklist ✅

Before going fully public:

- [ ] All `.env` files are in `.gitignore`
- [ ] No secrets in code or comments
- [ ] Security headers enabled (already done in `next.config.mjs`)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS properly configured
- [ ] Rate limiting (if adding API)

---

**Congratulations! Your PotatoVotes app is now live on the internet! 🥔🎉**

Share the link with friends, post on social media, and enjoy watching people create voter cards!

---

**Last updated**: February 2026
**Framework**: Next.js 14
**Platform**: Vercel
