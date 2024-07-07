import axios from 'axios';

const API_URL = 'http://localhost:3000/api/meetings';

const MeetingService = {
  submitStartOfYearMeetingForm: async (data: any, duoId: number, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/duos/${duoId}/startOfYearMeeting`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit start of year meeting form:', error);
      throw error;
    }
  },

  submitMidTermMeetingForm: async (data: any, duoId: number, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/duos/${duoId}/midTermMeeting`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit mid term meeting form:', error);
      throw error;
    }
  },

  submitEndOfYearMeetingForm: async (data: any, duoId: number, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/duos/${duoId}/endOfYearMeeting`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit end of year meeting form:', error);
      throw error;
    }
  },

  getStartOfYearMeeting: async (studentId: string, token: string) => {
    try {
      console.log('Fetching start of year meeting for studentId:', studentId);
      const response = await axios.get(`${API_URL}/students/${studentId}/startOfYearMeeting`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch start of year meeting:', error);
      throw error;
    }
  },

  getMidTermMeeting: async (studentId: string, token: string) => {
    try {
      console.log('Fetching mid term meeting for studentId:', studentId);
      const response = await axios.get(`${API_URL}/students/${studentId}/midTermMeeting`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mid term meeting:', error);
      throw error;
    }
  },

  getEndOfYearMeeting: async (studentId: string, token: string) => {
    try {
      console.log('Fetching end of year meeting for studentId:', studentId);
      const response = await axios.get(`${API_URL}/students/${studentId}/endOfYearMeeting`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch end of year meeting:', error);
      throw error;
    }
  }
};

export default MeetingService;
