
import ControlShapes from "@/components/mapleaft/controlShapes/controlShapes";
import { Sidebar } from "@/components/sidebar/sidebar";
import dynamic from "next/dynamic";


export default async function Map() {

    const Map = dynamic(() => import("@/components/mapleaft/mapleaft"), {
        ssr: false
      });

    return (
        <div className="flex flex-row">
        <Sidebar/>
        <div className="relative w-full flex">
            <div className="w-full z-0">
                <Map />
            </div>
            <div className="absolute bottom-10 left-5 z-10">
                <ControlShapes />
            </div>
        </div>
    </div>
    )
}
