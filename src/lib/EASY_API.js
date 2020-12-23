export default async function fetchEasyQuiz(token) {
  const response = await fetch(`https://opentdb.com/api.php?amount=50&token=${token}&difficulty=easy&type=multiple`, {
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