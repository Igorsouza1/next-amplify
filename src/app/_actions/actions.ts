"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
    // console.log('formData', formData);
    try {
        // const geometryString = formData.get('geometry')?.toString() || ''; // Remove leading/trailing whitespace

        // // Validate that the geometry string is potentially a JSON object
        // if (!geometryString.startsWith('{') && !geometryString.startsWith('[')) {
        //     console.error('Invalid JSON format for geometry: not starting with { or [');
        //     return;
        // }

        // // Attempt to parse the geometry string into a JSON object
        // let geometryObject;
        // try {
        //     geometryObject = JSON.parse(geometryString);
        // } catch (parseError) {
        //     console.error('Invalid JSON format for geometry:', parseError);
        //     return; // Exit the function early if parsing fails
        // }

        const { data } = await cookieBasedClient.models.InitialGeometry.create({
            type: formData.get('type')?.toString() || '',
            name: formData.get('name')?.toString() || '',
            size: formData.get('size')?.toString() || '',
            color: formData.get('color')?.toString() || '',
            // features is now a parsed JSON object
            features: formData.get('features')?.toString() || '',
        });
        
        console.log('Data created', data);
        // redirect('/map')

    } catch (error) {
        console.error('Error creating post', error);
    }
}


export async function getInitialGeometry() {
    try{
    const {data: InitialGeometry} = await cookieBasedClient.models.InitialGeometry.list({
        selectionSet: ['name', 'features', 'size', 'color'],
        authMode: 'userPool'
      }); 
    //   console.log('InitialGeometry', InitialGeometry)
      return InitialGeometry;
    } catch (error) {
        console.error('Error getting initial geometry', error)
    }
}