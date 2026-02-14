#!/usr/bin/env node

/**
 * Playtomic Court Search Script
 * Finds padel courts using coordinates or city name
 * Usage: node scripts/playtomic-search.js [city|coordinates]
 */

const fs = require("fs");

// Predefined coordinates for major cities
const CITIES = {
  lisboa: { lat: 38.7223, lon: -9.1393, name: "Lisboa" },
  porto: { lat: 41.1579, lon: -8.6291, name: "Porto" },
  madrid: { lat: 40.4168, lon: -3.7038, name: "Madrid" },
  barcelona: { lat: 41.3851, lon: 2.1734, name: "Barcelona" },
  paris: { lat: 48.8566, lon: 2.3522, name: "Paris" },
};

async function searchByCoordinates(lat, lon, radius = 50) {
  // Try the coordinates-based search endpoint
  const url = `https://playtomic.io/api/v1/tenants?coordinate=[${lat},${lon}]&radius=${radius}&sport_id=PADEL`;

  console.log(`📍 Searching near coordinates: ${lat}, ${lon}`);
  console.log(`📡 URL: ${url}\n`);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.log(`Response body: ${text.substring(0, 200)}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function searchByText(query) {
  // Try text-based search
  const endpoints = [
    `https://playtomic.io/api/v1/search?q=${encodeURIComponent(query)}&sport_id=PADEL`,
    `https://api.playtomic.io/v1/tenants?query=${encodeURIComponent(query)}&sport_id=PADEL`,
    `https://playtomic.io/api/tenants?city=${encodeURIComponent(query)}&sport_id=PADEL`,
  ];

  console.log(`🔍 Searching for: ${query}\n`);

  for (const url of endpoints) {
    console.log(`📡 Trying: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      console.log(`   Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Success!\n`);
        return data;
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }

  return null;
}

function displayResults(data) {
  if (!data) {
    console.log("❌ No data received from any endpoint");
    return;
  }

  // Handle different response formats
  let tenants = [];

  if (Array.isArray(data)) {
    tenants = data;
  } else if (data.tenants && Array.isArray(data.tenants)) {
    tenants = data.tenants;
  } else if (data.data && Array.isArray(data.data)) {
    tenants = data.data;
  } else {
    console.log("📄 Raw response:");
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(`\n✅ Found ${tenants.length} results\n`);

  tenants.forEach((tenant, index) => {
    console.log(`${"=".repeat(60)}`);
    console.log(
      `📍 ${index + 1}. ${tenant.tenant_name || tenant.name || "Unknown"}`,
    );
    console.log(`${"=".repeat(60)}`);

    if (tenant.tenant_id || tenant.id) {
      console.log(`🆔 ID: ${tenant.tenant_id || tenant.id}`);
    }
    if (tenant.address) console.log(`📍 Address: ${tenant.address}`);
    if (tenant.city) console.log(`🏙️  City: ${tenant.city}`);
    if (tenant.rating) {
      console.log(
        `⭐ Rating: ${tenant.rating.toFixed(1)} (${tenant.review_count || 0} reviews)`,
      );
    }
    if (tenant.resources) {
      console.log(`🎾 Courts: ${tenant.resources.length}`);
    }
    if (tenant.phone) console.log(`📞 Phone: ${tenant.phone}`);
    if (tenant.website) console.log(`🌐 Website: ${tenant.website}`);

    console.log();
  });

  // Save to file
  const timestamp = Date.now();
  const filename = `playtomic-results-${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`💾 Full data saved to: ${filename}`);
}

async function main() {
  const arg = (process.argv[2] || "lisboa").toLowerCase();

  let data = null;

  // Check if it's a known city
  if (CITIES[arg]) {
    const city = CITIES[arg];
    console.log(`🏙️  Searching in ${city.name}...\n`);

    // Try coordinate-based search first
    data = await searchByCoordinates(city.lat, city.lon);

    // If that fails, try text search
    if (!data) {
      console.log("\n📝 Trying text-based search...\n");
      data = await searchByText(city.name);
    }
  } else {
    // Try as text search
    data = await searchByText(arg);
  }

  displayResults(data);

  if (!data) {
    console.log("\n💡 Try these commands:");
    console.log("  node scripts/playtomic-search.js lisboa");
    console.log("  node scripts/playtomic-search.js porto");
    console.log("  node scripts/playtomic-search.js madrid");
    console.log("\n📚 Available cities:", Object.keys(CITIES).join(", "));
  }
}

main();
