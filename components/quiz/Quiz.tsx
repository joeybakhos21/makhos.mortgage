"use client";

import { useState } from "react";
import { QuizState, QuestionId, AnswerValue } from "@/types/quiz";
import { QUESTIONS, FIRST_QUESTION, getNextQuestion } from "@/lib/questions";
import { generateRecommendation } from "@/lib/recommendation";
import ProgressBar from "./ProgressBar";
import QuizCard from "./QuizCard";
import ResultCard from "./ResultCard";


function initialState(): QuizState {
  return {
    answers: {},
    currentQuestionId: FIRST_QUESTION,
    history: [],
    completed: false,
  };
}

export default function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>(initialState);

  function handleAnswer(questionId: QuestionId, value: AnswerValue) {
    const newAnswers = { ...quizState.answers, [questionId]: value };
    const nextId = getNextQuestion(questionId, newAnswers);

    if (nextId === null) {
      setQuizState({
        answers: newAnswers,
        currentQuestionId: questionId,
        history: [...quizState.history, questionId],
        completed: true,
      });
    } else {
      setQuizState({
        answers: newAnswers,
        currentQuestionId: nextId,
        history: [...quizState.history, questionId],
        completed: false,
      });
    }
  }

  function handleBack() {
    const history = [...quizState.history];
    const prev = history.pop();
    if (!prev) return;
    setQuizState({
      ...quizState,
      currentQuestionId: prev,
      history,
      completed: false,
    });
  }

  function handleRestart() {
    setQuizState(initialState());
  }

  const currentQuestion = QUESTIONS[quizState.currentQuestionId];

  if (quizState.completed) {
    const result = generateRecommendation(quizState.answers);
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <ResultCard result={result} answers={quizState.answers} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <ProgressBar stepsCompleted={quizState.history.length} />
      </div>
      <QuizCard
        question={currentQuestion}
        existingAnswer={quizState.answers[quizState.currentQuestionId]}
        onAnswer={handleAnswer}
        onBack={handleBack}
        canGoBack={quizState.history.length > 0}
      />
    </div>
  );
}
