import { supabase } from '../integrations/supabase/client';
import { LocationData } from './weatherService';

export interface DatabaseLocation {
  id: string;
  user_id: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  mandal?: string;
  lat: number;
  lon: number;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export const locationService = {
  async saveLocation(location: LocationData & { mandal?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, unset any current location
    await supabase
      .from('locations')
      .update({ is_current: false })
      .eq('user_id', user.id);

    // Then save the new location as current
    const { data, error } = await supabase
      .from('locations')
      .insert({
        user_id: user.id,
        name: location.name,
        country: location.country,
        state: location.state || null,
        city: location.name, // Use name as city since LocationData doesn't have city
        mandal: location.mandal || null,
        lat: location.lat,
        lon: location.lon,
        is_current: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCurrentLocation() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },

  async getUserLocations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async setCurrentLocation(locationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, unset all current locations
    await supabase
      .from('locations')
      .update({ is_current: false })
      .eq('user_id', user.id);

    // Then set the selected location as current
    const { data, error } = await supabase
      .from('locations')
      .update({ is_current: true })
      .eq('id', locationId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLocation(locationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', locationId)
      .eq('user_id', user.id);

    if (error) throw error;
  },
};