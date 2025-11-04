
import React from 'react';

interface ResultDisplayProps {
  content: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
    // Basic Markdown to HTML conversion for demonstration
    const formatContent = (text: string) => {
        return text
            .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-brand-accent mt-6 mb-3 border-b border-neutral-medium/70 pb-2">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
            .replace(/^- (.*)/gm, '<li class="ml-5 list-disc">$1</li>')
            .replace(/(\r\n|\n|\r)/gm, '<br />') // preserve line breaks
            .replace(/<br \/><li/g, '<li'); // fix line breaks before list items
    };

  return (
    <div className="bg-neutral-medium/50 p-6 rounded-lg shadow-lg border border-neutral-medium text-gray-300 leading-relaxed prose prose-invert max-w-none">
       <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
    </div>
  );
};

export default ResultDisplay;
