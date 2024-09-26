import { createPost } from "@/app/_actions/actions"

export default function Add() {

  return (
    <div>
      <form action={createPost} className="flex flex-col gap-4">
        <input type="text" name="type" placeholder="type" id="type" className="p-2 rounded-md" />
        <input type="text" name="name" placeholder="name" id="name" className="p-2 rounded-md" />
        <input type="text" name="size" placeholder="size" id="size" className="p-2 rounded-md" />
        <input type="text" name="color" placeholder="color" id="color" className="p-2 rounded-md" />
        <input type="text" name="features" placeholder="features" id="features" className="p-2 rounded-md" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Create Post</button>  
      </form>
    </div>
  );
}