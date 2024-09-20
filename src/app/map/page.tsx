import { cookieBasedClient } from "@/utils/amplify-utils";


export default async function Map() {

    // Get all post using cookieBasedClient
    const {data: posts} = await await cookieBasedClient.models.InitialGeometry.list({
        selectionSet: ['name'],
        authMode: 'userPool'
    });
    console.log(posts);
    return (
        <div>
            <h1>Map</h1>
        </div>
    )
}
