import { NextResponse } from "next/server";
import tenantsData from "@/data/playtomic-tenants-all.json";

interface TenantData {
  tenant_id: string;
  name: string;
  link: string;
  image: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  reviewCount: number;
  phone: string;
  website: string;
  courtsCount: number;
}

interface ClubAvailability {
  club: {
    tenant_id: string;
    name: string;
    link: string;
    image: string;
  };
  courts: any[];
  hasAvailability: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  try {
    // Parse the date and create start/end times
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 0);

    const startMin = startDate.toISOString().split(".")[0];
    const startMax = endDate.toISOString().split(".")[0];

    // Fetch availability for all tenants in parallel (with batching to avoid overwhelming the API)
    const batchSize = 5;
    const results: ClubAvailability[] = [];

    for (let i = 0; i < tenantsData.length; i += batchSize) {
      const batch = tenantsData.slice(i, i + batchSize);

      const batchPromises = batch.map(async (tenant: TenantData) => {
        try {
          const url = new URL("https://api.playtomic.io/v1/availability");
          url.searchParams.set("sport_id", "PADEL");
          url.searchParams.set("start_min", startMin);
          url.searchParams.set("start_max", startMax);
          url.searchParams.set("tenant_id", tenant.tenant_id);

          const response = await fetch(url.toString(), {
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "com.playtomic.app 6.13.0",
              "User-Agent": "iOS 18.3.1",
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000),
          });

          if (!response.ok) {
            console.warn(
              `Failed to fetch for tenant ${tenant.name}: ${response.status}`,
            );
            return null;
          }

          const courts = await response.json();

          // Check if there's any availability
          const hasAvailability = courts && courts.length > 0;

          return {
            club: {
              tenant_id: tenant.tenant_id,
              name: tenant.name,
              link: tenant.link,
              image: tenant.image,
            },
            courts,
            hasAvailability,
          };
        } catch (error) {
          console.warn(`Error fetching for tenant ${tenant.name}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(
        ...batchResults.filter((r): r is ClubAvailability => r !== null),
      );

      // Small delay between batches to be respectful to the API
      if (i + batchSize < tenantsData.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Sort results: clubs with availability first
    const sortedResults = results.sort((a, b) => {
      if (a.hasAvailability && !b.hasAvailability) return -1;
      if (!a.hasAvailability && b.hasAvailability) return 1;
      return 0;
    });

    return NextResponse.json({
      date,
      totalClubs: tenantsData.length,
      clubsChecked: results.length,
      results: sortedResults,
    });
  } catch (error) {
    console.error("Error fetching multi-club availability:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch availability data. Please try again.",
      },
      { status: 500 },
    );
  }
}
