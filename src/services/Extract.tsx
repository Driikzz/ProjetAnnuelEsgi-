import axios from "axios";

let URL_API = 'http://localhost:3000';


const ExtractService = {
    
    async extractData (token: string) {
        try {
          const response = await axios.get('http://localhost:3000/api/export/export', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
          });
          
          const url = window.URL.createObjectURL(response.data);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'users.xlsx';
          a.click();
        } catch (error) {
          console.error('Erreur lors de l\'extraction des données:', error);
        }
    }
}

export default ExtractService;