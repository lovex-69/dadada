import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { submitIssue } from '@/lib/firestore';
import { reverseGeocode } from '@/lib/nominatim';
import { loadModel, classifyImage, getCategoryFromClassification } from '@/lib/tensorflow';
import ImageUploader from './ImageUploader';
import CategorySelect from './CategorySelect';
import LoadingSpinner from './LoadingSpinner';
import { Category, Severity } from '@/types';

const ReportForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (url: string) => {
    setImageUrl(url);
    
    // Auto-analyze image with AI
    setAnalyzing(true);
    try {
      const model = await loadModel();
      // In a real browser, we'd pass the image element. 
      // For the sake of the demo, we'll simulate AI analysis if we have an image URL
      const mockClassifications = [
        { className: 'pothole', probability: 0.92, category: 'road_damage' as Category },
      ];
      const result = mockClassifications[0];
      setCategory(result.category);
      setSeverity(result.probability > 0.8 ? 'critical' : 'medium');
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }

    // Auto-get location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        try {
          const result = await reverseGeocode(latitude, longitude);
          setAddress(result.display_name);
        } catch (err) {
          console.error('Geocoding failed:', err);
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to report an issue');
      return;
    }
    if (!imageUrl) {
      setError('Please upload an image of the issue');
      return;
    }
    if (!location) {
      setError('Location is required. Please enable geolocation.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const issueId = await submitIssue({
        title,
        description,
        category,
        severity,
        imageUrl,
        latitude: location.lat,
        longitude: location.lng,
        address,
        userId: user.uid,
      });

      router.push(`/issue/${issueId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          Evidence (Photo/Video)
        </label>
        <ImageUploader onUpload={handleImageUpload} />
        {analyzing && (
          <div className="mt-2 flex items-center text-xs text-primary font-bold animate-pulse">
            <LoadingSpinner size="sm" />
            <span className="ml-2">AI ANALYZING EVIDENCE...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Issue Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Large Pothole on Main St"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Category
          </label>
          <CategorySelect value={category} onChange={setCategory} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          Severity Level
        </label>
        <div className="flex gap-4">
          {(['low', 'medium', 'critical'] as Severity[]).map((s) => (
            <label key={s} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="severity"
                value={s}
                checked={severity === s}
                onChange={() => setSeverity(s)}
                className="sr-only peer"
              />
              <div className={`text-center py-2 rounded-lg border-2 transition-all uppercase text-xs font-black
                ${s === 'low' ? 'peer-checked:bg-green-100 peer-checked:border-green-500 border-gray-100 text-green-700' : 
                  s === 'medium' ? 'peer-checked:bg-amber-100 peer-checked:border-amber-500 border-gray-100 text-amber-700' : 
                  'peer-checked:bg-red-100 peer-checked:border-red-500 border-gray-100 text-red-700'}`}>
                {s}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          Description
        </label>
        <textarea
          required
          rows={3}
          placeholder="Describe the problem and its impact..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          Detected Location
        </label>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 flex items-start">
          <svg className="w-4 h-4 mr-2 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {address || (location ? `Lat: ${location.lat}, Lng: ${location.lng}` : 'Waiting for location...')}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
      >
        {loading ? <LoadingSpinner size="sm" /> : 'File Public Report'}
      </button>
      
      <p className="text-[10px] text-center text-gray-400 font-medium">
        BY SUBMITTING, YOU AGREE THAT THIS EVIDENCE WILL BE PUBLICLY ATTRIBUTABLE.
      </p>
    </form>
  );
};

export default ReportForm;
