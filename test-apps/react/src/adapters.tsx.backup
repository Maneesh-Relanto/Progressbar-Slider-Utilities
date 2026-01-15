// React adapters for AI Progress Controls Web Components
import { useEffect, useRef } from 'react';
import { BatchProgress as BatchProgressWC } from '../../../src/core/batch-progress';
import { ModelLoader as ModelLoaderWC } from '../../../src/core/model-loader';
import { ParameterPanel as ParameterPanelWC } from '../../../src/core/parameter-panel';
import { ParameterSlider as ParameterSliderWC } from '../../../src/core/parameter-slider';
import { QueueProgress as QueueProgressWC } from '../../../src/core/queue-progress';
import { RetryProgress as RetryProgressWC } from '../../../src/core/retry-progress';
import { StreamProgress as StreamProgressWC } from '../../../src/core/stream-progress';

import type { BatchItem } from '../../../src/core/batch-progress/types';
import type { ModelStage } from '../../../src/core/model-loader/types';

// BatchProgress React Wrapper
interface BatchProgressProps {
  items: BatchItem[];
  progress: number;
  label?: string;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({ items, progress, label }) => {
  const ref = useRef<any>(null);
  const instanceRef = useRef<any>(null);

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
        instanceRef.current.addItem(item.id, item.label);
        instanceRef.current.updateItem({
          itemId: item.id,
          status: item.status,
          progress: item.status === 'completed' ? 100 : item.status === 'processing' ? progress : 0,
        });
      });
    }
  }, [items, progress]);

  return <div ref={ref} />;
};

// ModelLoader React Wrapper
interface ModelLoaderProps {
  isLoading: boolean;
  progress: number;
  modelName: string;
  stage?: ModelStage;
}

export const ModelLoader: React.FC<ModelLoaderProps> = ({
  isLoading,
  progress,
  modelName,
  stage,
}) => {
  const ref = useRef<any>(null);
  const instanceRef = useRef<any>(null);

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
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      if (isLoading) {
        if (!instanceRef.current.state?.isLoading) {
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

// ParameterPanel React Wrapper
interface ParameterPanelProps {
  parameters: Record<
    string,
    {
      value: number;
      min: number;
      max: number;
      step: number;
      label: string;
    }
  >;
  onChange: (key: string, value: number) => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({ parameters, onChange }) => {
  const ref = useRef<any>(null);
  const instanceRef = useRef<any>(null);
  const lastEventSourceRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const panel = new ParameterPanelWC({
        title: 'AI Model Parameters',
        parameters: Object.entries(parameters).map(([key, param]) => ({
          id: key,
          ...param,
        })),
      });
      ref.current.appendChild(panel);
      instanceRef.current = panel;

      // Listen for changes
      panel.addEventListener('panelchange', ((e: CustomEvent) => {
        // Track the source of this change
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
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      Object.entries(parameters).forEach(([key, param]) => {
        const currentValue = instanceRef.current.getValue(key);

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
            instanceRef.current.setValue(key, param.value, 'preset');
          }
        }
      });
    }
  }, [parameters]);

  return <div ref={ref} />;
};

// ParameterSlider React Wrapper
interface ParameterSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  description?: string;
  onChange: (value: number) => void;
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
  const ref = useRef<any>(null);
  const instanceRef = useRef<any>(null);

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
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      const currentValue = instanceRef.current.getValue
        ? instanceRef.current.getValue()
        : instanceRef.current.value;
      if (currentValue !== value) {
        instanceRef.current.setValue(value, 'preset');
      }
    }
  }, [value]);

  return <div ref={ref} />;
};

// QueueProgress React Wrapper
interface QueueProgressProps {
  position: number;
  total: number;
  label?: string;
}

export const QueueProgress: React.FC<QueueProgressProps> = ({ position, total, label }) => {
  const ref = useRef<any>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const queue = new QueueProgressWC({
        position,
        queueSize: total,
        showEstimate: true,
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
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      if (!instanceRef.current.state?.isActive) {
        instanceRef.current.start();
      }
      instanceRef.current.update({ position });
    }
  }, [position]);

  return <div ref={ref} />;
};

// RetryProgress React Wrapper
interface RetryProgressProps {
  currentAttempt: number;
  maxAttempts: number;
  label?: string;
}

export const RetryProgress: React.FC<RetryProgressProps> = ({
  currentAttempt,
  maxAttempts,
  label,
}) => {
  const ref = useRef<any>(null);
  const instanceRef = useRef<any>(null);

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
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      const currentAttemptInState = instanceRef.current.state?.attempt || 1;

      if (currentAttempt === 1 && currentAttemptInState > 1) {
        instanceRef.current.reset();
      } else if (currentAttempt > currentAttemptInState) {
        // Simulate retry attempts
        for (let i = currentAttemptInState; i < currentAttempt; i++) {
          instanceRef.current.attempt(`Attempt ${i + 1} of ${maxAttempts}`);
          if (i < currentAttempt - 1) {
            instanceRef.current.waitForRetry({ attempt: i + 1 });
          }
        }
      }
    }
  }, [currentAttempt, maxAttempts]);

  return <div ref={ref} />;
};

// StreamProgress React Wrapper
interface StreamProgressProps {
  progress: number;
  tokensGenerated: number;
  label?: string;
}

export const StreamProgress: React.FC<StreamProgressProps> = ({
  progress,
  tokensGenerated,
  label,
}) => {
  const ref = useRef<any>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (ref.current && !instanceRef.current) {
      const stream = new StreamProgressWC({});
      ref.current.appendChild(stream);
      instanceRef.current = stream;
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
      if (progress === 0 && tokensGenerated === 0) {
        instanceRef.current.reset();
      } else {
        if (!instanceRef.current.state?.isStreaming) {
          instanceRef.current.start();
        }

        if (instanceRef.current.state?.isStreaming) {
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
