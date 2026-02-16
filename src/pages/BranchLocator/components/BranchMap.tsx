import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import type { Branch } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}

function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface BranchMapProps {
  branches: Branch[];
  mapCenter: [number, number];
  mapZoom: number;
  onBranchClick: (branch: Branch) => void;
}

export default function BranchMap({ branches, mapCenter, mapZoom, onBranchClick }: BranchMapProps) {
  return (
    <Card>
      <CardContent className="branch-map__card-content">
        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {branches.map(branch => (
              <Marker
                key={branch.id}
                position={[branch.lat, branch.lng]}
                eventHandlers={{
                  click: () => onBranchClick(branch),
                }}
              >
                <Popup>
                  <div className="branch-popup">
                    <h3 className="branch-popup__name">{branch.name}</h3>
                    <div className="branch-popup__details">
                      <div className="branch-popup__detail">
                        <MapPin size={12} />
                        <span>{branch.address}</span>
                      </div>
                      {branch.phone && (
                        <div className="branch-popup__detail">
                          <Phone size={12} />
                          <span>{branch.phone}</span>
                        </div>
                      )}
                      <div className="branch-popup__detail">
                        <Clock size={12} />
                        <span>{branch.hours}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
