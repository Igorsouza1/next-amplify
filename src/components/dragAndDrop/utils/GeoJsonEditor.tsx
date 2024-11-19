'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GeometryData } from '@/@types/geomtry';

interface GeoJsonEditorProps {
  geoJsonData: GeometryData;
  onSave: (updatedGeoJson: GeometryData) => void;
}

export default function GeoJsonEditor({ geoJsonData, onSave }: GeoJsonEditorProps) {
  const [name, setName] = useState(geoJsonData.name || '');
  const [color, setColor] = useState(geoJsonData.color || '#000000');
  const [category, setCategory] = useState('Desmatamento');

  const categories = ['Desmatamento', 'Fogo', 'Atividades', 'Propriedades', 'Outros'];

  const handleSave = () => {
    const updatedGeoJson = {
      ...geoJsonData,
      name,
      color,
      category,
    };
    onSave(updatedGeoJson);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit GeoJSON Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="mb-2">
              <label className="block font-medium">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter a name"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 border-none cursor-pointer"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
