"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from "next/navigation"

export async function createPost(formData: FormData) {
    const {data} = await cookieBasedClient.models.Post.create({
        title: formData.get('title')?.toString() || ''
    })
    console.log('data created ', data)
    redirect(`/`)
}