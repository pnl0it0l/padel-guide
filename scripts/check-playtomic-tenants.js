#!/usr/bin/env node

/**
 * Standalone Node.js script to check Playtomic tenants in a specific location
 * Usage: node scripts/check-playtomic-tenants.js [location]
 * Example: node scripts/check-playtomic-tenants.js lisboa
 */

const fs = require("fs");

async function fetchPlaytomicTenants(query = "lisboa") {
  // Try multiple API endpoints
  const endpoints = [
    "https://api.playtomic.io/v1/tenants",
    "https://playtomic.io/api/v1/tenants",
    "https://api.playtomic.io/v2/search/tenants",
  ];

  console.log(`🔍 Searching Playtomic for: ${query}`);

  for (const baseUrl of endpoints) {
    const url = new URL(baseUrl);
    url.searchParams.set("q", query);
    url.searchParams.set("sport_id", "PADEL");

    console.log(`📡 Trying: ${url.toString()}`);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "com.playtomic.app 6.13.0",
          "User-Agent": "iOS 18.3.1",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success with: ${baseUrl}\n`);
        return data;
      }

      console.log(`   → ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   → Error: ${error.message}`);
    }
  }

  throw new Error("None of the API endpoints worked");
}

function displayTenant(tenant, index) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📍 ${index + 1}. ${tenant.tenant_name}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`🆔 Tenant ID: ${tenant.tenant_id}`);
  console.log(`📍 Address: ${tenant.address}`);
  console.log(`🏙️  City: ${tenant.city}`);
  console.log(`🗺️  Coordinates: ${tenant.latitude}, ${tenant.longitude}`);
  console.log(
    `⭐ Rating: ${tenant.rating ? tenant.rating.toFixed(1) : "N/A"} (${tenant.review_count} reviews)`,
  );
  console.log(`🎾 Courts: ${tenant.resources?.length || 0}`);

  if (tenant.phone) {
    console.log(`📞 Phone: ${tenant.phone}`);
  }

  if (tenant.website) {
    console.log(`🌐 Website: ${tenant.website}`);
  }

  if (tenant.sports && tenant.sports.length > 0) {
    console.log(`🏃 Sports: ${tenant.sports.join(", ")}`);
  }

  // Playtomic link
  console.log(`🔗 Playtomic: https://playtomic.io/tenant/${tenant.tenant_id}`);
}

async function main() {
  const location = process.argv[2] || "lisboa";

  try {
    const tenants = await fetchPlaytomicTenants(location);

    console.log(`\n✅ Found ${tenants.length} courts in ${location}\n`);

    tenants.forEach((tenant, index) => {
      displayTenant(tenant, index);
    });

    // Summary
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${"=".repeat(60)}`);
    console.log(`Total courts found: ${tenants.length}`);
    console.log(
      `Total padel courts: ${tenants.reduce((sum, t) => sum + (t.resources?.length || 0), 0)}`,
    );

    const avgRating =
      tenants.reduce((sum, t) => sum + (t.rating || 0), 0) / tenants.length;
    console.log(`Average rating: ${avgRating.toFixed(2)} ⭐`);

    const withWebsite = tenants.filter((t) => t.website).length;
    console.log(`Courts with website: ${withWebsite}`);

    const withPhone = tenants.filter((t) => t.phone).length;
    console.log(`Courts with phone: ${withPhone}`);

    // Export to JSON
    const outputData = {
      query: location,
      timestamp: new Date().toISOString(),
      count: tenants.length,
      tenants: tenants.map((t) => ({
        id: t.tenant_id,
        name: t.tenant_name,
        address: t.address,
        city: t.city,
        latitude: t.latitude,
        longitude: t.longitude,
        rating: t.rating,
        reviewCount: t.review_count,
        phone: t.phone,
        website: t.website,
        courtsCount: t.resources?.length || 0,
        sports: t.sports,
      })),
    };

    const outputFile = `playtomic-${location}-${Date.now()}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
    console.log(`\n💾 Data exported to: ${outputFile}`);
  } catch (error) {
    console.error("\n❌ Failed to fetch tenants:", error);
    process.exit(1);
  }
}

main();
