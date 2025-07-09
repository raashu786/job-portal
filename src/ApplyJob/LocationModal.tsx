import { Modal } from '@mantine/core';
import GoogleMapComponent from './GoogleMapComponent';

interface UserLocationModalProps {
  opened: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  onLocationSave: (location: { lat: number; lng: number; locations: string }) => void;
}

const UserLocationModal: React.FC<UserLocationModalProps> = ({ 
  opened, 
  onClose, 
  lat, 
  lng,
  onLocationSave
}) => {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Confirm Your Location" 
      size="lg"
      styles={{
        body: {
          padding: '0',
        }
      }}
    >
      <div style={{ height: '500px', width: '100%' }}>
        <GoogleMapComponent 
          lat={lat} 
          lng={lng} 
          onLocationSave={onLocationSave}
          onClose={onClose}
        />
      </div>
    </Modal>
  );
};

export default UserLocationModal;