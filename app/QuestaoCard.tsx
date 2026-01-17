// app/QuestaoCard.tsx
'use client';
import { useState } from 'react';

export default function QuestaoCard({ dados }: { dados: any }) {
  const [selecionada, setSelecionada] = useState<string | null>(null);

  // Função que roda quando clica numa alternativa
  function verificarResposta(letra: string) {
    if (selecionada) return; // Se já respondeu, não deixa mudar
    setSelecionada(letra);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-transform hover:scale-[1.01]">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 mb-4 uppercase tracking-wide">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Questão {dados.numero}</span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{dados.materia}</span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">{dados.ano}</span>
        {dados.dificuldade && (
           <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{dados.dificuldade}</span>
        )}
      </div>

      {/* Texto de Apoio */}
      {dados.texto_apoio && (
        <div className="mb-4 p-4 bg-gray-50 border-l-4 border-gray-300 italic text-gray-600 text-sm whitespace-pre-line">
          {dados.texto_apoio}
        </div>
      )}

      {/* Enunciado */}
      <p className="text-lg font-medium mb-6 leading-relaxed text-gray-800">
        {dados.enunciado}
      </p>

      {/* Alternativas Interativas */}
      <div className="space-y-3">
        {dados.alternativas?.map((alt: any) => {
          const isSelected = selecionada === alt.letra;
          const isCorrect = alt.letra === dados.resposta_correta;
          
          // Lógica das cores
          let estiloBorda = "border-gray-100 hover:bg-blue-50 hover:border-blue-300";
          let estiloLetra = "bg-blue-100 text-blue-600";

          if (selecionada) {
            if (isCorrect) {
               // Se essa é a correta, fica verde (mesmo se eu não cliquei nela, pra mostrar qual era a certa)
               estiloBorda = "border-green-500 bg-green-50";
               estiloLetra = "bg-green-500 text-white";
            } else if (isSelected && !isCorrect) {
               // Se eu cliquei nessa e está errada, fica vermelha
               estiloBorda = "border-red-500 bg-red-50";
               estiloLetra = "bg-red-500 text-white";
            } else {
               // As outras ficam apagadinhas
               estiloBorda = "border-gray-100 opacity-50";
            }
          }

          return (
            <button
              key={alt.letra}
              onClick={() => verificarResposta(alt.letra)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all flex items-start gap-3 ${estiloBorda}`}
              disabled={!!selecionada}
            >
              <span className={`font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors ${estiloLetra}`}>
                {alt.letra}
              </span>
              <span className="mt-1 text-gray-700">{alt.texto}</span>
            </button>
          );
        })}
      </div>
      
      {/* Feedback Final */}
      {selecionada && (
        <div className={`mt-4 text-center font-bold p-2 rounded ${selecionada === dados.resposta_correta ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {selecionada === dados.resposta_correta ? '🎉 Parabéns! Você acertou!' : `❌ Ops! A resposta certa era a letra ${dados.resposta_correta}`}
        </div>
      )}
    </div>
  );
}