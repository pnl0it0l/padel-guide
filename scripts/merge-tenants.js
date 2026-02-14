const fs = require("fs");
const path = require("path");

// Read all tenant files
const dataDir = path.join(__dirname, "..", "data");

const files = [
  "playtomic-tenants-1771019071683_V2.json",
  "playtomic-tenants-1771019090227_v3.json",
  "playtomic-tenants-1771019117395_V4.json",
];

const allTenants = [];
const seenIds = new Set();

console.log("Merging tenant files...\n");

files.forEach((file) => {
  const filePath = path.join(dataDir, file);
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const tenants = JSON.parse(content);

    let added = 0;
    let duplicates = 0;

    tenants.forEach((tenant) => {
      if (!seenIds.has(tenant.tenant_id)) {
        seenIds.add(tenant.tenant_id);
        allTenants.push(tenant);
        added++;
      } else {
        duplicates++;
      }
    });

    console.log(`${file}:`);
    console.log(`  - Total in file: ${tenants.length}`);
    console.log(`  - Added: ${added}`);
    console.log(`  - Duplicates skipped: ${duplicates}`);
    console.log("");
  } catch (error) {
    console.error(`Error reading ${file}:`, error.message);
  }
});

// Sort by name for better organization
allTenants.sort((a, b) => a.name.localeCompare(b.name));

// Write merged file
const outputPath = path.join(dataDir, "playtomic-tenants-all.json");
fs.writeFileSync(outputPath, JSON.stringify(allTenants, null, 2), "utf8");

console.log("=================================");
console.log(`Total unique clubs: ${allTenants.length}`);
console.log(`Output written to: playtomic-tenants-all.json`);
console.log("=================================");
