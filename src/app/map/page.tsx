
import { Sidebar } from "@/components/sidebar/sidebar";
import dynamic from "next/dynamic";


export default async function Map() {

   


    const Map = dynamic(() => import("@/components/mapleaft/mapleaft"), {
        ssr: false
      });

    return (
        <div className="flex flex-row">
            <Sidebar/>
            <Map />
        </div>
    )
}
