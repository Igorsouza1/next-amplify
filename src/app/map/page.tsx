import MapLeaflet from "@/components/mapleaft/mapleaft";
import { Sidebar } from "@/components/sidebar/sidebar";
import { cookieBasedClient } from "@/utils/amplify-utils";
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
