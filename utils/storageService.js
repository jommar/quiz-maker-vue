const STORAGE_KEY = "quizzes";

export const getQuizzes = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveQuizzes = (quizzes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
};

export const getQuizByTitle = (title) => {
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.title === title);
};

export const updateQuiz = (updatedQuiz) => {
  const quizzes = getQuizzes();
  const index = quizzes.findIndex((q) => q.title === updatedQuiz.title);
  if (index !== -1) {
    quizzes[index] = updatedQuiz;
    saveQuizzes(quizzes);
  }
};

export const deleteQuiz = (title) => {
  const quizzes = getQuizzes();
  const filtered = quizzes.filter((q) => q.title !== title);
  saveQuizzes(filtered);
};

export const addQuiz = (newQuiz) => {
  const quizzes = getQuizzes();
  quizzes.push(newQuiz);
  saveQuizzes(quizzes);
};

export const exportQuizzes = () => {
  const quizzes = getQuizzes();
  return JSON.stringify(quizzes);
};

export const importQuizzes = (jsonString) => {
  try {
    const importedQuizzes = JSON.parse(jsonString);
    if (!Array.isArray(importedQuizzes)) throw new Error("Invalid format");

    const existingQuizzes = getQuizzes();
    const existingMap = Object.fromEntries(
      existingQuizzes.map((q) => [q.title, q])
    );

    for (const quiz of importedQuizzes) {
      // Overwrite if same title exists
      existingMap[quiz.title] = quiz;
    }

    const merged = Object.values(existingMap);
    saveQuizzes(merged);
    return true;
  } catch (e) {
    console.error("Failed to import quizzes:", e);
    return false;
  }
};
