export interface PlaytomicSlot {
  start_time: string; // e.g., "09:30:00"
  duration: number; // in minutes
  price: string; // e.g., "72 EUR"
}

export interface PlaytomicCourt {
  resource_id: string;
  start_date: string; // e.g., "2025-03-06"
  slots: PlaytomicSlot[];
}

export interface PlaytomicSearchResult {
  courts: PlaytomicCourt[];
  date: string;
  tenantId: string;
  error?: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  city: string;
}
