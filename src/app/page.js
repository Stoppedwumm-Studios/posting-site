"use client"
import Post from "c/post";
import { getPosts, getUser, setUser as SU } from "@/server/processor"
import { useEffect, useState } from "react";
import { GrabFlagsEnabled } from "@/server/serverCFG";
import fbConfig from '@/server/firebase';
import { signInAnonymously, getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';

export default function Home() {
  const [posts, setPosts] = useState([])
  const [enabledFlags, setFlags] = useState([])
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    async function exec() {
      let fetchedPosts = await getPosts()
      // We store all fetched posts in state
      setPosts(fetchedPosts)
      console.log(await GrabFlagsEnabled("example"))
    }
    exec()
  }, [])

  useEffect(() => {
    async function exec() {
      const app = initializeApp(fbConfig)
      const auth = getAuth(app)
      const login = await signInAnonymously(auth)
      setUser(login.user)
    }
    exec()
  }, [])

  useEffect(() => {
    async function exec() {
      if (user !== undefined) {
        console.log(await getUser(user.uid))
      }
    }
    exec()
  }, [user])

  // --- SORTING LOGIC ---
  
  // Latest: Sort by ID descending (assuming higher ID = newer) and take top 10
  const latestPosts = [...posts]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

  // Trending: Sort by Likes descending and take top 10
  const trendingPosts = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  return (
    <>
      <main>
        <h1>Top 10 latest posts:</h1>
        <top10>
          {latestPosts.length > 0 ? latestPosts.map((post) => (
            <Post 
              key={post.id} 
              title={post.title} 
              cdnUrl={post.content} 
              tags={post.tags} 
              id={post.id} 
              likes={post.likes} 
              onLikeClick={() => {
                if (user !== undefined) {
                  SU(user.uid, post.id)
                }
              }} 
            />
          )) : <p>Loading latest posts...</p>}
        </top10>

        <h1>Trending:</h1>
        <trending>
          {trendingPosts.length > 0 ? trendingPosts.map((post) => (
            <Post 
              key={`trending-${post.id}`} // Unique key for trending list
              title={post.title} 
              cdnUrl={post.content} 
              tags={post.tags} 
              id={post.id} 
              likes={post.likes} 
              onLikeClick={() => {
                if (user !== undefined) {
                  SU(user.uid, post.id)
                }
              }} 
            />
          )) : <p>No trending posts yet</p>}
        </trending>
      </main>
    </>
  );
}
