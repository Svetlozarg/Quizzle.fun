import { reactive, watch } from 'vue';
import fetchEasyQuiz from '../lib/EASY_API';

export default function getEasyQuiz() {
  const easyQuizObj = reactive({
    loading: false,
    error: '',
    data: [],
  });

  async function loadEasyQuiz() {
    try {
      easyQuizObj.error = '';
      easyQuizObj.data = [];
      easyQuizObj.data = await fetchEasyQuiz();
    } catch (error) {
      easyQuizObj.error = error.message || 'Error loading quiz';
    }
  }

  watch(() => fetchEasyQuiz(), () => {
    loadEasyQuiz();
  }, { immediate: true });

  return easyQuizObj;
}