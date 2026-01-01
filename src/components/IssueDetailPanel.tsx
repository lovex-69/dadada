import React from 'react';
import { Issue } from '@/types';

interface IssueDetailPanelProps {
  issue: Issue;
  onClose?: () => void;
}

const IssueDetailPanel: React.FC<IssueDetailPanelProps> = ({ issue, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{issue.title}</h2>
      <p className="text-gray-600 mb-4">{issue.description}</p>
      <img
        src={issue.imageUrl}
        alt={issue.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <div className="space-y-2">
        <p><strong>Category:</strong> {issue.category}</p>
        <p><strong>Severity:</strong> {issue.severity}</p>
        <p><strong>Address:</strong> {issue.address}</p>
        <p><strong>Reported:</strong> {new Date(issue.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default IssueDetailPanel;
