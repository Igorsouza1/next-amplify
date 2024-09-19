import { createPost } from "@/app/_actions/actions"

export default function Add() {

  return (
    <div>
      <form action={createPost} className="flex flex-col gap-4">
        <input type="text" name="title" placeholder="Title" id="title" className="p-2 rounded-md" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Create Post</button>  
      </form>
    </div>
  );
}