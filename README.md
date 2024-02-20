# React Query CRUD Example with Authentication

This is a comprehensive guide answering the main questions about React Query usage in your React application. It covers all important topics and allows you to build your app within 10 minutes. We will be using [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) here. I'll make another guide to use Axios.

- Why use React Query and why not to use Redux and other state management frameworks to store your API data?
- How to fetch, store, and share that data across all your components?
- How to Create, Update, and Delete entities and keep your data up to date?
- How to isolate the API layer of your application?
- How to work with authentication and pass tokens to your protected API?

## Why Should You Use React Query?

- React Query can be described as an async state manager.
- Just use query hooks across your app and React Query will do the job.
- No extra network calls are needed. React Query will refetch data only if it's expired (stale) or invalidated.

## Why Should You Not Use Redux and Other State Management Frameworks to Store Your API Data?

- React Query will take care of how async data is requested and stored in your app.
- As mentioned before, React Query can be described as an async state manager.
- You don't need to inform any other state managers about the data you requested. It can be easily accessed from React Query.

## How to Fetch, Store, and Share That Data Across All Your Components?

Look at the basic example we have in `QueryPage.tsx`. Note that in `App.tsx` we render 3 `QueryPage` components.
```
const { isPending, error, data } = useQuery({
  queryKey: ['repoData'],
  queryFn: () =>
    fetch('https://api.github.com/repos/TanStack/query').then((res) =>
      res.json(),
    ),
})
```
This is the way you'll normally see it in the [React Query docs](https://tanstack.com/query/latest/docs). Let's walk through this example and understand the main concepts:
- `useQuery` is a hook you call to access your data. It'll work as a subscription and when the API call state is changed or data is received, it'll inform your component. In `App.tsx` we render 3 `QueryPage` components but if you open the network tab, you'll see that only one call is fired. For more [read the docs](https://tanstack.com/query/latest/docs/framework/react/guides/queries).
- `queryKey` is used as a dependency key to store our data. React Query will refetch data if you pass a new `queryKey` or you invalidate these keys from any other place. We will dive deeper later, for more [read the docs](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys).
- `queryFn` accepts any promise to return data. Used to fetch your data. You can keep data mapping and error handling inside instead of passing arguments. We will dive deeper later, for more [read the docs](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions).
- `isPending` if true means the query has no data yet. It's returned in a result object of `useQuery`. In most cases, use this to show loading spinners. If you want more details about a result object of `useQuery`, [here is the docs](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery).
- `error` will be present if `queryFn` failed. By default, React Query will execute `queryFn` again and again until the data is present. So, `isPending` will still be false and the user will only see a loading spinner.
  - If you want to turn off retries, [here is the docs](https://tanstack.com/query/v5/docs/framework/react/guides/query-retries). 
  - If you want to handle the error of API call and notify the user about them - handle it in the function you pass to `queryFn`.
- `data` is the information your promise returns. You can do the mapping and control the format in `queryFn`. It'll be `undefined` until the data is fetched.

Now let's make it pretty and isolate the API layer. After that, we'll start working with CRUD and Authentication.

## How to Isolate API Layer of the Application?

From the example below, you can see that it may be complicated to reuse that hook across the application. We'll have to configure the way to fetch data in every component we want to access the API data.

The API layer is used to communicate with the Backend of the application, and it's better to isolate it from the other layers of the Frontend Application. React components don't need to worry about the API we use to fetch the data and the configuration we use to fetch. It only needs a way to get the data and work with it.

So, under the `src` folder, we create an `api` folder and will keep everything related to the API layer. Currently, we have an Authentication API and only one Resource, which is Post.

- We create the `auth` folder to work with the Authentication API. Login, Sign up, token fetching should be there.
- We create the `posts` folder to work with our Post resource. It uses common CRUD operations. Don't know what CRUD (Create, Read, Update, Delete) operations are? [Read here.](https://www.codecademy.com/article/what-is-crud)

Under each folder, we create the `apis.ts` file to work with the API. Data mapping and error handling will be done there. We'll pass them to `queryKey` and `mutationFn` of React Query.

Since in this guide we use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) we don't have interceptors for request and response. But since it's isolated, we can easily update it to use Axios in the future.

In the `types.ts` folder, we'll keep Request and Response type definitions. Note that we keep `Post` and `User` in the `src/models` folder because that data isn't API specific and is used in the UI too.

In the `hooks.ts` file, we use hooks that we'll use in the React components. That's our access point to the API layer.

Now let's use our API layer to make it alive!

## How to Work with Authentication and Pass Tokens to Your Protected API?

It's very common in development to have protected resources. Not every user should be allowed to see it. Authentication isn't only API-related, we also use it to render components, so it can be considered as a general APP state.

Here we create `AuthContext`. We wrap `App` with `AuthProvider` and now can manipulate the user state in there. We use it as an interface to log in and log out. Later we can add access control and other user rendering-related functionality. We create `useAuthContext` to easily access the context.

`AuthPage` is a page component to create a form (we can keep client validation in there) for user interaction, show the auth state, and inform `AuthContext` that the form was submitted.

We'll `useAuthContext` to retrieve the token and pass it to the fetch function. So we don't need to worry about authentication in our view components.

