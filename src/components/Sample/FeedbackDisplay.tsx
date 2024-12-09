import React from 'react';
import { Star, User } from 'lucide-react';
import type { SampleFeedback } from '../../types/sample';

interface FeedbackDisplayProps {
  feedback: SampleFeedback;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <img
          src={feedback.user.avatar}
          alt={feedback.user.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {feedback.user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < feedback.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {feedback.comment}
          </p>
        </div>
      </div>
    </div>
  );
}