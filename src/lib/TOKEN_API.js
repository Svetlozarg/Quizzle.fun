export default async function fetchToken() {
  const response = await fetch(`https://opentdb.com/api_token.php?command=request`, {
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  const error = new Error('Quiz not found');
  throw error;
}