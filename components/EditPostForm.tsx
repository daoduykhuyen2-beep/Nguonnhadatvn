"use client";
import PostForm from "@/components/PostForm";
import { updatePost } from "@/app/actions/posts";
import type { Post } from "@/lib/types";

export default function EditPostForm({ post }: { post: Post }) {
  const action = updatePost.bind(null, post.id);
  return <PostForm action={action} post={post} submitLabel="Lưu thay đổi" />;
}
