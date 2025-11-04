
import React, { useState, useCallback } from 'react';
import { analyzePdfReport } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { LogoIcon, SpinnerIcon, AlertTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo PDF para analisar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzePdfReport(file);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao analisar o documento. Verifique o console para mais detalhes e certifique-se que sua API key está configurada.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-dark text-neutral-light flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-neutral-medium/50">
          <div className="flex items-center gap-4">
            <LogoIcon className="h-12 w-12 text-brand-accent" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Analisador de Laudo</h1>
              <p className="text-sm text-gray-400">Análise técnica de laudos de insalubridade com IA</p>
            </div>
          </div>
        </header>

        <main className="mt-8">
          <div className="bg-neutral-medium/50 p-6 rounded-lg shadow-lg border border-neutral-medium">
            <h2 className="text-xl font-semibold mb-4 text-brand-accent">1. Carregue o Laudo Pericial</h2>
            <p className="text-gray-300 mb-6">
              Selecione o documento PDF do laudo de insalubridade que você deseja analisar. O arquivo será processado localmente no seu navegador para extração de dados antes de ser enviado para análise.
            </p>
            <FileUpload onFileChange={handleFileChange} />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!file || isLoading}
              className="flex items-center justify-center gap-3 w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary disabled:bg-neutral-medium disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="animate-spin h-5 w-5" />
                  Analisando...
                </>
              ) : (
                'Analisar Documento'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative flex items-center gap-3">
              <AlertTriangleIcon className="h-5 w-5" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {analysisResult && (
             <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-brand-accent border-b border-brand-accent/30 pb-2">2. Resultado da Análise</h2>
                <ResultDisplay content={analysisResult} />
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
