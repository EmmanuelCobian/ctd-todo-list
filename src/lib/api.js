export const getAirtableUrl = () =>
  `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

export const getAuthToken = () => `Bearer ${import.meta.env.VITE_PAT}`;

export function createOptions(method = 'GET', token, body) {
  const headers = {
    Authorization: token,
  };

  if (method != 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
    body: JSON.stringify(body),
  };

  return options;
}
