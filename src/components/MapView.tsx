import React from 'react';

interface MapViewProps {
  issues?: any[];
  onIssueClick?: (issue: any) => void;
  center?: [number, number];
}

const MapView: React.FC<MapViewProps> = ({ issues, onIssueClick, center }) => {
  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Map component will be implemented with Leaflet</p>
    </div>
  );
};

export default MapView;
