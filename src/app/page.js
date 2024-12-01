"use client"
import Post from "@/comps/post";
import {getPosts} from "@/server/processor"
import { useEffect, useState } from "react";


export default function Home() {
  const [p, setPosts] = useState([])
  useEffect(() => {
    async function exec() {
      const posts = await getPosts()
      setPosts(posts)
      console.log(posts)
    }
    exec()

  }, [])
  return (
    <>
    <main>
      {p.length > 0 ? p.map((post) => (
        <Post key={post.id} title={post.title} cdnUrl={post.content} />
      )): <p>no posts yet</p>}
    </main>
    </>
  );
}