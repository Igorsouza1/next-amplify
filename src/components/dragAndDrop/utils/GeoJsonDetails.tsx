'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { GeometryData, Feature } from '@/@types/geomtry';

interface GeoJsonDetailsProps {
  geoJsonData: GeometryData;
  filteredProperties: string[];
}

export default function GeoJsonDetails({ geoJsonData, filteredProperties }: GeoJsonDetailsProps) {
  const [openFeatureIndexes, setOpenFeatureIndexes] = useState<{ [key: number]: boolean }>({});

  const handleToggleFeature = (index: number) => {
    setOpenFeatureIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h3 className="text-lg font-semibold">GeoJSON Details</h3>
      <div className="border border-gray-300 rounded-md p-4">
        <p>
          <span className="font-medium">Name:</span> {geoJsonData.name || 'N/A'}
        </p>
        <p>
          <span className="font-medium">Total Features:</span> {geoJsonData.features.length}
        </p>
        <p>
          <span className="font-medium">Geometry Type:</span>{' '}
          {geoJsonData.features[0]?.geometry.type || 'N/A'}
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-semibold">Features:</h4>
        <div className="max-h-96 overflow-y-scroll border border-gray-200 rounded-md p-2">
          {geoJsonData.features.map((feature: Feature, index: number) => (
            <Collapsible key={index} open={openFeatureIndexes[index] || false} className="space-y-2">
              <CollapsibleTrigger
                onClick={() => handleToggleFeature(index)}
                className="flex items-center justify-between w-full p-2 text-sm font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                <span>Feature {index + 1}</span>
                {openFeatureIndexes[index] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pl-4 text-sm">
                <p>
                  <strong>ID:</strong> {feature.id || 'N/A'}
                </p>
                <p>
                  <strong>Type:</strong> {feature.type}
                </p>
                <p>
                  <strong>Geometry Type:</strong> {feature.geometry.type}
                </p>
                <div className="space-y-1">
                  <p className="font-semibold">Properties:</p>
                  <pre className="text-xs overflow-x-auto bg-gray-50 p-2 rounded">
                    {JSON.stringify(
                      Object.fromEntries(
                        Object.entries(feature.properties).filter(([key]) =>
                          filteredProperties.includes(key)
                        )
                      ),
                      null,
                      2
                    )}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}
