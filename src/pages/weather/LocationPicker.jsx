// src/pages/weather/LocationPicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiX } from 'react-icons/fi';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

/**
 * Component for picking locations with autocomplete
 *
 * @param {Object} props Component props
 * @param {Function} props.onLocationSelect Callback when location is selected
 * @param {boolean} props.isOpen Whether the component is visible
 * @param {Function} props.onClose Function to close the component
 */
export const LocationPicker = ({ onLocationSelect, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle search input changes
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      // In a real application, you would call a geolocation API here
      // For demonstration, we'll use a mock implementation
      const mockSuggestions = await getMockLocationSuggestions(value);
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    onLocationSelect(location);
    setQuery('');
    setSuggestions([]);
    onClose();
  };

  // Mock function to simulate location API
  const getMockLocationSuggestions = async (query) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Sample locations for demonstration
    const sampleLocations = [
      { id: 1, name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
      { id: 2, name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
      { id: 3, name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
      { id: 4, name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
      { id: 5, name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
      { id: 6, name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
      { id: 7, name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074 },
      { id: 8, name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 },
      { id: 9, name: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437 },
      { id: 10, name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173 }
    ];

    // Filter locations based on query
    return sampleLocations.filter(loc =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card ref={containerRef} className="w-full max-w-md p-4 shadow-lg animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Select Location</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>

        {loading && (
          <div className="py-2 px-3 text-gray-500 text-sm">Loading suggestions...</div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map(location => (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className="flex items-start w-full py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FiMapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.country}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && query.length >= 3 && suggestions.length === 0 && (
          <div className="py-2 px-3 text-gray-500 text-sm">
            No locations found. Try a different search term.
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (query.trim().length > 0) {
                onLocationSelect({ name: query, direct: true });
                onClose();
              }
            }}
          >
            Search This Term
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LocationPicker;