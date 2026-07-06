import { useEffect, useMemo, useRef, useState } from "react";
import { proofPoints } from "../../data/siteContent";

function parseMetricValue(value) {
  const match = value.match(/^([^0-9]*)([\d,]+)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    target: Number(match[2].replaceAll(",", "")),
    suffix: match[3],
    useGrouping: match[2].includes(","),
  };
}

function formatMetricValue(value, useGrouping) {
  if (!useGrouping) {
    return String(value);
  }

  return new Intl.NumberFormat("en-IN").format(value);
}

function AnimatedMetricValue({ value }) {
  const parsedValue = useMemo(() => parseMetricValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(() => {
    if (!parsedValue) {
      return value;
    }

    return `${parsedValue.prefix}${formatMetricValue(0, parsedValue.useGrouping)}${parsedValue.suffix}`;
  });
  const valueRef = useRef(null);

  useEffect(() => {
    if (!parsedValue || !valueRef.current) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    let animationFrame = 0;
    let hasAnimated = false;

    const animateValue = () => {
      const start = performance.now();
      const duration = 1400;

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(parsedValue.target * easedProgress);

        setDisplayValue(
          `${parsedValue.prefix}${formatMetricValue(currentValue, parsedValue.useGrouping)}${parsedValue.suffix}`,
        );

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      animationFrame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateValue();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(valueRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [parsedValue, value]);

  return (
    <span ref={valueRef} className="metric-value">
      {displayValue}
    </span>
  );
}

export function MetricsStrip() {
  return (
    <section className="metric-strip reveal" aria-label="Wintex scale and reach">
      {proofPoints.map((point) => (
        <div key={point.label} className="metric">
          <strong aria-label={point.value}>
            <AnimatedMetricValue value={point.value} />
          </strong>
          <span className="metric-label">{point.label}</span>
        </div>
      ))}
    </section>
  );
}
