import { useReducer, useCallback } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GeometryData } from "@/@types/geomtry";
import useAdminCheck from "@/hooks/useAdminCheck";
import { createPost } from "@/app/_actions/actions";
import { readGeoJSONFile, filterFeatureProperties } from "@/utils/geojson-utils";
import FeatureList from "@/components/dragAndDrop/extra/FeatureList";

// Categorias e propriedades filtradas
const categories = ["Desmatamento", "Fogo", "Atividades", "Propriedades", "Outros"];
const filteredProperties = [
  "fonte", "municipio", "areaha", "datadetec", "vpressao", "cod_imovel",
  "num_area", "DescSeg", "TipoPNV", "CODIGO", "OBJECTID", "codealerta",
  "FONTE", "MUNICIPIO", "AREAHA", "DATADETEC", "VPRESSAO", "COD_IMOVEL",
  "NUM_AREA", "DESCSEG", "TIPOPNV", "CODIGO", "OBJECTID", "CODEALERTA",
  "NOME_PROP", "nome", "NOM_MUNICI", "id", "ID",
];

// Inicialização do estado
const initialState = {
  geoJsonData: null as GeometryData | null,
  isDragging: false,
  name: "",
  color: "#000000",
  category: categories[0],
  errorMessage: null as string | null,
  successMessage: null as string | null,
  isLoading: false,
};

// Ações para o reducer
type Action =
  | { type: "SET_GEOJSON_DATA"; payload: GeometryData | null }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_IS_DRAGGING"; payload: boolean }
  | { type: "SET_ERROR_MESSAGE"; payload: string | null }
  | { type: "SET_SUCCESS_MESSAGE"; payload: string | null }
  | { type: "SET_IS_LOADING"; payload: boolean };

// Reducer
function reducer(state: typeof initialState, action: Action): typeof initialState {
  switch (action.type) {
    case "SET_GEOJSON_DATA":
      return { ...state, geoJsonData: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_COLOR":
      return { ...state, color: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_IS_DRAGGING":
      return { ...state, isDragging: action.payload };
    case "SET_ERROR_MESSAGE":
      return { ...state, errorMessage: action.payload };
    case "SET_SUCCESS_MESSAGE":
      return { ...state, successMessage: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// Componente principal
export default function DragAndDrop() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isAdmin = useAdminCheck();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: "SET_IS_DRAGGING", payload: true });
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: "SET_IS_DRAGGING", payload: false });
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: "SET_IS_DRAGGING", payload: false });
    dispatch({ type: "SET_ERROR_MESSAGE", payload: null });
    dispatch({ type: "SET_SUCCESS_MESSAGE", payload: null });

    const file = e.dataTransfer.files[0];
    if (!file) {
      dispatch({ type: "SET_ERROR_MESSAGE", payload: "No file detected. Please drop a valid GeoJSON file." });
      return;
    }

    try {
      const geoJson = await readGeoJSONFile(file);
      dispatch({ type: "SET_GEOJSON_DATA", payload: geoJson });
      dispatch({ type: "SET_NAME", payload: geoJson.name || "" });
      dispatch({ type: "SET_SUCCESS_MESSAGE", payload: "GeoJSON Carregado com Sucesso!" });
    } catch (error: any) {
      console.error("Error processing GeoJSON:", error);
      dispatch({ type: "SET_GEOJSON_DATA", payload: null });
      dispatch({ type: "SET_ERROR_MESSAGE", payload: error.message || "Failed to process GeoJSON file." });
    }
  }, []);

  const handleSubmit = async () => {
    if (!state.geoJsonData) {
      dispatch({ type: "SET_ERROR_MESSAGE", payload: "No GeoJSON data to send. Please upload a file first." });
      return;
    }

    dispatch({ type: "SET_IS_LOADING", payload: true });
    dispatch({ type: "SET_ERROR_MESSAGE", payload: null });
    dispatch({ type: "SET_SUCCESS_MESSAGE", payload: null });

    try {
      const filteredFeatures = state.geoJsonData.features.map((feature) =>
        filterFeatureProperties(feature, filteredProperties)
      );
 
      const formData = new FormData();
      formData.append("category", state.category);
      formData.append("type", state.geoJsonData.features[0]?.geometry.type || "");
      formData.append("name", state.name);
      formData.append("color", state.color);
      formData.append("features", JSON.stringify({ features: filteredFeatures }));

      await createPost(formData);
      dispatch({ type: "SET_SUCCESS_MESSAGE", payload: "GeoJSON sent successfully!" });
    } catch (error) {
      console.error("Error sending GeoJSON:", error);
      dispatch({ type: "SET_ERROR_MESSAGE", payload: "Failed to send GeoJSON. Please try again." });
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Access denied. You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto h-screen overflow-y-scroll">
      <Card>
        <CardHeader>
          <CardTitle>GeoJSON Drag and Drop</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              state.isDragging ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-sm text-gray-500">Drag and drop a GeoJSON file here</p>
          </div>

          {state.errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{state.errorMessage}</AlertDescription>
            </Alert>
          )}
          {state.successMessage && (
            <Alert variant="default" className="mt-4 bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{state.successMessage}</AlertDescription>
            </Alert>
          )}

          {state.geoJsonData && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">GeoJSON Information:</h3>
              <div className="space-y-2 text-sm">
                <div className="mb-2">
                  <label className="block font-medium">Name:</label>
                  <input
                    type="text"
                    value={state.name}
                    onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Color:</label>
                  <input
                    type="color"
                    value={state.color}
                    onChange={(e) => dispatch({ type: "SET_COLOR", payload: e.target.value })}
                    className="w-10 h-10 border-none cursor-pointer"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Category:</label>
                  <select
                    value={state.category}
                    onChange={(e) => dispatch({ type: "SET_CATEGORY", payload: e.target.value })}
                    className="w-full p-1 border border-gray-300 rounded"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <p>
                  <span className="font-medium">Total Features:</span> {state.geoJsonData.features.length}
                </p>
              </div>
              <FeatureList features={state.geoJsonData.features} />
              <Button onClick={handleSubmit} disabled={state.isLoading} className="w-full">
                {state.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send GeoJSON"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
