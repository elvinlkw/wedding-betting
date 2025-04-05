import Cookies from 'js-cookie';
import axios from 'axios';

export type GuestBody = {
  firstName: string;
  lastName: string;
  tableNumber: number | null;
};

export type Guest = {
  guestId: number;
  firstName: string;
  lastName: string;
  tableNumber: number | null;
};

export type GuestResponse = {
  count: number;
  data: Guest[];
};

class Guests {
  async getAllGuests(): Promise<GuestResponse> {
    const response = await axios.get('/api/guests');
    return response.data;
  }

  async getGuestsByTable(tableNumber: number): Promise<GuestResponse> {
    const response = await axios.get(`/api/guests?tableNumber=${tableNumber}`);
    return response.data;
  }

  async createGuest(body: GuestBody) {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('jwttoken'),
      },
    };

    const response = await axios.post('/api/guests', body, config);
    return response.data;
  }

  async updateGuest(id: number, body: GuestBody) {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('jwttoken'),
      },
    };
    const response = await axios.put(`/api/guests/${id}`, body, config);
    return response.data;
  }

  async deleteGuest(id: number) {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('jwttoken'),
      },
    };
    const response = await axios.delete(`/api/guests/${id}`, config);
    return response.data;
  }
}

export default new Guests();
