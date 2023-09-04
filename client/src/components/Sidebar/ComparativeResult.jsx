import React, { useState, useEffect } from 'react';

const ComparativeResult = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targetAccuracy = 87; // Target accuracy in percentage
    const totalSteps = 100; // Total steps to reach 100%

    // Simulate the progress by incrementing it over time
    const interval = setInterval(() => {
      if (progress < targetAccuracy) {
        setProgress(progress + 1); // Increment by 1 for smoother animation
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  // Calculate the width of the filled progress bar based on the current percentage
  const filledWidth = (progress / 100) * 100 + '%';

  // Create a CSS class for the progress bar to achieve the desired effect
  const progressBarStyle = {
    width: '100%',
    height: '0.3rem',
    background: `linear-gradient(to right, #4E79B4 ${filledWidth}, #0d2135 ${filledWidth})`,
  };

  return (
    <div className="progress-bar" style={{padding: '1rem'}}>
      <div className="progress-bar-fill" style={progressBarStyle}></div>
      <div className="progress-bar-label" style={{fontSize: '0.8rem', paddingTop: '0.5rem'}}>{`${progress}% accuracy of 100`}</div>
    </div>
  );
};

export default ComparativeResult;
