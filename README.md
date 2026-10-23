# TunnelGuard

A demo portal UI with a neon tunnel aesthetic, social/business hub cards, and a local admin review flow for test/demo use only.

## Features
- Modern neon login screen
- Social, business, and other-sectors hub pages
- Feedback form
- Settings page with bookmarks, help info, and navigation
- Local auth logging to `admin-logs/`
- Mongo-ready schema for user/auth records

## Run locally

```bash
npm install
node server.js
```

Then open:
- http://localhost:3000/

## Admin log folder

Captured demo auth entries are saved into:
- `admin-logs/`

These files are for local review only.
