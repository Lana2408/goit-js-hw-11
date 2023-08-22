import axios from "axios";

const API_KEY = "38946466-fa6699ad8b99455192464034d";
const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages(value, page = 1)
 {
        axios.defaults.params = {
          key: API_KEY,
          q: value,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: page,
        }; 
        return await axios.get(BASE_URL);
      }
  
  
  export { fetchImages };