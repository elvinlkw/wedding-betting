import guestsService, {
  Guest,
  GuestBody,
  GuestResponse,
} from '../services/guests.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGuest = () =>
  useQuery<GuestResponse>({
    queryKey: ['guests'],
    queryFn: guestsService.getAllGuests,
  });

export const useCreateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: GuestBody) => guestsService.createGuest(body),
    onSuccess: () => {
      // Invalidate the guests query to refetch data
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
};

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Guest) => {
      const { guestId, ...restBody } = body;
      return guestsService.updateGuest(guestId, restBody);
    },
    onSuccess: () => {
      // Invalidate the guests query to refetch data
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: guestsService.deleteGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
};
