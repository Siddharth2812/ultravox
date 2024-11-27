'use client';

import React, { useState, useEffect } from 'react';
import { handleFormSubmit } from '@/lib/clientTools';

interface Question {
  id: string;
  type: 'text' | 'number' | 'select' | 'radio';
  label: string;
  options?: string[];
  required: boolean;
}

interface FormData {
  id: string;
  questions: Question[];
  category: string;
}

const FinancialForm: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<FormData | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    const handleFormDisplay = (event: CustomEvent<FormData>) => {
      setCurrentForm(event.detail);
      setResponses({});
    };

    window.addEventListener('formDisplayed', handleFormDisplay as EventListener);
    return () => {
      window.removeEventListener('formDisplayed', handleFormDisplay as EventListener);
    };
  }, []);

  const handleInputChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentForm) {
      handleFormSubmit(currentForm.id, responses);
      setCurrentForm(null);
    }
  };

  if (!currentForm) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {currentForm.category.charAt(0).toUpperCase() + currentForm.category.slice(1)} Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentForm.questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            
            {question.type === 'text' && (
              <input
                type="text"
                className="w-full p-2 border rounded"
                required={question.required}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
              />
            )}
            
            {question.type === 'number' && (
              <input
                type="number"
                className="w-full p-2 border rounded"
                required={question.required}
                onChange={(e) => handleInputChange(question.id, Number(e.target.value))}
              />
            )}
            
            {question.type === 'select' && question.options && (
              <select
                className="w-full p-2 border rounded"
                required={question.required}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {question.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
            
            {question.type === 'radio' && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      required={question.required}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      className="mr-2"
                    />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FinancialForm;