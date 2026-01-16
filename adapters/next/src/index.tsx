// Next.js adapters for AI Progress Controls Web Components
'use client';

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
 * Next.js wrapper for BatchProgress Web Component
 * Client-side only component with SSR support
 */
export interface BatchProgressProps {
  /** Array of batch items to process */
  items: BatchItem[];
  /** Overall progress percentage (0-100) */
  progress: number;
  /** Optional label for the batch */
  label?: string;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({ items, progress }) => {
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
 * Next.js wrapper for ModelLoader Web Component
 * Client-side only component with SSR support
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
 * Next.js wrapper for ParameterPanel Web Component
 * Client-side only component with SSR support
 */
export interface ParameterConfig {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
}

export interface ParameterPanelProps {
  /** Parameter configurations as key-value pairs */
  parameters: Record<string, ParameterConfig>;
  /** Callback when parameter values change */
  onChange: (key: string, value: number) => void;
  /** Optional panel title */
  title?: string;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({ parameters, onChange, title }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ParameterPanelWC | null>(null);
  const lastEventSourceRef = useRef<Record<string, 'user' | 'component'>>({});

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const paramArray = Object.keys(parameters).map((key) => ({
        id: key,
        min: parameters[key].min,
        max: parameters[key].max,
        step: parameters[key].step,
        value: parameters[key].value,
        defaultValue: parameters[key].value,
        label: parameters[key].label,
      }));

      const panel = new ParameterPanelWC({ parameters: paramArray });
      ref.current.appendChild(panel);
      instanceRef.current = panel;

      panel.addEventListener('parameter-change', ((e: CustomEvent) => {
        if (lastEventSourceRef.current[e.detail.parameterId] !== 'user') {
          onChange(e.detail.parameterId, e.detail.value);
        }
        lastEventSourceRef.current[e.detail.parameterId] = 'component';
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
      Object.keys(parameters).forEach((key) => {
        const param = parameters[key];
        const currentValue = instanceRef.current!.getValue(key);

        if (currentValue !== undefined && Math.abs(currentValue - param.value) > 0.001) {
          lastEventSourceRef.current[key] = 'user';
          instanceRef.current!.setValue(key, param.value, 'preset');
        }
      });
    }
  }, [parameters]);

  return <div ref={ref} />;
};

/**
 * Next.js wrapper for ParameterSlider Web Component
 * Client-side only component with SSR support
 */
export interface ParameterSliderProps {
  /** Current value */
  value: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step: number;
  /** Parameter label */
  label: string;
  /** Optional description */
  description?: string;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Show current value */
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
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ParameterSliderWC | null>(null);
  const lastEventSourceRef = useRef<'user' | 'component'>('component');

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const slider = new ParameterSliderWC({
        min,
        max,
        step,
        defaultValue: value,
        label,
        description,
      });
      ref.current.appendChild(slider);
      instanceRef.current = slider;

      slider.addEventListener('value-change', ((e: CustomEvent) => {
        if (lastEventSourceRef.current !== 'user') {
          onChange(e.detail.value);
        }
        lastEventSourceRef.current = 'component';
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
        lastEventSourceRef.current = 'user';
        instanceRef.current.setValue(value, 'preset');
      }
    }
  }, [value]);

  return <div ref={ref} />;
};

/**
 * Next.js wrapper for QueueProgress Web Component
 * Client-side only component with SSR support
 */
export interface QueueProgressProps {
  /** Current position in queue */
  position: number;
  /** Total queue size */
  queueSize: number;
  /** Optional label */
  label?: string;
}

export const QueueProgress: React.FC<QueueProgressProps> = ({ position, queueSize }) => {
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
 * Next.js wrapper for RetryProgress Web Component
 * Client-side only component with SSR support
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
        message: label,
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
  }, [maxAttempts, label]);

  useEffect(() => {
    if (instanceRef.current) {
      const currentAttemptInState = instanceRef.current.getAttempt();

      if (attempt > currentAttemptInState) {
        for (let i = currentAttemptInState; i < attempt; i++) {
          instanceRef.current.attempt();
          if (i < attempt - 1) {
            instanceRef.current.waitForRetry();
          }
        }
      }
    }
  }, [attempt]);

  return <div ref={ref} />;
};

/**
 * Next.js wrapper for StreamProgress Web Component
 * Client-side only component with SSR support
 */
export interface StreamProgressProps {
  /** Number of tokens generated so far */
  tokensGenerated: number;
  /** Progress percentage (0-100) */
  progress: number;
  /** Expected maximum tokens */
  maxTokens?: number;
  /** Optional label */
  label?: string;
  /** Whether streaming is active */
  isStreaming?: boolean;
}

export const StreamProgress: React.FC<StreamProgressProps> = ({
  tokensGenerated,
  progress,
  maxTokens,
  label,
  isStreaming = true,
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
  }, [maxTokens, label]);

  useEffect(() => {
    if (instanceRef.current) {
      if (tokensGenerated === 0 && progress === 0) {
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
  }, [tokensGenerated, progress, isStreaming]);

  return <div ref={ref} />;
};
