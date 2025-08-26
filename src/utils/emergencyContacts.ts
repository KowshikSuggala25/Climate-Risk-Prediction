import { LocationData } from '@/services/weatherService';

export interface EmergencyContact {
  category: string;
  number: string;
  description: string;
}

export const getLocationSpecificEmergencyContacts = (location: LocationData | null): EmergencyContact[] => {
  if (!location) {
    return getDefaultEmergencyContacts();
  }

  // Country-specific emergency contacts
  switch (location.country) {
    case 'IN': // India
      return getIndiaEmergencyContacts(location);
    case 'US': // United States
      return getUSEmergencyContacts();
    case 'UK': // United Kingdom
      return getUKEmergencyContacts();
    case 'AU': // Australia
      return getAustraliaEmergencyContacts();
    case 'CA': // Canada
      return getCanadaEmergencyContacts();
    default:
      return getDefaultEmergencyContacts();
  }
};

const getIndiaEmergencyContacts = (location: LocationData): EmergencyContact[] => {
  const contacts: EmergencyContact[] = [
    { category: 'Police Emergency', number: '100', description: 'General police emergency' },
    { category: 'Fire Emergency', number: '101', description: 'Fire department and rescue' },
    { category: 'Medical Emergency', number: '102', description: 'Ambulance and medical services' },
    { category: 'Disaster Management', number: '108', description: 'Emergency response services' },
    { category: 'Women Emergency', number: '1091', description: 'Women in distress' },
    { category: 'Child Emergency', number: '1098', description: 'Child helpline' },
    { category: 'Tourist Emergency', number: '1363', description: 'Tourist helpline' }
  ];

  // State-specific additions
  if (location.state) {
    switch (location.state.toLowerCase()) {
      case 'telangana':
      case 'andhra pradesh':
        contacts.push({ 
          category: 'Cyclone Warning', 
          number: '040-23454576', 
          description: 'Cyclone and flood warning center' 
        });
        break;
      case 'kerala':
        contacts.push({ 
          category: 'Flood Control', 
          number: '0471-2721566', 
          description: 'Kerala flood control room' 
        });
        break;
      case 'rajasthan':
        contacts.push({ 
          category: 'Heat Wave Alert', 
          number: '0141-2227721', 
          description: 'Heat wave emergency response' 
        });
        break;
      case 'himachal pradesh':
      case 'uttarakhand':
        contacts.push({ 
          category: 'Landslide Emergency', 
          number: '0177-2620357', 
          description: 'Landslide and mountain rescue' 
        });
        break;
    }
  }

  return contacts;
};

const getUSEmergencyContacts = (): EmergencyContact[] => [
  { category: 'Emergency Services', number: '911', description: 'Police, Fire, Medical emergency' },
  { category: 'FEMA Disaster', number: '1-800-621-3362', description: 'Federal disaster assistance' },
  { category: 'Weather Emergency', number: '1-800-692-4473', description: 'National Weather Service' },
  { category: 'Poison Control', number: '1-800-222-1222', description: 'Poison emergency hotline' },
  { category: 'Red Cross', number: '1-800-733-2767', description: 'Disaster relief services' }
];

const getUKEmergencyContacts = (): EmergencyContact[] => [
  { category: 'Emergency Services', number: '999', description: 'Police, Fire, Ambulance' },
  { category: 'Non-Emergency Police', number: '101', description: 'Non-urgent police matters' },
  { category: 'NHS Emergency', number: '111', description: 'Non-emergency medical advice' },
  { category: 'Environment Agency', number: '0800-807060', description: 'Flood warnings and advice' },
  { category: 'RNLI Sea Rescue', number: '999', description: 'Maritime emergency rescue' }
];

const getAustraliaEmergencyContacts = (): EmergencyContact[] => [
  { category: 'Emergency Services', number: '000', description: 'Police, Fire, Ambulance' },
  { category: 'SES Emergency', number: '132-500', description: 'State Emergency Service' },
  { category: 'Bushfire Info', number: '1800-679-737', description: 'Bushfire information' },
  { category: 'Flood Rescue', number: '132-500', description: 'Flood and storm assistance' },
  { category: 'Poison Info', number: '13-11-26', description: 'Poison information center' }
];

const getCanadaEmergencyContacts = (): EmergencyContact[] => [
  { category: 'Emergency Services', number: '911', description: 'Police, Fire, Medical emergency' },
  { category: 'Weather Network', number: '1-888-879-3282', description: 'Weather emergency alerts' },
  { category: 'Emergency Preparedness', number: '1-800-830-3118', description: 'Emergency preparedness info' },
  { category: 'Health Emergency', number: '811', description: 'Health Link emergency advice' },
  { category: 'Search & Rescue', number: '1-800-267-7270', description: 'Canadian Coast Guard' }
];

const getDefaultEmergencyContacts = (): EmergencyContact[] => [
  { category: 'Local Emergency', number: '112', description: 'International emergency number' },
  { category: 'Police', number: 'Local police', description: 'Contact local police department' },
  { category: 'Fire Department', number: 'Local fire dept', description: 'Contact local fire services' },
  { category: 'Medical Emergency', number: 'Local hospital', description: 'Contact nearest hospital' },
  { category: 'Weather Service', number: 'Local weather', description: 'Contact local weather services' }
];