const STORAGE_KEY = "bestScores";

export const getBestScores = () => {
  if (process.client) {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
  return {};
};

export const getBestScoreForQuiz = (quizTitle) => {
  const scores = getBestScores();
  return scores[quizTitle] || null;
};

export const saveBestScore = (quizTitle, score) => {
  const scores = getBestScores();
  if (!scores[quizTitle] || score > scores[quizTitle]) {
    scores[quizTitle] = score;
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    }
  }
};

export const clearBestScores = () => {
  if (process.client) {
    localStorage.removeItem(STORAGE_KEY);
  }
};
