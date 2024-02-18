import { useState } from "react";
import { useDeletePostMutation, useGetPostQuery, useUpdatePostMutation } from "../api/posts";


type PostPageProps = {
  postId: number;
}

export const PostPage: React.FC<PostPageProps> = ({ postId }) => {
  const { data, error, isLoading, isFetching } = useGetPostQuery(postId);
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  const [newContent, setNewContent] = useState("")

  return (
    <div>
      <h2>Post Page</h2>
      {isLoading && <div>Loading...</div>}
      {isFetching && <div>Fetching...</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}
      {updateMutation.isPending && <div>Updating...</div>}
      {deleteMutation.isPending && <div>Deleting...</div>}
      {data ? (
        <div>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
          <p>Post Form {postId}</p>
          <form onSubmit={e => {
            e.preventDefault();
            updateMutation.mutate({ ...data, body: newContent });
          }}>
            <input type="text" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
            <button type="submit" onClick={() => updateMutation.mutate({ ...data, body: newContent })}>Update</button>
            <button type="button" onClick={() => deleteMutation.mutate(postId)}>Delete</button>
          </form>
        </div>
      ) : (
        <p>No post selected</p>
      )}
    </div>
  )
}