import React from 'react';
import { Issue } from '@/types';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <img
        src={issue.imageUrl}
        alt={issue.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{issue.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{issue.address}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium`}>
            {issue.severity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
