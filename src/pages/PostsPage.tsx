import { Post } from "../models";
import { useGetPostsQuery } from "../api/posts";

type PostsPageProps = {
  onPostClick: (id: number) => void;
}

export const PostsPage: React.FC<PostsPageProps> = ({ onPostClick }) => {
  const { isPending, isLoading, isFetching, isError, error, data } = useGetPostsQuery();

  console.log({ isPending, isLoading, isFetching, error, data })

  return (
    <div>
      <h2>Posts Page</h2>
      {isLoading && <div>Loading...</div>}
      {isFetching && <div>Fetching...</div>}
      {isPending && <div>Pending...</div>}
      {isError && <div>Error: {JSON.stringify(error)}</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}
      {data && (
        <div>
          {data.posts.map((post: Post) => (
            <div key={post.id} onClick={() => onPostClick(post.id)}>{post.title}</div>
          ))}
        </div>
      )}
    </div>
  )
}
