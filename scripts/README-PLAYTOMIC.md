# Playtomic Tenant Extraction Tools

This folder contains multiple tools to extract tenant (court) data from Playtomic.com.

## ⚠️ Important Note

Playtomic's search API is **not publicly accessible**. There's no direct endpoint to search for courts by city name without authentication. You need to extract data from their website.

---

## 🛠️ Available Tools

### 1. **Browser Console Script** (Recommended)

**File**: `playtomic-browser-extract.js`

**How to use**:

1. Open https://playtomic.com/search?q=lisboa in your browser
2. Open DevTools (F12) → Console tab
3. Copy the entire contents of `playtomic-browser-extract.js`
4. Paste into the console and press Enter
5. The script will try to extract tenant data and download it as JSON

**Pros**:

- Runs directly in browser
- No Node.js required
- Can capture API responses

**Cons**:

- May not find data if page structure changes
- Requires manual browser interaction

---

### 2. **HTML Extraction Tool**

**File**: `../public/playtomic-extractor.html`

**How to use**:

1. Open the HTML file in your browser (double-click it)
2. Follow the on-screen instructions to:
   - Paste JSON from Network tab
   - Use the bookmarklet
   - Manually enter tenant data

**Pros**:

- User-friendly interface
- Multiple extraction methods
- Can export to JSON or CSV

**Cons**:

- Requires manual data extraction from browser DevTools

---

### 3. **Node.js Scripts** (For API Testing)

**Files**:

- `check-playtomic-tenants.js` - Multi-endpoint tester
- `playtomic-search.js` - Coordinate-based search

**How to use**:

```bash
node scripts/check-playtomic-tenants.js lisboa
node scripts/playtomic-search.js lisboa
```

**Note**: These scripts will likely **fail** because Playtomic's public API endpoints are not accessible without proper authentication. They're kept for testing if/when endpoints become available.

---

## 📋 Manual Method (Most Reliable)

If automated tools don't work:

1. **Go to Playtomic search**: https://playtomic.com/search?q=lisboa

2. **Open DevTools** (F12) → **Network** tab

3. **Perform a search** or interact with the map

4. **Filter network requests** by typing: `tenant` or `api`

5. **Look for API calls** like:
   - `api.playtomic.io/v1/tenants`
   - `api.playtomic.io/v1/search`
   - Any requests returning JSON with court data

6. **Click on a request** → **Response** tab

7. **Right-click** → **Copy** → **Copy response**

8. **Open** `public/playtomic-extractor.html` in your browser

9. **Paste the JSON** into the text area

10. **Click "Parse JSON"** and download the results

---

## 🎯 What You're Looking For

Tenant data typically looks like this:

```json
{
  "tenant_id": "uuid-here",
  "tenant_name": "Club Name",
  "address": "Street Address",
  "city": "Lisboa",
  "latitude": 38.7223,
  "longitude": -9.1393,
  "rating": 4.5,
  "review_count": 120,
  "phone": "+351...",
  "website": "https://...",
  "resources": [{ "resource_id": "court-1" }, { "resource_id": "court-2" }],
  "sports": ["PADEL"]
}
```

---

## 💡 Tips

- **If you have a tenant ID**: Use the existing availability check at `/campos` page
- **If you need many courts**: Use the manual DevTools method - it's the most reliable
- **If the page structure changes**: The browser console script may need updates

---

## 🔧 API Integration (If Available)

If you gain access to Playtomic's API or find working endpoints, update:

1. `app/api/playtomic/tenants/route.ts` - Add working endpoint
2. Update these scripts with correct URL patterns
3. Consider adding authentication headers if needed

---

## 📞 Support

If you find working Playtomic API endpoints or authentication methods, please update these tools accordingly!
