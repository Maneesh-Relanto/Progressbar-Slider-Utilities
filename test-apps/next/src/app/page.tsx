'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './page.css';

// Dynamically import adapters with no SSR
const BatchProgress = dynamic(
  () => import('../adapters').then((mod) => ({ default: mod.BatchProgress })),
  { ssr: false }
);
const ModelLoader = dynamic(
  () => import('../adapters').then((mod) => ({ default: mod.ModelLoader })),
  { ssr: false }
);
const ParameterPanel = dynamic(
  () => import('../adapters').then((mod) => ({ default: mod.ParameterPanel })),
  { ssr: false }
);
const ParameterSlider = dynamic(
  () => import('../adapters').then((mod) => ({ default: mod.ParameterSlider })),
  { ssr: false }
);
const QueueProgress = dynamic(
  () => import('../adapters').then((mod) => ({ default: mod.QueueProgress })),
  { ssr: false }
);
const RetryProgress = dynamic(
  () => import('../adapters').then((mod) => ({ default: mod.RetryProgress })),
  { ssr: false }
);
const StreamProgress = dynamic(
  () => import('../adapters').then((mod) => ({ default: mod.StreamProgress })),
  { ssr: false }
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('batch');

  // BatchProgress state
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchItems] = useState([
    { id: 1, label: 'Task 1', status: 'completed' as const },
    { id: 2, label: 'Task 2', status: 'processing' as const },
    { id: 3, label: 'Task 3', status: 'pending' as const },
    { id: 4, label: 'Task 4', status: 'pending' as const },
  ]);

  // ModelLoader state
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);

  // ParameterPanel state
  const [panelParams, setPanelParams] = useState({
    temperature: { value: 0.7, min: 0, max: 2, step: 0.1, label: 'Temperature' },
    maxTokens: { value: 2048, min: 1, max: 4096, step: 1, label: 'Max Tokens' },
    topP: { value: 0.9, min: 0, max: 1, step: 0.05, label: 'Top P' },
    frequencyPenalty: { value: 0, min: -2, max: 2, step: 0.1, label: 'Frequency Penalty' },
  });

  // ParameterSlider state
  const [temperature, setTemperature] = useState(0.7);

  // QueueProgress state
  const [queuePosition, setQueuePosition] = useState(3);
  const [queueTotal] = useState(10);

  // RetryProgress state
  const [retryAttempt, setRetryAttempt] = useState(1);
  const [maxRetries] = useState(5);

  // StreamProgress state
  const [streamProgress, setStreamProgress] = useState(0);
  const [streamTokens, setStreamTokens] = useState(0);

  // Simulation functions
  const startBatchSimulation = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBatchProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setBatchProgress(0);
      }
    }, 500);
  };

  const startModelLoading = () => {
    setModelLoading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setModelProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setModelLoading(false);
          setModelProgress(0);
        }, 500);
      }
    }, 200);
  };

  const startQueueSimulation = () => {
    let position = queuePosition;
    const interval = setInterval(() => {
      position -= 1;
      setQueuePosition(position);
      if (position <= 0) {
        clearInterval(interval);
        setTimeout(() => setQueuePosition(3), 1000);
      }
    }, 1000);
  };

  const startRetrySimulation = () => {
    let attempt = retryAttempt;
    const interval = setInterval(() => {
      attempt += 1;
      setRetryAttempt(attempt);
      if (attempt >= maxRetries) {
        clearInterval(interval);
        setTimeout(() => setRetryAttempt(1), 1000);
      }
    }, 1500);
  };

  const startStreamSimulation = () => {
    let progress = 0;
    let tokens = 0;
    const interval = setInterval(() => {
      progress += 2;
      tokens += 5;
      setStreamProgress(progress);
      setStreamTokens(tokens);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStreamProgress(0);
          setStreamTokens(0);
        }, 1000);
      }
    }, 100);
  };

  const tabs = [
    { id: 'batch', label: 'Batch Progress' },
    { id: 'model', label: 'Model Loader' },
    { id: 'panel', label: 'Parameter Panel' },
    { id: 'slider', label: 'Parameter Slider' },
    { id: 'queue', label: 'Queue Progress' },
    { id: 'retry', label: 'Retry Progress' },
    { id: 'stream', label: 'Stream Progress' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Progress Controls - Next.js Test</h1>
        <p>Testing all 7 components in Next.js App Router</p>
      </header>

      <nav className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {activeTab === 'batch' && (
          <section className="test-section">
            <h2>Batch Progress Test</h2>
            <p>Testing batch processing with multiple items</p>

            <div className="component-wrapper">
              <BatchProgress
                items={batchItems}
                progress={batchProgress}
                label="Processing Batch Items"
              />
            </div>

            <div className="controls">
              <button onClick={startBatchSimulation}>Start Batch Simulation</button>
              <button onClick={() => setBatchProgress(0)}>Reset</button>
            </div>

            <div className="info-box">
              <h3>Current State:</h3>
              <p>Progress: {batchProgress}%</p>
              <p>Total Items: {batchItems.length}</p>
            </div>
          </section>
        )}

        {activeTab === 'model' && (
          <section className="test-section">
            <h2>Model Loader Test</h2>
            <p>Testing AI model loading states</p>

            <div className="component-wrapper">
              <ModelLoader
                isLoading={modelLoading}
                progress={modelProgress}
                modelName="GPT-4"
                stage={modelProgress < 50 ? 'download' : 'initialize'}
              />
            </div>

            <div className="controls">
              <button onClick={startModelLoading} disabled={modelLoading}>
                Start Loading
              </button>
              <button
                onClick={() => {
                  setModelLoading(false);
                  setModelProgress(0);
                }}
              >
                Reset
              </button>
            </div>

            <div className="info-box">
              <h3>Current State:</h3>
              <p>Loading: {modelLoading ? 'Yes' : 'No'}</p>
              <p>Progress: {modelProgress}%</p>
              <p>Stage: {modelProgress < 50 ? 'Download' : 'Initialize'}</p>
            </div>
          </section>
        )}

        {activeTab === 'panel' && (
          <section className="test-section">
            <h2>Parameter Panel Test</h2>
            <p>Testing parameter configuration panel</p>

            <div className="component-wrapper">
              <ParameterPanel
                parameters={panelParams}
                onChange={(key, value) => {
                  setPanelParams((prev) => ({
                    ...prev,
                    [key]: { ...prev[key as keyof typeof prev], value },
                  }));
                }}
              />
            </div>

            <div className="info-box">
              <h3>Current Values:</h3>
              <p>Temperature: {panelParams.temperature.value}</p>
              <p>Max Tokens: {panelParams.maxTokens.value}</p>
              <p>Top P: {panelParams.topP.value}</p>
              <p>Frequency Penalty: {panelParams.frequencyPenalty.value}</p>
            </div>
          </section>
        )}

        {activeTab === 'slider' && (
          <section className="test-section">
            <h2>Parameter Slider Test</h2>
            <p>Testing individual parameter slider</p>

            <div className="component-wrapper">
              <ParameterSlider
                value={temperature}
                min={0}
                max={2}
                step={0.1}
                label="Temperature"
                description="Controls randomness in responses"
                onChange={setTemperature}
              />
            </div>

            <div className="info-box">
              <h3>Current State:</h3>
              <p>Value: {temperature.toFixed(2)}</p>
            </div>
          </section>
        )}

        {activeTab === 'queue' && (
          <section className="test-section">
            <h2>Queue Progress Test</h2>
            <p>Testing queue position tracking</p>

            <div className="component-wrapper">
              <QueueProgress position={queuePosition} queueSize={queueTotal} />
            </div>

            <div className="controls">
              <button onClick={startQueueSimulation}>Start Queue Simulation</button>
              <button onClick={() => setQueuePosition(3)}>Reset</button>
            </div>

            <div className="info-box">
              <h3>Current State:</h3>
              <p>
                Position: {queuePosition} of {queueTotal}
              </p>
            </div>
          </section>
        )}

        {activeTab === 'retry' && (
          <section className="test-section">
            <h2>Retry Progress Test</h2>
            <p>Testing retry attempt tracking</p>

            <div className="component-wrapper">
              <RetryProgress attempt={retryAttempt} maxAttempts={maxRetries} />
            </div>

            <div className="controls">
              <button onClick={startRetrySimulation}>Start Retry Simulation</button>
              <button onClick={() => setRetryAttempt(1)}>Reset</button>
            </div>

            <div className="info-box">
              <h3>Current State:</h3>
              <p>
                Attempt: {retryAttempt} of {maxRetries}
              </p>
            </div>
          </section>
        )}

        {activeTab === 'stream' && (
          <section className="test-section">
            <h2>Stream Progress Test</h2>
            <p>Testing streaming token generation</p>

            <div className="component-wrapper">
              <StreamProgress tokensGenerated={streamTokens} progress={streamProgress} />
            </div>

            <div className="controls">
              <button onClick={startStreamSimulation}>Start Stream Simulation</button>
              <button
                onClick={() => {
                  setStreamProgress(0);
                  setStreamTokens(0);
                }}
              >
                Reset
              </button>
            </div>

            <div className="info-box">
              <h3>Current State:</h3>
              <p>Tokens Generated: {streamTokens}</p>
              <p>Progress: {streamProgress}%</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
