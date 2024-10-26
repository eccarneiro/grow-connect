import axios from 'axios';

export const getSheet = async () => {
  const url = `${process.env.SHEETS_API}`
  const response = await axios.get(url);
  return (response.data);
}