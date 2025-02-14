import { useQuery } from '@tanstack/react-query';

export function useCurrentUser() {
  const { data } = useQuery<User>({
    queryKey: ['user', 'me'],
  });

  return { currentUser: data };
}
