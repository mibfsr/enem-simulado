// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import QuestaoCard from './QuestaoCard';
import { Trophy, XCircle, CheckCircle, RotateCcw } from 'lucide-react'; 

export default function Home() {
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [indiceAtual, setIndiceAtual] = useState(0);
  
  // NOVOS ESTADOS PARA O DASHBOARD
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    async function carregarQuestoes() {
      try {
        const q = query(collection(db, "questoes"), orderBy("numero", "asc"), limit(90));
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

  // Função chamada quando o usuário responde no Card
  const computarResposta = (acertou: boolean) => {
    if (acertou) setAcertos(acertos + 1);
    else setErros(erros + 1);
  };

  const irParaProxima = () => {
    if (indiceAtual < questoes.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setMostrarResultado(true); // Acabou a prova!
    }
  };

  const reiniciarSimulado = () => {
    setIndiceAtual(0);
    setAcertos(0);
    setErros(0);
    setMostrarResultado(false);
    window.location.reload(); // Força recarregar para limpar os estados dos cards
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-blue-600">Carregando prova... ⏳</div>;

  // --- TELA DE DASHBOARD FINAL (RESULTADO) ---
  if (mostrarResultado) {
    const total = acertos + erros;
    const porcentagem = Math.round((acertos / total) * 100) || 0;

    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <div className="flex justify-center mb-6">
            <Trophy size={64} className="text-yellow-500" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Simulado Finalizado!</h1>
          <p className="text-gray-500 mb-8">Veja como foi o seu desempenho hoje.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold mb-1">
                <CheckCircle size={20} /> Acertos
              </div>
              <span className="text-4xl font-black text-green-700">{acertos}</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center justify-center gap-2 text-red-600 font-bold mb-1">
                <XCircle size={20} /> Erros
              </div>
              <span className="text-4xl font-black text-red-700">{erros}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm font-bold text-gray-500 mb-1">
              <span>Aproveitamento</span>
              <span>{porcentagem}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all ${porcentagem > 70 ? 'bg-green-500' : porcentagem > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                style={{ width: `${porcentagem}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={reiniciarSimulado}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <RotateCcw /> Fazer Novo Simulado
          </button>
        </div>
      </main>
    );
  }

  // --- TELA DO SIMULADO (NORMAL) ---
  const questaoAtual = questoes[indiceAtual];
  const progresso = ((indiceAtual + 1) / questoes.length) * 100;

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl">
        {/* Barra de Progresso */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex justify-between items-center mb-2 text-sm font-bold text-gray-500">
                <span>Questão {indiceAtual + 1} de {questoes.length}</span>
                <span className="text-blue-600 font-mono">Acertos: {acertos}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }}></div>
            </div>
        </div>

        {/* Card */}
        <div className="min-h-[400px]">
            {questaoAtual && (
                <QuestaoCard 
                    key={questaoAtual.id} 
                    dados={questaoAtual} 
                    // Passamos uma função para o filho avisar o pai quando acertar
                    aoResponder={computarResposta} 
                />
            )}
        </div>

        {/* Navegação */}
        <div className="flex justify-end mt-8">
            <button 
                onClick={irParaProxima}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
            >
                {indiceAtual === questoes.length - 1 ? 'Finalizar Prova 🏁' : 'Próxima ➡️'}
            </button>
        </div>
      </div>
    </main>
  );
}