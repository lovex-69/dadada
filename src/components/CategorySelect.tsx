import React from 'react';
import { Category } from '@/types';

interface CategorySelectProps {
  value: Category;
  onChange: (category: Category) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const categories: { value: Category; label: string }[] = [
    { value: 'road_damage', label: 'Road Damage' },
    { value: 'garbage', label: 'Garbage' },
    { value: 'water_leak', label: 'Water Leak' },
    { value: 'broken_infra', label: 'Broken Infrastructure' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Category)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
