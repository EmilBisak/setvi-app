# SETVI — Products Viewer  
React + TypeScript + React Query + MUI + Virtualized Table + AI Summary

A small app for browsing products with search, category filtering, infinite scrolling, product detail drawer, and AI-style summaries generated from DummyJSON Quotes.

---

## Stack
- React 18 + TypeScript  
- React Query (TanStack Query)  
- React Router  
- MUI  
- react-window (virtualized list)  
- Vite  

---

## Features

### Search & Filters
- Debounced search (300ms)  
- Category filter  
- Search + category combination supported  
- URL state: `?q=...&category=...&page=...`  
- Server-side pagination (`limit + skip`)  

### Virtualized Table
- `react-window` FixedSizeList  
- Infinite scrolling  
- Loader row  
- Columns: Thumbnail, Title, Category, Price, Rating  

### Product Detail Drawer
- Title, description, price, rating, images  
- AI Summary section  
- Summary stored in localStorage per product  

### AI-Style Summary
- Quotes fetched once from:  
  `https://dummyjson.com/quotes`  
- Combined text rendered with typewriter effect  
- Blinking caret, pauses after punctuation  
- Per-product persistence  

---

## Project Structure

```
src/
 ├─ api/
 ├─ components/
 ├─ context/
 ├─ features/
 │   └─ products/
 │        └─ components/
 │        └─ hooks/
 │        └─ pages/
 ├─ types/
 ├─ utils/
 ├─ App.tsx
 ├─ main.tsx
 └─ theme.ts
```

---

## Setup

```
npm install
npm run dev
```

Build:

```
npm run build
npm run preview
```

If react-window complains about peer deps:

```
npm install --legacy-peer-deps
```

---

## Architecture Notes
- URL is the source of truth for search/category/page  
- React Query handles caching + infinite pagination  
- Virtualization ensures smooth performance  
- Summary generation cached per product  

---

## Improvements (future)
- Sorting (price, rating)  
- Tests  
- Scroll restoration after closing drawer  
- Better summary templates  

---

## Author
**made by Emil Bisak**
