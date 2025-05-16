import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { Button, Group, TextInput } from '@mantine/core';
import { IconDeviceFloppy, IconLocationPin } from '@tabler/icons-react';
import { ErrorNotification } from '../Services/Notification';

interface MapComponentProps {
  lat: number;
  lng: number;
  onLocationSave: (location: { lat: number; lng: number; locations: string }) => void;
  onClose?: () => void;
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const GoogleMapComponent: React.FC<MapComponentProps> = ({ lat, lng, onLocationSave, onClose }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState({ lat, lng });
  const [locations, setAddress] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDFpCBiS0HtSA4AaTpfr_6f41O6ljKRi_M',
    libraries: ['places'],
  });

  const geocodeLatLng = useCallback((lat: number, lng: number) => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        setAddress(results[0].formatted_address || '');
        if (autocompleteRef.current) {
          autocompleteRef.current.value = results[0].formatted_address || '';
        }
      } else {
        console.error('Geocoder failed:', status);
        setAddress('Address not found');
      }
    });
  }, []);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    geocodeLatLng(newPosition.lat, newPosition.lng);
  }, [geocodeLatLng]);

  const handleSaveLocation = useCallback(() => {
    if (!locations) {
      ErrorNotification('Error', 'Please select a valid location');
      return;
    }
    onLocationSave({
      lat: markerPosition.lat,
      lng: markerPosition.lng,
      locations: locations
    });
    onClose?.();
  }, [markerPosition, locations, onLocationSave, onClose]);

  const onLoadAutocomplete = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete && map) {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) {
        console.error("No location available for the selected place");
        return;
      }

      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      
      setMarkerPosition(newPosition);
      setAddress(place.formatted_address || '');
      map.panTo(newPosition);
    }
  }, [autocomplete, map]);

  useEffect(() => {
    if (isLoaded) {
      setMapLoaded(true);
      setMarkerPosition({ lat, lng });
      geocodeLatLng(lat, lng);
    }
  }, [isLoaded, lat, lng, geocodeLatLng]);

  if (!isLoaded) {
    return <div className="map-loading">Loading Map...</div>;
  }

  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      {/* Fixed Input Bar */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 10,
        padding: '10px',
        backgroundColor: '#1d1d1f',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
          options={{
            types: ['geocode'],
            componentRestrictions: { country: 'in' },
          }}
        >
          <Group align="flex-end">
            <TextInput
              leftSection={<IconLocationPin size={18} />}
              ref={autocompleteRef}
              placeholder="Search or confirm your location"
              size="md"
              style={{ flex: 1 }}
              styles={{
                input: {
                  fontSize: '14px',
                }
              }}
            />
            <Button 
              size="md" 
              color="bright-sun.4" 
              onClick={handleSaveLocation}
              variant='outline'
              leftSection={<IconDeviceFloppy size={18} />}
            >
              Save
            </Button>
          </Group>
        </Autocomplete>
      </div>

      {/* Scrollable Map */}
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        center={markerPosition}
        zoom={15}
        onLoad={(map) => {
          setMap(map);
          console.log('Map loaded');
        }}
        onUnmount={() => setMap(null)}
        options={{
          gestureHandling: 'greedy',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {mapLoaded && window.google && (
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={handleMarkerDragEnd}
            animation={window.google.maps.Animation.BOUNCE}
            icon={{
              url: '/location.png',
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 32),
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;