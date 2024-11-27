'use client';

import React, { useState, useEffect } from 'react';
import { FormData } from '@/lib/types';

const FormResponse: React.FC = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleFormUpdate = (event: CustomEvent<FormData>) => {
      console.debug('FormResponse: Received form data event:', event.detail);
      setFormData(event.detail);
      setAnswers({});
    };

    const handleCallEnded = () => {
      setFormData(null);
      setAnswers({});
    };

    console.debug('FormResponse: Adding event listeners');
    window.addEventListener('formResponseUpdated', handleFormUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      console.debug('FormResponse: Removing event listeners');
      window.removeEventListener('formResponseUpdated', handleFormUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
    };
  }, []);

  const handleInputChange = (questionIndex: number, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const missingRequired = formData?.questions
        .filter(q => q.required)
        .some((q, index) => !answers[index]);

      if (missingRequired) {
        throw new Error('Please fill in all required fields');
      }

      // Here you would typically send the answers back to the agent
      console.log('Form submitted with answers:', answers);
      
      // Clear form after successful submission
      setFormData(null);
      setAnswers({});
    } catch (error) {
      console.error('Form submission error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <div className="mt-10">
        <h1 className="text-xl font-bold mb-4">Form Response</h1>
        <div className="shadow-md rounded p-4">
          <span className="text-gray-500 text-base font-mono">No active form</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h1 className="text-xl font-bold mb-4">{formData.title}</h1>
      {formData.description && (
        <p className="text-gray-400 mb-4">{formData.description}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.questions.map((question, index) => (
          <div key={index} className="shadow-md rounded p-4">
            <label className="block text-gray-300 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.type === 'text' && (
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                required={question.required}
                onChange={(e) => handleInputChange(index, e.target.value)}
                value={answers[index] as string || ''}
                aria-label={question.question}
              />
            )}

            {question.type === 'number' && (
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                required={question.required}
                onChange={(e) => handleInputChange(index, e.target.value)}
                value={answers[index] as string || ''}
                aria-label={question.question}
              />
            )}

            {question.type === 'select' && question.options && (
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                required={question.required}
                onChange={(e) => handleInputChange(index, e.target.value)}
                value={answers[index] as string || ''}
                aria-label={question.question}
              >
                <option value="">Select an option</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {question.type === 'multiselect' && question.options && (
              <div className="space-y-2" role="group" aria-label={question.question}>
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={Array.isArray(answers[index]) && answers[index].includes(option)}
                      onChange={(e) => {
                        const currentAnswers = (answers[index] as string[]) || [];
                        const newAnswers = e.target.checked
                          ? [...currentAnswers, option]
                          : currentAnswers.filter(a => a !== option);
                        handleInputChange(index, newAnswers);
                      }}
                      className="bg-gray-800 border-gray-700"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default FormResponse;