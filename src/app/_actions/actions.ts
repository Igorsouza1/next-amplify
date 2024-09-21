"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
    console.log('formData', formData)
    try{
        
    const {data} = await cookieBasedClient.models.InitialGeometry.create({
        type: formData.get('type')?.toString() || '',
        name: formData.get('name')?.toString() || '',
        size: formData.get('size')?.toString() || '',
        crs: formData.get('crs')?.toString() || '',
        // Geometry is a json object
        geometry: formData.get('geometry')?.toString() || ''
    })
    console.log('data created ', data)

    
    } catch (error) {
        console.error('Error creating post', error)
    }
}


export async function getInitialGeometry() {
    try{
    const {data: InitialGeometry} = await cookieBasedClient.models.InitialGeometry.list({
        selectionSet: ['name', 'geometry'],
        authMode: 'userPool'
      }); 
      console.log('InitialGeometry', InitialGeometry)
      return InitialGeometry;
    } catch (error) {
        console.error('Error getting initial geometry', error)
    }
}