// React adapters for AI Progress Controls Web Components
import React, { useEffect, useRef } from 'react';
import {
  BatchProgress as BatchProgressWC,
  ModelLoader as ModelLoaderWC,
  ParameterPanel as ParameterPanelWC,
  ParameterSlider as ParameterSliderWC,
  QueueProgress as QueueProgressWC,
  RetryProgress as RetryProgressWC,
  StreamProgress as StreamProgressWC,
} from 'ai-progress-controls';

import type { BatchItem, ModelStage } from 'ai-progress-controls';

/**
 * React wrapper for BatchProgress Web Component
 * Handles batch processing with multiple items and progress tracking
 */
export interface BatchProgressProps {
  /** Array of batch items to process */
  items: BatchItem[];
  /** Overall progress percentage (0-100) */
  progress: number;
  /** Optional label for the batch */
  label?: string;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({ items, progress, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<BatchProgressWC | null>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const batch = new BatchProgressWC({
        totalItems: items.length,
        showItems: true,
      });
      ref.current.appendChild(batch);
      instanceRef.current = batch;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.start();
      items.forEach((item) => {
        instanceRef.current!.addItem(item.id, item.label);
        instanceRef.current!.updateItem({
          itemId: item.id,
          status: item.status,
          progress: item.status === 'completed' ? 100 : item.status === 'processing' ? progress : 0,
        });
      });
    }
  }, [items, progress]);

  return <div ref={ref} />;
};

/**
 * React wrapper for ModelLoader Web Component
 * Displays model loading progress with different stages
 */
export interface ModelLoaderProps {
  /** Whether the model is currently loading */
  isLoading: boolean;
  /** Loading progress percentage (0-100) */
  progress: number;
  /** Name of the model being loaded */
  modelName: string;
  /** Current loading stage */
  stage?: ModelStage;
}

export const ModelLoader: React.FC<ModelLoaderProps> = ({
  isLoading,
  progress,
  modelName,
  stage,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ModelLoaderWC | null>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const loader = new ModelLoaderWC({
        modelName,
      });
      ref.current.appendChild(loader);
      instanceRef.current = loader;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [modelName]);

  useEffect(() => {
    if (instanceRef.current) {
      if (isLoading) {
        if (!instanceRef.current.getState().isLoading) {
          instanceRef.current.start();
        }
        instanceRef.current.updateStage(stage || 'download', { progress });
        if (progress >= 100) {
          instanceRef.current.complete();
        }
      } else {
        instanceRef.current.reset();
      }
    }
  }, [isLoading, progress, stage]);

  return <div ref={ref} />;
};

/**
 * React wrapper for ParameterPanel Web Component
 * Displays multiple parameter sliders in a unified panel
 */
export interface ParameterConfig {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
}

export interface ParameterPanelProps {
  /** Configuration for all parameters */
  parameters: Record<string, ParameterConfig>;
  /** Callback when a parameter value changes */
  onChange: (key: string, value: number) => void;
  /** Optional title for the panel */
  title?: string;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({ parameters, onChange, title }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ParameterPanelWC | null>(null);
  const lastEventSourceRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const panel = new ParameterPanelWC({
        title: title || 'AI Model Parameters',
        parameters: Object.entries(parameters).map(([key, param]) => ({
          id: key,
          ...param,
        })),
      });
      ref.current.appendChild(panel);
      instanceRef.current = panel;

      // Listen for changes
      panel.addEventListener('panelchange', ((e: CustomEvent) => {
        // Track the source of this change to prevent feedback loops
        lastEventSourceRef.current[e.detail.parameterId] = e.detail.source;
        onChange(e.detail.parameterId, e.detail.value);
      }) as EventListener);
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [title]);

  useEffect(() => {
    if (instanceRef.current) {
      Object.entries(parameters).forEach(([key, param]) => {
        const currentValue = instanceRef.current!.getValue(key);

        // Only update if value actually changed
        if (currentValue !== undefined && Math.abs(currentValue - param.value) > 0.001) {
          const lastSource = lastEventSourceRef.current[key];

          // Don't call setValue if the last change was from slider dragging
          // This prevents interrupting the user's drag gesture
          if (lastSource === 'slider' || lastSource === 'input') {
            // Clear the flag for next update
            delete lastEventSourceRef.current[key];
          } else {
            // External change (preset, reset, or initial load) - update the component
            instanceRef.current!.setValue(key, param.value, 'preset');
          }
        }
      });
    }
  }, [parameters]);

  return <div ref={ref} />;
};

