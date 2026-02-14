import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const tenantId = searchParams.get("tenantId");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  if (!tenantId) {
    return NextResponse.json(
      { error: "Tenant ID is required" },
      { status: 400 },
    );
  }

  try {
    // Parse the date and create start/end times
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 0);

    const startMin = startDate.toISOString().split(".")[0];
    const startMax = endDate.toISOString().split(".")[0];

    // Playtomic API endpoint (no authentication required!)
    const url = new URL("https://api.playtomic.io/v1/availability");
    url.searchParams.set("sport_id", "PADEL");
    url.searchParams.set("start_min", startMin);
    url.searchParams.set("start_max", startMax);
    url.searchParams.set("tenant_id", tenantId);

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "com.playtomic.app 6.13.0",
        "User-Agent": "iOS 18.3.1",
      },
    });

    if (!response.ok) {
      throw new Error(`Playtomic API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      courts: data,
      date,
      tenantId,
    });
  } catch (error) {
    console.error("Error fetching Playtomic data:", error);

    return NextResponse.json(
      {
        error:
          "Unable to fetch data from Playtomic. Please check the tenant ID.",
      },
      { status: 500 },
    );
  }
}
