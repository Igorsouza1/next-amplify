

import { Sidebar } from "@/components/sidebar/sidebar";
import FormGeojson from "@/components/formGeojson/formGeojsonComponent"; // Importe o novo componente

export default function Add() {


  return (
    
    <div className="flex flex-row w-full">
      <Sidebar /> {/* Usa o componente de sidebar */}
      
    <div className="w-full flex justify-center items-center">
      <FormGeojson /> {/* Usa o componente de formulário */}
      </div>
    </div>
  );
}