/**
 * React wrapper for ParameterSlider Web Component
 * Single parameter slider with label and description
 */
export interface ParameterSliderProps {
  /** Current slider value */
  value: number;
  /** Minimum allowed value */
  min: number;
  /** Maximum allowed value */
  max: number;
  /** Step increment */
  step: number;
  /** Label for the parameter */
  label: string;
  /** Optional description text */
  description?: string;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Whether to show the current value */
  showValue?: boolean;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  value,
  min,
  max,
  step,
  label,
  description,
  onChange,
  showValue,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ParameterSliderWC | null>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const slider = new ParameterSliderWC({
        value,
        min,
        max,
        step,
        label,
        description,
      });
      ref.current.appendChild(slider);
      instanceRef.current = slider;

      // Listen for changes
      slider.addEventListener('change', ((e: CustomEvent) => {
        onChange(e.detail.value);
      }) as EventListener);
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [min, max, step, label, description]);

  useEffect(() => {
    if (instanceRef.current) {
      const currentValue = instanceRef.current.getValue();
      if (currentValue !== value) {
        instanceRef.current.setValue(value, 'preset');
      }
    }
  }, [value]);

  return <div ref={ref} />;
};

/**
 * React wrapper for QueueProgress Web Component
 * Displays queue position with ETA estimation
 */
export interface QueueProgressProps {
  /** Current position in queue */
  position: number;
  /** Total queue size */
  queueSize: number;
  /** Optional label */
  label?: string;
}

export const QueueProgress: React.FC<QueueProgressProps> = ({ position, queueSize, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<QueueProgressWC | null>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const queue = new QueueProgressWC({
        position,
        queueSize,
        showWaitTime: true,
      });
      ref.current.appendChild(queue);
      instanceRef.current = queue;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [queueSize]);

  useEffect(() => {
    if (instanceRef.current) {
      const status = instanceRef.current.getStatus();
      if (status === 'waiting') {
        instanceRef.current.start();
      }
      instanceRef.current.update({ position });
    }
  }, [position]);

  return <div ref={ref} />;
};

/**
 * React wrapper for RetryProgress Web Component
 * Tracks retry attempts with exponential backoff visualization
 */
export interface RetryProgressProps {
  /** Current retry attempt number */
  attempt: number;
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Optional label */
  label?: string;
}

export const RetryProgress: React.FC<RetryProgressProps> = ({ attempt, maxAttempts, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<RetryProgressWC | null>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const retry = new RetryProgressWC({
        maxAttempts,
      });
      ref.current.appendChild(retry);
      instanceRef.current = retry;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [maxAttempts]);

  useEffect(() => {
    if (instanceRef.current) {
      const currentAttemptInState = instanceRef.current.getAttempt();

      if (attempt === 1 && currentAttemptInState > 1) {
        instanceRef.current.reset();
      } else if (attempt > currentAttemptInState) {
        // Simulate retry attempts
        for (let i = currentAttemptInState; i < attempt; i++) {
          instanceRef.current.attempt(`Attempt ${i + 1} of ${maxAttempts}`);
          if (i < attempt - 1) {
            instanceRef.current.waitForRetry({ attempt: i + 1 });
          }
        }
      }
    }
  }, [attempt, maxAttempts]);

  return <div ref={ref} />;
};

/**
 * React wrapper for StreamProgress Web Component
 * Visualizes token streaming with rate tracking
 */
export interface StreamProgressProps {
  /** Stream progress percentage (0-100) */
  progress: number;
  /** Number of tokens generated */
  tokensGenerated: number;
  /** Optional label */
  label?: string;
  /** Maximum tokens expected */
  maxTokens?: number;
}

export const StreamProgress: React.FC<StreamProgressProps> = ({
  progress,
  tokensGenerated,
  label,
  maxTokens,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<StreamProgressWC | null>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const stream = new StreamProgressWC({
        maxTokens,
      });
      ref.current.appendChild(stream);
      instanceRef.current = stream;
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [maxTokens]);

  useEffect(() => {
    if (instanceRef.current) {
      if (progress === 0 && tokensGenerated === 0) {
        instanceRef.current.reset();
      } else {
        if (!instanceRef.current.getState().isStreaming) {
          instanceRef.current.start();
        }

        if (instanceRef.current.getState().isStreaming) {
          instanceRef.current.update({ tokensGenerated });
          if (progress >= 100) {
            instanceRef.current.complete();
          }
        }
      }
    }
  }, [progress, tokensGenerated]);

  return <div ref={ref} />;
};
