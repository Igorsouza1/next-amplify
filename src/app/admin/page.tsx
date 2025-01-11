

import DragAndDrop from "@/components/dragAndDrop/dragAndDrop";
import ExcelReader from "@/components/ExcelReader/ExcelReader";
import { Sidebar } from "@/components/sidebar/sidebar";


export default function Add() {
  return(
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex justify-center items-center w-full">
        <DragAndDrop />
        <ExcelReader />
      </div>
    </div>
  )
}
