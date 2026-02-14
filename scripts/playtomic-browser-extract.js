/**
 * Browser Console Script for Playtomic Tenant Extraction
 *
 * HOW TO USE:
 * 1. Go to: https://playtomic.com/search?q=lisboa
 * 2. Open DevTools (F12) → Console tab
 * 3. Copy and paste this entire script into the console
 * 4. Press Enter
 * 5. The script will extract tenant data and download it as JSON
 */

(async function extractPlaytomicTenants() {
  console.log("🎾 Playtomic Tenant Extractor");
  console.log("============================\n");

  // Method 1: Try to find data in the page's window object
  console.log("🔍 Searching for tenant data in page...");

  let tenants = [];

  // Check if there's React/Next.js data
  if (window.__NEXT_DATA__) {
    console.log("✓ Found Next.js data");

    // Log the structure to help debug
    console.log("Next.js data structure:", Object.keys(window.__NEXT_DATA__));

    const nextData = window.__NEXT_DATA__;

    // Try multiple paths to find tenant data
    const possiblePaths = [
      nextData?.props?.pageProps?.tenants,
      nextData?.props?.pageProps?.initialData,
      nextData?.props?.pageProps?.data,
      nextData?.props?.pageProps?.venues,
      nextData?.props?.pageProps?.results,
      nextData?.query?.results,
      nextData?.buildId?.results,
    ];

    for (const path of possiblePaths) {
      if (path && (Array.isArray(path) ? path.length > 0 : true)) {
        tenants = Array.isArray(path) ? path : [path];
        console.log(`✓ Found ${tenants.length} items in Next.js data`);
        break;
      }
    }

    // If still nothing, dump the entire structure for manual inspection
    if (tenants.length === 0) {
      console.log("Next.js pageProps:", nextData?.props?.pageProps);
      console.log("\n💡 Try inspecting: window.__NEXT_DATA__.props.pageProps");
    }
  }

  // Check for React state in DOM
  if (tenants.length === 0) {
    console.log("🔍 Searching in DOM elements...");

    const tenantMap = new Map();

    // Method A: Extract tenant data from images (best source!)
    const imageElements = document.querySelectorAll(
      'img[src*="playtomic"], img[srcset*="playtomic"]',
    );

    console.log(`Found ${imageElements.length} Playtomic-related images`);

    imageElements.forEach((el) => {
      const src = el.getAttribute("src") || el.getAttribute("srcset") || "";
      const alt = el.getAttribute("alt") || "";

      // Extract UUID pattern: /tenants/{UUID}/
      const match = src.match(/tenants\/([a-f0-9-]{36})/i);

      if (match) {
        const tenantId = match[1];

        // Extract the image URL (use src, fallback to srcset first URL)
        let imageUrl = el.getAttribute("src") || "";
        if (!imageUrl && el.getAttribute("srcset")) {
          const srcset = el.getAttribute("srcset");
          const firstUrl = srcset.split(",")[0].trim().split(" ")[0];
          imageUrl = firstUrl;
        }

        // Try to find the parent card for more information
        const card =
          el.closest(
            'article, [class*="card"], [class*="item"], [class*="result"], a',
          ) || el.parentElement;

        const name =
          alt ||
          card
            ?.querySelector('h1, h2, h3, h4, [class*="name"], [class*="title"]')
            ?.textContent?.trim();

        const address = card
          ?.querySelector('[class*="address"], [class*="location"]')
          ?.textContent?.trim();

        const city = card
          ?.querySelector('[class*="city"]')
          ?.textContent?.trim();

        const ratingEl = card?.querySelector(
          '[class*="rating"], [class*="score"]',
        );
        const ratingText = ratingEl?.textContent?.trim() || "";
        const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

        // Get the booking link
        const link =
          card?.getAttribute("href") ||
          card?.querySelector("a")?.getAttribute("href") ||
          `/tenant/${tenantId}`;

        const fullLink = link.startsWith("http")
          ? link
          : `https://playtomic.com${link}`;

        tenantMap.set(tenantId, {
          tenant_id: tenantId,
          tenant_name: name || "",
          address: address || "",
          city: city || "",
          rating: rating,
          link: fullLink,
          image: imageUrl,
        });
      }
    });

    console.log(`✓ Extracted ${tenantMap.size} tenants from images`);

    // Method B: Find tenant links/cards
    const tenantElements = document.querySelectorAll(
      '[data-tenant-id], [data-venue-id], a[href*="/tenant/"], a[href*="/venue/"]',
    );

    console.log(`Found ${tenantElements.length} tenant links/elements`);

    tenantElements.forEach((el) => {
      let tenantId =
        el.getAttribute("data-tenant-id") || el.getAttribute("data-venue-id");

      // Extract from href if present
      if (!tenantId) {
        const href = el.getAttribute("href") || "";
        const match = href.match(/\/(tenant|venue)\/([a-f0-9-]{36})/i);
        if (match) {
          tenantId = match[2];
        }
      }

      if (tenantId && !tenantMap.has(tenantId)) {
        // Try to find associated text content
        const card =
          el.closest(
            'article, [class*="card"], [class*="item"], [class*="result"]',
          ) || el;

        const name = card
          .querySelector('h1, h2, h3, h4, [class*="name"], [class*="title"]')
          ?.textContent?.trim();

        const address = card
          .querySelector('[class*="address"], [class*="location"]')
          ?.textContent?.trim();

        const city = card.querySelector('[class*="city"]')?.textContent?.trim();

        const ratingEl = card.querySelector('[class*="rating"]');
        const ratingText = ratingEl?.textContent?.trim() || "";
        const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

        if (name) {
          // Get the booking link
          const link =
            el.getAttribute("href") ||
            card.querySelector("a")?.getAttribute("href") ||
            `/tenant/${tenantId}`;

          const fullLink = link.startsWith("http")
            ? link
            : `https://playtomic.com${link}`;

          // Try to find image
          const img = card.querySelector(
            'img[src*="playtomic"], img[srcset*="playtomic"]',
          );
          let imageUrl = img?.getAttribute("src") || "";
          if (!imageUrl && img?.getAttribute("srcset")) {
            const srcset = img.getAttribute("srcset");
            const firstUrl = srcset.split(",")[0].trim().split(" ")[0];
            imageUrl = firstUrl;
          }

          tenantMap.set(tenantId, {
            tenant_id: tenantId,
            tenant_name: name,
            address: address || "",
            city: city || "",
            rating: rating,
            link: fullLink,
            image: imageUrl,
          });
        }
      }
    });

    if (tenantMap.size > 0) {
      tenants = Array.from(tenantMap.values());
      console.log(`✓ Total extracted: ${tenants.length} tenants from DOM`);
    }
  }

  // Method 2: Check Performance API for recent network requests
  if (tenants.length === 0) {
    console.log("\n📡 Method 2: Checking recent network requests...");

    const perfEntries = performance.getEntriesByType("resource");
    const apiCalls = perfEntries.filter(
      (entry) =>
        entry.name.includes("api.playtomic") ||
        entry.name.includes("playtomic.io/api"),
    );

    console.log(`Found ${apiCalls.length} API calls in browser history`);

    if (apiCalls.length > 0) {
      console.log("\n🔗 Recent API calls:");
      apiCalls.forEach((call) => console.log(`  - ${call.name}`));
      console.log("\n💡 To capture this data:");
      console.log("1. Open DevTools → Network tab");
      console.log("2. Refresh the page (Ctrl+R)");
      console.log("3. Look for these API calls");
      console.log("4. Click on a call → Response tab → Copy the JSON");
    }
  }

  // Method 3: Try to find data in window/global scope
  if (tenants.length === 0) {
    console.log("\n🔍 Method 3: Searching window object...");

    // Search for any arrays in window that might contain tenant data
    for (const key in window) {
      try {
        const value = window[key];
        if (Array.isArray(value) && value.length > 0) {
          const first = value[0];
          if (
            first &&
            (first.tenant_id || first.tenant_name || first.venue_id)
          ) {
            tenants = value;
            console.log(`✓ Found data in window.${key}`);
            break;
          }
        }
      } catch (e) {
        // Ignore errors accessing window properties
      }
    }
  }

  // Process and display results
  if (tenants.length === 0) {
    console.error("❌ No tenant data found!");
    console.log("\n💡 Alternative methods:");
    console.log("1. Open DevTools → Network tab");
    console.log("2. Filter by 'tenant' or 'search'");
    console.log("3. Look for API responses containing tenant data");
    console.log("4. Right-click on the response → Copy → Copy response");
    console.log("5. Use the playtomic-extractor.html tool to parse it");
    return;
  }

  console.log(`\n✅ Found ${tenants.length} tenants!\n`);

  // Format the data for database insertion
  const formatted = tenants.map((t) => ({
    tenant_id: t.tenant_id || t.id || "",
    name: t.tenant_name || t.name || "",
    link: t.link || `https://playtomic.com/tenant/${t.tenant_id || t.id}`,
    image: t.image || "",
    address: t.address || "",
    city: t.city || "",
    latitude: t.latitude || t.lat || null,
    longitude: t.longitude || t.lon || null,
    rating: t.rating || null,
    reviewCount: t.review_count || t.reviews || 0,
    phone: t.phone || "",
    website: t.website || "",
    courtsCount: t.resources?.length || t.courts?.length || 0,
  }));

  // Display in console (simplified view)
  console.table(
    formatted.map((t) => ({
      tenant_id: t.tenant_id,
      name: t.name,
      link: t.link,
      image: t.image ? "✓" : "✗",
      city: t.city,
      rating: t.rating,
    })),
  );

  // Create downloadable JSON
  const blob = new Blob([JSON.stringify(formatted, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `playtomic-tenants-${Date.now()}.json`;

  // Auto-download
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("\n💾 Full data file downloaded!");
  console.log("\n📊 Summary:");
  console.log(`Total tenants: ${formatted.length}`);
  console.log(
    `Total courts: ${formatted.reduce((sum, t) => sum + (t.courtsCount || 0), 0)}`,
  );

  const avgRating =
    formatted.reduce((sum, t) => sum + (t.rating || 0), 0) / formatted.length;
  if (avgRating > 0) {
    console.log(`Average rating: ${avgRating.toFixed(2)} ⭐`);
  }

  // Create simplified SQL-ready format
  const simplifiedForDB = formatted.map((t) => ({
    tenant_id: t.tenant_id,
    name: t.name,
    link: t.link,
    image: t.image,
  }));

  console.log("\n📋 Database-ready format:");
  console.log("```sql");
  console.log("-- INSERT INTO tenants (tenant_id, name, link, image) VALUES");
  simplifiedForDB.forEach((t, i) => {
    const comma = i < simplifiedForDB.length - 1 ? "," : ";";
    console.log(
      `('${t.tenant_id}', '${t.name.replace(/'/g, "''")}', '${t.link}', '${t.image}')${comma}`,
    );
  });
  console.log("```");

  // Also copy simplified data to clipboard
  try {
    await navigator.clipboard.writeText(
      JSON.stringify(simplifiedForDB, null, 2),
    );
    console.log(
      "\n✅ Simplified data (tenant_id, name, link, image) copied to clipboard!",
    );
  } catch (e) {
    console.log("⚠️  Could not copy to clipboard (permission denied)");
  }

  return { full: formatted, simplified: simplifiedForDB };
})();
