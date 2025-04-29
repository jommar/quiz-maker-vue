const STORAGE_KEY = 'quizzes'

export const getQuizzes = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const saveQuizzes = (quizzes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes))
}

export const getQuizByTitle = (title) => {
  const quizzes = getQuizzes()
  return quizzes.find(q => q.title === title)
}

export const updateQuiz = (updatedQuiz) => {
  const quizzes = getQuizzes()
  const index = quizzes.findIndex(q => q.title === updatedQuiz.title)
  if (index !== -1) {
    quizzes[index] = updatedQuiz
    saveQuizzes(quizzes)
  }
}

export const deleteQuiz = (title) => {
  const quizzes = getQuizzes()
  const filtered = quizzes.filter(q => q.title !== title)
  saveQuizzes(filtered)
}

export const addQuiz = (newQuiz) => {
  const quizzes = getQuizzes()
  quizzes.push(newQuiz)
  saveQuizzes(quizzes)
}

export const exportQuizzes = () => {
  const quizzes = getQuizzes()
  return JSON.stringify(quizzes)
}

export const importQuizzes = (jsonString) => {
  try {
    const quizzes = JSON.parse(jsonString)
    saveQuizzes(quizzes)
    return true
  } catch (e) {
    console.error('Failed to import quizzes:', e)
    return false
  }
}
