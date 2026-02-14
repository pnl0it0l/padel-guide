import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "lisboa";
  const sportId = searchParams.get("sport_id") || "PADEL";

  try {
    // Playtomic tenant search API
    const url = new URL("https://api.playtomic.io/v3/tenants");
    url.searchParams.set("query", query);
    url.searchParams.set("sport_id", sportId);
    url.searchParams.set("with_aggregate", "true");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "com.playtomic.app 6.13.0",
        "User-Agent": "iOS 18.3.1",
      },
    });

    if (!response.ok) {
      throw new Error(`Playtomic API returned ${response.status}`);
    }

    const data = await response.json();

    // Format the response
    const tenants = data.map((tenant: any) => ({
      id: tenant.tenant_id,
      name: tenant.tenant_name,
      address: tenant.address,
      city: tenant.city,
      latitude: tenant.latitude,
      longitude: tenant.longitude,
      rating: tenant.rating,
      reviewCount: tenant.review_count,
      phone: tenant.phone,
      website: tenant.website,
      courts: tenant.resources?.length || 0,
      sports: tenant.sports || [],
    }));

    return NextResponse.json({
      query,
      count: tenants.length,
      tenants,
    });
  } catch (error) {
    console.error("Error fetching Playtomic tenants:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch tenants from Playtomic",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
