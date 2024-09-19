import { cookieBasedClient } from "@/utils/amplify-utils";


export default async function Home() {

  console.log(cookieBasedClient)

   const { data: posts } = await cookieBasedClient.models.Post.list({
    selectionSet: ['title', 'id'],
    authMode: 'apiKey'
   })

   console.log("posts",posts)

  return (
    <div>
      <h1 className="text-4xl font-bold">List of all titles</h1>
      {posts?.map( async (post, idx)=> (
        <div key={idx}>
          <div>
          {post.title}
          </div>
        </div>
      ))}
      
    </div>
  );
}
