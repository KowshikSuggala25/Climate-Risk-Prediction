import { supabase } from '@/integrations/supabase/client';

export interface NotificationSettings {
  weather: boolean;
  disasters: boolean;
  air_quality: boolean;
  email: boolean;
  sms: boolean;
}

export interface PreferenceSettings {
  tempUnit: string;
  windUnit: string;
  precipUnit: string;
  timeFormat: string;
  autoRefresh: boolean;
  darkMode: string;
}

export interface UserSettings {
  id?: string;
  user_id: string;
  notifications: NotificationSettings;
  preferences: PreferenceSettings;
  language: string;
  created_at?: string;
  updated_at?: string;
}

class SettingsService {
  async getUserSettings(): Promise<UserSettings | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? {
      ...data,
      notifications: data.notifications as any as NotificationSettings,
      preferences: data.preferences as any as PreferenceSettings,
    } : null;
  }

  async saveUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const existingSettings = await this.getUserSettings();
    
    if (existingSettings) {
      const { data, error } = await supabase
        .from('user_settings')
        .update({
          notifications: settings.notifications as any || existingSettings.notifications,
          preferences: settings.preferences as any || existingSettings.preferences,
          language: settings.language || existingSettings.language,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        notifications: data.notifications as any as NotificationSettings,
        preferences: data.preferences as any as PreferenceSettings,
      };
    } else {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          notifications: settings.notifications as any || {
            weather: true, disasters: true, air_quality: false, email: true, sms: false
          },
          preferences: settings.preferences as any || {
            tempUnit: 'celsius', windUnit: 'kmh', precipUnit: 'mm', timeFormat: '24h', autoRefresh: true, darkMode: 'system'
          },
          language: settings.language || 'english',
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        notifications: data.notifications as any as NotificationSettings,
        preferences: data.preferences as any as PreferenceSettings,
      };
    }
  }

  async updateProfile(profileData: {
    full_name?: string;
    email?: string;
    mobile_number?: string;
    profile_photo_url?: string;
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  async uploadProfilePhoto(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/profile.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async exportUserData(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const [profileData, settingsData, locationsData, weatherHistoryData] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('user_settings').select('*').eq('user_id', user.id).single(),
      supabase.from('locations').select('*').eq('user_id', user.id),
      supabase.from('weather_history').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(100)
    ]);

    return {
      user_id: user.id,
      profile: profileData.data,
      settings: settingsData.data,
      locations: locationsData.data,
      weather_history: weatherHistoryData.data,
      exported_at: new Date().toISOString()
    };
  }
}

export const settingsService = new SettingsService();