All our Post APIs are protected. But if we want to make a `GET` request not protected, we'll only have to refactor our `useGetPostQuery` and `getPost` not to use a token and maybe update the `URL`.

Now let's use our API layer in the Application.

## How to Fetch, Store, and Share That Data Across All Your Components?

While working with the API layer accessing the data now all we have to do is call the proper query hook. For example:
```
const { isFetching, error, data } = useGetPostsQuery();
``` 
or
```
const [page, setPage] = useState(0);
const { data, error, isLoading, isFetching } = useSearchPostsQuery({ skip: page * LIMIT, limit: LIMIT });
```
or
```
const { data, error, isFetching } = useGetPostQuery(postId);
```
In React components, we only need to pass parameters of the data we want to get. Our API layer will do the job.
- If parameters haven't changed and data isn't stale, a new network call won't be made.
- React Query will also cache data, so if we already fetched data and it's still valid, a new network call also won't be made. We'll just get it from the cache.
- We can call all these hooks across multiple components, the network call will be only made once.
- If we already have data stored but React Query makes another Network call to keep our data up to date, `isPending` will still be false and the user won't see a spinner. Therefore, the UI is still good and the network call was made in the background.

## How to Create, Update, Delete, and Refetch Data?

For that, React Query has [mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations). Unlike queries, mutations accept callbacks that will be executed `onSuccess`, `onError`, and `onMutate` (when the mutation is started). And return a `mutate` function to perform the function you passed to `mutationFn`. Let's look at an example:

```
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation({
    mutationFn: (request: CreatePostRequest) => createPost(request, token!),
    onMutate: async (request: CreatePostRequest) => {},
    onSuccess: (newPost: Post) => {
      queryClient.setQueryData(['posts', { id: newPost.id }], newPost);
      queryClient.setQueryData(['posts', { type: 'list' }], (oldData: ListPostsResponse) => ({
        ...oldData,
        posts: [newPost, ...oldData.posts],
      }));
    },
    onError: (_error: Error) => {},
  });
}
```
and usage
```
const createPostMutation = useCreatePostMutation();
...
<form
  onSubmit={(e) => {
    e.preventDefault();
    createPostMutation.mutate({
      title,
      userId: user?.id,
    });
  }}
>
...
```

- `mutationFn` is the API call to execute. In that case, it's protected, so we retrieve a token first and then pass it to the API call function.
- `onMutate` will be run before `mutationFn`. [For more read about mutation side effects](https://tanstack.com/query/latest/docs/framework/react/guides/mutations#mutation-side-effects).
- `onSuccess` will be run if `mutationFn` execution is successful.
- `onError` will be run if `mutationFn` execution is fails.
- `onSettled` works similar to `finally` in [js promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally). Will be run after `mutationFn` execution is finished, successfully or with error doesn't matter.

Here in `onSuccess`, we set query data with `setQueryData`. This immediately updates our cache (store) with a new returned object to prevent a new network call, and we can benefit by navigating to a new page without a loading spinner showing. For more [read the docs](https://tanstack.com/query/v5/docs/framework/react/guides/updates-from-mutation-responses).

In the React component, we run that mutation by calling the `mutate` function that is a method of an object returned by `useMutation`.

Keep in mind that updates via `setQueryData` must be performed in an immutable way. [Read the docs](https://tanstack.com/query/v5/docs/framework/react/guides/updates-from-mutation-responses#immutability).

### Update and Invalidate `queryKey`. 

In the Update mutation, instead of manually setting query data, we just invalidate queries by `invalidateQueries`. By that, React Query will know that data stored by that `queryKey` is not valid anymore and will make another network call to update data.
```
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  return useMutation({
    mutationFn: (post: Post) => updatePost(post, token!),
    onSuccess: (newPost) => {
      // https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations.
      // Invalidate data from the cache and make a new network request to refecth the data.
      queryClient.invalidateQueries({ queryKey: ['posts', { id: newPost.id }] });
      queryClient.invalidateQueries({ queryKey: ['posts', { type: "list" }] });
    },
  });
}
```
The usage is very straightforward
```
const deleteMutation = useDeletePostMutation();
...
<button type="button" onClick={() => deleteMutation.mutate(postId)}>Delete</button>
...
```

## Stale Time

This is one of the main concepts you have to be aware of. By default, React Query will run all queries presented on rendered components on every change in window focus, component mount, network regain. To prevent overfetching, you should use `staleTime`. It'll indicate how long data will be up to date on the page. In the config below, we make `staleTime` equal to 5 minutes, which means a new fetch will be done only after 5 minutes on any of the listed events OR on `queryKey` invalidation.

```
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  }
});
```

## Useful topics and links.
- [Thinking in React Query.](https://tkdodo.eu/blog/thinking-in-react-query).
- [React Query as a State Manager.](https://tkdodo.eu/blog/react-query-as-a-state-manager)
- [Query invalidation.](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation)
- [Queries.](https://tanstack.com/query/v5/docs/framework/react/guides/queries)
- [Mutations.](https://tanstack.com/query/v5/docs/framework/react/guides/mutations)

## Scripts
- dev/start - start dev server and open browser
- build - build for production
- preview - locally preview production build
- test - launch test runner