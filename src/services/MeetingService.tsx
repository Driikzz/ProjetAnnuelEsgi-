import axios from 'axios';

const API_URL = 'http://localhost:3000/api/meetings';

const MeetingService = {
  submitStartOfYearMeetingForm: async (data: any, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/duos/${data.duoId}/startOfYearMeeting`, data, {
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
  
  submitMidTermMeetingForm: async (data: any, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/duos/${data.duoId}/midTermMeeting`, data, {
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

  submitEndOfYearMeetingForm: async (data: any, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/duos/${data.duoId}/endOfYearMeeting`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit end of year meeting form:', error);
      throw error;
    }
  }
};

export default MeetingService;
