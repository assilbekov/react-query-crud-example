import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts, searchPosts, getPost, createPost, updatePost, deletePost } from "./apis"
import type { SearchPostsRequest, ListPostsResponse, CreatePostRequest } from "./types";
import { Post } from "../../models";
import { useAuthContext } from "../../state/AuthContext";


export const useGetPostsQuery = () => {
  const { token } = useAuthContext();

  return useQuery({
    queryKey: ["posts", { type: "list" }],
    queryFn: async () => getPosts(token!),
  });
}

export const useSearchPostsQuery = (request: SearchPostsRequest) => {
  const { token } = useAuthContext();

  return useQuery({
    queryKey: ["posts", { type: "search", request }],
    queryFn: async () => searchPosts(request, token!),
  });
}

export const useGetPostQuery = (id: number) => {
  const { token } = useAuthContext();

  return useQuery({
    queryKey: ["posts", { id }],
    queryFn: async () => getPost(id, token!),
  });
}

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation({
    mutationFn: (request: CreatePostRequest) => createPost(request, token!),
    onMutate: async (_request) => {
      // Do something before the mutation
    },
    onSuccess: (newPost) => {
      // https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses.
      // Prevent wasting a network call. Updates from Mutation Responses
      queryClient.setQueryData(['posts', { id: newPost.id }], newPost);
      queryClient.setQueryData(['posts', { type: 'list' }], (oldData: ListPostsResponse) => ({
        // Make sure to update in an immutable way.
        // https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses#immutability.
        ...oldData,
        posts: [newPost, ...oldData.posts],
      }));
    },
    onError: (_error) => {
      // Do something if the mutation fails
    },
  });
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation({
    mutationFn: (post: Post) => updatePost(post, token!),
    onMutate: async (_request) => {
      // Do something before the mutation
    },
    onSuccess: (newPost) => {
      // https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations.
      // Invalidate data from the cache and make a new network request to refecth the data.
      queryClient.invalidateQueries({ queryKey: ['posts', { id: newPost.id }] });
      queryClient.invalidateQueries({ queryKey: ['posts', { type: "list" }] });
    },
    onError: (_error) => {
      // Do something if the mutation fails
    },
  });
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation({
    mutationFn: (id: number) => deletePost(id, token!),
    onMutate: async (_request) => {
      // Do something before the mutation
    },
    onSuccess: (_result, postId) => {
      // Prevent wasting a network call. Updates from Mutation Responses
      queryClient.setQueryData(['posts', { postId }], undefined);
      queryClient.setQueryData(['posts', { type: 'list' }], (oldData: ListPostsResponse) => ({
        // Make sure to update in an immutable way.
        // https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses#immutability.
        ...oldData,
        posts: oldData.posts.filter((post) => post.id !== postId),
      }));
    },
    onError: (_error) => {
      // Do something if the mutation fails
    },
  });
}
