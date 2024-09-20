"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
    const {data} = await cookieBasedClient.models.InitialGeometry.create({
        type: formData.get('type')?.toString() || '',
        name: formData.get('name')?.toString() || '',
        size: formData.get('size')?.toString() || '',
        crs: formData.get('crs')?.toString() || '',
        // Geometry is a json object
        geometry: formData.get('geometry')?.toString() || ''
    })
    console.log('data created ', data)
    redirect(`/`)
}