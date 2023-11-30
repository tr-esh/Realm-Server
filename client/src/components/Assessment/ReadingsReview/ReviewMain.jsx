import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PredictedValue from './PredictedValue';
import TurbidityReview from './TurbidityReview';
import PhReview from './PhReview';
import '../../styles/Review.css';

const ReviewMain = () => {
  const [isMouseOverCarousel, setIsMouseOverCarousel] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseOverCarousel(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOverCarousel(false);
  };

  const renderCustomIndicator = (onClickHandler, isSelected, index, label) => {
    // Customize the control dots here
    const customStyle = {
      width: isSelected ? '20px' : '8px',
      height: '8px',
      background: isSelected ? '#7da4cc' : '#0d2135',
      borderRadius: isSelected ? '25%' : '50%',
      cursor: 'pointer',
      margin: '0 5px',
      display: 'inline-block',
      position: 'relative',
      top: '1rem',
    };

    return (
      <div
        key={index}
        onClick={onClickHandler}
        style={customStyle}
        title={`${label} ${isSelected ? 'selected' : 'not selected'}`}
      />
    );
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        showThumbs={false}
        showArrows={isMouseOverCarousel} // Show arrows based on mouse hover state
        renderIndicator={renderCustomIndicator}
      >
        <div className="carousel-slide">
          <PredictedValue />
        </div>
        <div className="carousel-slide">
          <TurbidityReview />
        </div>
        <div className="carousel-slide">
          <PhReview />
        </div>
      </Carousel>
    </div>
  );
};

export default ReviewMain;
