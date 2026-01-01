import React, { useEffect, useState } from 'react';
import { Issue } from '@/types';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  issues?: Issue[];
  onIssueClick?: (issue: Issue) => void;
  center?: [number, number];
  className?: string;
}

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const MapView: React.FC<MapViewProps> = ({ issues = [], onIssueClick, center = [12.9716, 77.5946], className = "w-full h-96" }) => {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      // Fix default marker icon issue in Leaflet with Next.js
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setL(leaflet);
    });
  }, []);

  if (!L) {
    return (
      <div className={`${className} bg-gray-200 rounded-lg flex items-center justify-center animate-pulse`}>
        <p className="text-gray-500">Loading Map...</p>
      </div>
    );
  }

  const getMarkerIcon = (severity: string) => {
    let color = '#3b82f6'; // default blue
    if (severity === 'critical') color = '#dc2626'; // red
    if (severity === 'medium') color = '#f59e0b'; // amber
    if (severity === 'low') color = '#10b981'; // green

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  return (
    <div className={`${className} overflow-hidden rounded-lg shadow-inner z-0`}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={getMarkerIcon(issue.severity)}
            eventHandlers={{
              click: () => onIssueClick && onIssueClick(issue),
            }}
          >
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-sm mb-1">{issue.title}</h4>
                <p className="text-xs text-gray-600 mb-2 truncate max-w-[150px]">{issue.address}</p>
                <div className="flex justify-between items-center gap-4">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${issue.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {issue.severity}
                  </span>
                  <a href={`/issue/${issue.id}`} className="text-[10px] text-primary hover:underline font-bold">Details →</a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
