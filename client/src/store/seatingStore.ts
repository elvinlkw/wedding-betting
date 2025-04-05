import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Guest, GuestResponse } from '../api/services/guests.service';

type Seatingstore = {
  guests: Guest[];
  guestCount: number;
  selectedGuest: number | null;
  setGuests: (guests: GuestResponse) => void;
  setSelectedGuest: (guestId: number | null) => void;
};

export const useSeatingStore = create<Seatingstore>()(
  devtools(
    (set) => ({
      guests: [],
      guestCount: -1,
      selectedGuest: null,
      setGuests: (guests: GuestResponse) =>
        set((state) => ({
          ...state,
          guests: guests.data.sort((a, b) =>
            a.lastName.localeCompare(b.lastName)
          ),
          guestCount: guests.count,
        })),
      setSelectedGuest: (guestId: number | null) =>
        set((state) => ({
          ...state,
          selectedGuest: guestId,
        })),
    }),
    { name: 'SeatingStore' }
  )
);
