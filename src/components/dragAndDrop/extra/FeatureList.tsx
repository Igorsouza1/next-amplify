"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Feature } from "@/@types/geomtry";

const filteredProperties = [
  "fonte",
  "municipio",
  "areaha",
  "datadetec",
  "vpressao",
  "cod_imovel",
  "num_area",
  "DescSeg",
  "TipoPNV",
  "CODIGO",
  "OBJECTID",
  "codealerta",
  "FONTE",
  "MUNICIPIO",
  "AREAHA",
  "DATADETEC",
  "VPRESSAO",
  "COD_IMOVEL",
  "NUM_AREA",
  "DESCSEG",
  "TIPOPNV",
  "CODIGO",
  "OBJECTID",
  "CODEALERTA",
  "NOME_PROP",
  "nome",
  "NOM_MUNICI",
  "id",
  "ID",
];

interface FeatureListProps {
  features: Feature[];
}

export default function FeatureList({ features }: FeatureListProps) {
  const [openFeatureIndexes, setOpenFeatureIndexes] = useState<{
    [key: number]: boolean;
  }>({});

  const handleToggleFeature = (index: number) => {
    setOpenFeatureIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-scroll border border-gray-200 rounded-md p-2">
      <h4 className="text-md font-semibold">Features:</h4>
      {features.map((feature, index) => (
        <Collapsible
          key={index}
          open={openFeatureIndexes[index] || false}
          className="space-y-2"
        >
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
              <strong>ID:</strong> {feature.id || "N/A"}
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
  );
}
