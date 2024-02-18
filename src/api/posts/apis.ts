import { Post } from "../../models";
import { CreatePostRequest, ListPostsResponse, SearchPostsRequest } from "./types";


async function fetchWithAuth(input: RequestInfo | URL, token: string, init?: RequestInit | undefined): Promise<Response> {
  const authOptions = {
    ...init,
    headers: {
      ...init?.headers,
      'Authorization': `Bearer ${token}`,
    },
  };
  return fetch(input, authOptions);
}


export const getPosts = async (token: string): Promise<ListPostsResponse> => {
  const response = await fetchWithAuth("https://dummyjson.com/auth/posts", token, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export const searchPosts = async (request: SearchPostsRequest, token: string): Promise<ListPostsResponse> => {
  const response = await fetchWithAuth(
    `https://dummyjson.com/auth/posts?skip=${request.skip}&limit=${request.limit}`,
    token,
    { method: "GET" });

  if (!response.ok) {
    throw new Error("Failed to search posts");
  }

  return response.json();

}

export const getPost = async (postId: number, token: string): Promise<Post> => {
  const response = await fetchWithAuth(`https://dummyjson.com/auth/posts/${postId}`, token, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}

export const createPost = async (request: CreatePostRequest, token: string): Promise<Post> => {
  const response = await fetchWithAuth("https://dummyjson.com/auth/posts/add", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export const updatePost = async (post: Post, token: string): Promise<Post> => {
  const response = await fetchWithAuth(`https://dummyjson.com/auth/posts/${post.id}`, token, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
};

export const deletePost = async (postId: number, token: string): Promise<void> => {
  const response = await fetchWithAuth(`https://dummyjson.com/auth/posts/${postId}`, token, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
};
