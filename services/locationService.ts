// Location tracking service using IP geolocation

export interface LocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  timestamp: string;
}

/**
 * Get user's location based on IP address
 * Uses ip-api.com free service (no API key required)
 */
export async function getUserLocation(): Promise<LocationData | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }

    const data = await response.json();

    if (data.error) {
      console.error('Location API error:', data.reason);
      return null;
    }

    const locationData: LocationData = {
      ip: data.ip,
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region_code,
      regionName: data.region,
      city: data.city,
      zip: data.postal,
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone,
      isp: data.org,
      timestamp: new Date().toISOString()
    };

    return locationData;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

/**
 * Save location data to localStorage
 */
export function saveLocationData(location: LocationData): void {
  try {
    localStorage.setItem('truvamate_location', JSON.stringify(location));
    
    // Also save to location history
    const history = getLocationHistory();
    history.push(location);
    
    // Keep only last 10 entries
    const recentHistory = history.slice(-10);
    localStorage.setItem('truvamate_location_history', JSON.stringify(recentHistory));
  } catch (error) {
    console.error('Error saving location:', error);
  }
}

/**
 * Get saved location data from localStorage
 */
export function getSavedLocation(): LocationData | null {
  try {
    const saved = localStorage.getItem('truvamate_location');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error reading saved location:', error);
    return null;
  }
}

/**
 * Get location history
 */
export function getLocationHistory(): LocationData[] {
  try {
    const saved = localStorage.getItem('truvamate_location_history');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading location history:', error);
    return [];
  }
}

/**
 * Check if user is accessing from USA
 */
export function isFromUSA(location: LocationData | null): boolean {
  return location?.countryCode === 'US';
}

/**
 * Check if user is accessing from Thailand
 */
export function isFromThailand(location: LocationData | null): boolean {
  return location?.countryCode === 'TH';
}

/**
 * Log location analytics (can be sent to Firebase Analytics later)
 */
export function logLocationAnalytics(location: LocationData): void {
  console.log('📍 User Location Analytics:', {
    country: location.country,
    region: location.regionName,
    city: location.city,
    timezone: location.timezone,
    timestamp: location.timestamp
  });

  // TODO: Send to Firebase Analytics
  // analytics.logEvent('user_location', {
  //   country: location.country,
  //   region: location.regionName,
  //   city: location.city
  // });
}
