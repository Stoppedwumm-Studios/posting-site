"use client"
import { getPosts, ProcessComment, GetComments, setUser, getUser } from "@/server/processor";
import Post from "c/post";
import Comment from "c/comment";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import fbConfig from '@/server/firebase';
import { signInAnonymously, getAuth } from "firebase/auth";
import {initializeApp} from 'firebase/app';

export default function Home() {
    const [post, setPost] = useState(undefined)
    const [loaded, setLoaded] = useState(false)
    const [comments, setComments] = useState([])
    const [commentLoading, setCommentLoading] = useState(false)
    const [user, setUser] = useState(undefined)
    const searchParams = useSearchParams()
    useEffect(() => {
        async function exec() {
            const p = await getPosts();
            p.every((po) => {
                if (po.id == Number(searchParams.get("id"))) {
                    setPost(po);
                }
                return true
            })
            setLoaded(true)
        }
        exec()

    }, [])
    useEffect(() => {
        async function exec() {
            if (post != undefined) {
                const c = await GetComments(post.id);
                setComments(c)
                setCommentLoading(true)
            }
        }
        exec()
    }, [post])
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
          if (user != undefined) {
            console.log(await getUser(user.uid))
          }
        }
        exec()
      }, [user])
    return (
        <>
            {post != undefined ?
                <Post key={post.id} title={post.title} cdnUrl={post.content} tags={post.tags} id={post.id}/>
                : loaded ? <p>post not found</p> : <p>loading...</p>}
            <h1>Comments</h1>
            <h2>Add a comment</h2>
            <form onSubmit={async (e) => {
                e.preventDefault()
                await ProcessComment([{
                    post_id: post.id,
                    comment: e.target.comment.value
                }])
                const c = await GetComments(post.id);
                setComments(c)
                e.target.comment.value = ""
            }}>
                <input type="text" name="comment" autoComplete="off" />
                <button type="submit">submit</button>
            </form>
            {commentLoading ? comments.length == 0 ? <p>no comments yet</p> : comments.map(comment => <Comment key={comment.id} comment={comment} />) : <p>loading...</p>}
        </>
    )
}