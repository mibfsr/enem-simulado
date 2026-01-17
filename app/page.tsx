// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import QuestaoCard from './QuestaoCard';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Ícones bonitos (se não tiver, usaremos texto)

export default function Home() {
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NOVO: Controla qual questão está aparecendo agora
  const [indiceAtual, setIndiceAtual] = useState(0);

  useEffect(() => {
    async function carregarQuestoes() {
      try {
        const q = query(
            collection(db, "questoes"), 
            orderBy("numero", "asc"),
            limit(90) // Traz a prova toda
        );
        const querySnapshot = await getDocs(q);
        const lista: any[] = [];
        querySnapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() });
        });
        setQuestoes(lista);
      } catch (error) {
        console.error("Erro ao buscar:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarQuestoes();
  }, []);

  // Funções de Navegação
  const irParaProxima = () => {
    if (indiceAtual < questoes.length - 1) setIndiceAtual(indiceAtual + 1);
  };

  const irParaAnterior = () => {
    if (indiceAtual > 0) setIndiceAtual(indiceAtual - 1);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl text-blue-600 font-bold">Carregando prova... ⏳</div>;

  const questaoAtual = questoes[indiceAtual];
  const progresso = ((indiceAtual + 1) / questoes.length) * 100;

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl">
        
        {/* Cabeçalho com Barra de Progresso */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex justify-between items-center mb-2 text-sm font-bold text-gray-500">
                <span>Questão {indiceAtual + 1} de {questoes.length}</span>
                <span>{Math.round(progresso)}% concluído</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }}></div>
            </div>
        </div>

        {/* O Card da Questão (Só mostra UM por vez) */}
        <div className="min-h-[400px]">
            {questaoAtual && <QuestaoCard key={questaoAtual.id} dados={questaoAtual} />}
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-8">
            <button 
                onClick={irParaAnterior}
                disabled={indiceAtual === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${indiceAtual === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-700 shadow hover:bg-blue-50'}`}
            >
                ⬅️ Anterior
            </button>

            <button 
                onClick={irParaProxima}
                disabled={indiceAtual === questoes.length - 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${indiceAtual === questoes.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'}`}
            >
                Próxima ➡️
            </button>
        </div>

      </div>
    </main>
  );
}