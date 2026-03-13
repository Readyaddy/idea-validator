import React, { useState, useEffect } from 'react';
import InputPhase from './components/InputPhase';
import QuestionPhase from './components/QuestionPhase';
import Dashboard from './components/Dashboard';
import History from './components/History';

export type AppStage = 'input' | 'questions' | 'dashboard' | 'history';

function App() {
  const [stage, setStage] = useState<AppStage>('input');
  const [threadId, setThreadId] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [state, setState] = useState<any>({});
  const [nodeHistory, setNodeHistory] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    setThreadId(Math.random().toString(36).substring(7));
  }, []);

  const startValidation = (idea: string) => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${threadId}`);

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: "start", raw_input: idea }));
      setWs(socket);
      setStage('dashboard');
      setIsExecuting(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        const nodeName = Object.keys(data.data)[0];
        const stateDiff = data.data[nodeName];
        setState((prev: any) => ({ ...prev, ...stateDiff }));
        setNodeHistory((prev: string[]) => [...prev, nodeName]);
      } else if (data.type === 'interrupt') {
        setStage('questions');
        setIsExecuting(false);
      } else if (data.type === 'done') {
        setIsExecuting(false);
      } else if (data.type === 'error') {
        alert("Backend Error: " + data.message);
        setIsExecuting(false);
        setStage('input');
      }
    };
  };

  const submitAnswers = (answers: string[]) => {
    if (ws) {
      ws.send(JSON.stringify({ action: "answer", answers }));
      setStage('dashboard');
      setIsExecuting(true);
      setNodeHistory(prev => [...prev, "vision_aligner_answers"]);
    }
  };

  const loadFromHistory = (loadedThreadId: string, loadedState: any, loadedNodeHistory: string[]) => {
    setState(loadedState);
    setNodeHistory(loadedNodeHistory);
    setThreadId(loadedThreadId);
    setIsExecuting(false);
    setStage('dashboard');
  };

  const goToInput = () => {
    // Reset state for a new idea
    setState({});
    setNodeHistory([]);
    setThreadId(Math.random().toString(36).substring(7));
    setIsExecuting(false);
    setWs(null);
    setStage('input');
  };

  return (
    <div className="app-container">
      {stage === 'input' && (
        <InputPhase
          onSubmit={startValidation}
          onShowHistory={() => setStage('history')}
        />
      )}
      {stage === 'questions' && <QuestionPhase state={state} onSubmit={submitAnswers} />}
      {stage === 'dashboard' && (
        <Dashboard
          state={state}
          nodeHistory={nodeHistory}
          isExecuting={isExecuting}
        />
      )}
      {stage === 'history' && (
        <History
          onLoadSession={loadFromHistory}
          onBack={goToInput}
        />
      )}
    </div>
  );
}

export default App;
