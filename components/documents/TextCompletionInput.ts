import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

const TextCompletionInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample completion data - in a real app, this would come from your backend
  const sampleCompletions = [
    'Hello world',
    'How are you doing?',
    'Hello there',
    'Have a great day',
    'Happy coding'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Only show suggestions if input has content
    if (value.trim()) {
      const filteredSuggestions = sampleCompletions.filter(completion =>
        completion.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setIsShowingSuggestions(filteredSuggestions.length > 0);
    } else {
      setIsShowingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setIsShowingSuggestions(false);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsShowingSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Start typing for suggestions..."
        className="w-full p-2 border rounded"
      />
      
      {isShowingSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextCompletionInput;