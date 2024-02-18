import { useContext, useState } from 'react'
import { AuthContext } from './state/AuthContext'
import { AuthPage, CreatePostPage, PostPage, PostsPage, SearchPostsPage } from './pages';

function App() {
  const { token, logout, loginMutation } = useContext(AuthContext);
  const [postId, setPostId] = useState<number | null>(null);

  console.log({ token, loginMutation })

  return (
    <div>
      <h1>App login required.</h1>
      <AuthPage />
      {token && (
        <div>
          <button onClick={logout}>Logout</button>
          <CreatePostPage />
          {postId && <PostPage postId={postId} />}
          <PostsPage onPostClick={setPostId} />
          <SearchPostsPage />
        </div>
      )}
    </div>
  )
}

export default App
