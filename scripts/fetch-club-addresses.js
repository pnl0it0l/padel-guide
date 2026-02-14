const fs = require("fs");
const path = require("path");

/**
 * Script to fetch addresses for clubs by scraping their individual Playtomic pages
 *
 * This script reads the tenant JSON file and attempts to fetch address information
 * from each club's page on Playtomic.
 */

const dataDir = path.join(__dirname, "..", "data");
const inputFile = path.join(dataDir, "playtomic-tenants-all.json");
const outputFile = path.join(dataDir, "playtomic-tenants-with-addresses.json");

// Read existing tenant data
const tenants = JSON.parse(fs.readFileSync(inputFile, "utf8"));

console.log(`📖 Loaded ${tenants.length} clubs from file`);
console.log("");
console.log("⚠️  MANUAL EXTRACTION REQUIRED ⚠️");
console.log("");
console.log("To get club addresses, you need to:");
console.log("");
console.log(
  "1. Visit each club page on Playtomic manually or use a browser automation tool",
);
console.log("2. Look for address information on the club detail page");
console.log(
  "3. The address is usually displayed near the club name and contact info",
);
console.log("");
console.log("BROWSER CONSOLE SCRIPT:");
console.log("Copy this script and run it on a Playtomic club page:");
console.log("");
console.log(`
// Run this on a club's detail page, e.g.: https://playtomic.com/clubs/urbansoccer-lisboa
const address = document.querySelector('[class*="address"], [class*="location"], [itemprop="address"]')?.textContent?.trim() || 
                 Array.from(document.querySelectorAll('div, span, p')).find(el => /^[A-Z][^,]+,\\s*\\d{4}/.test(el.textContent?.trim()))?.textContent?.trim() ||
                 'Not found';
const coords = window.location.href.match(/@(-?\\d+\\.\\d+),(-?\\d+\\.\\d+)/);
console.log('Address:', address);
if (coords) {
  console.log('Latitude:', coords[1]);
  console.log('Longitude:', coords[2]);
}
`);
console.log("");
console.log("ALTERNATIVE APPROACH:");
console.log(
  "Use the browser extension script below to extract addresses from search results:",
);
console.log("");
console.log(`
// Run this on https://playtomic.com/search?q=lisboa (after loading all results)
const clubs = [];
document.querySelectorAll('a[href*="/clubs/"]').forEach(link => {
  const card = link.closest('[class*="Card"], [class*="item"], [class*="result"]') || link;
  const name = card.querySelector('h2, h3, h4, [class*="name"], [class*="title"]')?.textContent?.trim();
  const address = card.querySelector('[class*="address"], [class*="location"]')?.textContent?.trim();
  const image = card.querySelector('img')?.src;
  const href = link.href;
  const tenantId = image?.match(/tenants\\/([a-f0-9-]{36})/)?.[1];
  
  if (tenantId && name) {
    clubs.push({
      tenant_id: tenantId,
      name: name,
      link: href,
      image: image || '',
      address: address || ''
    });
  }
});

console.log('Found', clubs.length, 'clubs');
console.table(clubs);

// Download as JSON
const blob = new Blob([JSON.stringify(clubs, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'playtomic-with-addresses.json';
a.click();
`);
console.log("");
console.log("MERGING ADDRESSES:");
console.log("After extracting addresses, you can merge them with:");
console.log("  node scripts/merge-addresses.js playtomic-with-addresses.json");
console.log("");

// Sample clubs to check manually
console.log("Sample clubs to extract addresses from:");
console.log("");
tenants.slice(0, 5).forEach((tenant, i) => {
  console.log(`${i + 1}. ${tenant.name}`);
  console.log(`   ${tenant.link}`);
  console.log("");
});
