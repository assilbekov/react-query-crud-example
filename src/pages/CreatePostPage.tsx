import { useState } from "react";
import { useCreatePostMutation } from "../api/posts";
import { useAuthContext } from "../state/AuthContext";


export const CreatePostPage: React.FC = () => {
  const { user } = useAuthContext()
  const createPostMutation = useCreatePostMutation();
  const [title, setTitle] = useState<string>("");

  if (!user) return null;

  return (
    <div>
      <h2>Create Post</h2>
      {createPostMutation.isError && <div>Error: {createPostMutation.error.message}</div>}
      {createPostMutation.isPending && <div>Loading...</div>}
      {createPostMutation.isSuccess && <div>Post created!</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPostMutation.mutate({
            title,
            userId: user?.id,
          });
        }}
      >
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  )
}