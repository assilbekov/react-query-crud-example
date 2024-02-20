import { useQuery } from "@tanstack/react-query"


export const QueryPage: React.FC = () => {
  const { isPending, error, data, } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const res = await fetch('https://api.github.com/repos/TanStack/query');
      
      if (!res.ok) {
        throw new Error("Failed!!!")
      }
      
      return await res.json();
    },
      retry: false,
      staleTime: 5000 * 5000, // 5000 seconds
  });

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}