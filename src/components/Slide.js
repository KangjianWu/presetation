import React from 'react';
import 'animate.css';
import './Slide.css';

const Slide = ({ content, backgroundImage, onClick }) => (
  <div 
    className="slide animate__animated animate__fadeIn"
    style={{ backgroundImage: `url(${backgroundImage})` }}
    onClick={onClick}
  >
    <div className="overlay"></div>
    <div className="slide-content-container">
      <div className="slide-content animate__animated animate__zoomIn">
        {content.split('\n').map((line, index) => (
          <div 
            key={index} 
            className="slide-line animate__animated animate__fadeInUp" 
            style={{ animationDelay: `${index * 0.5}s`, animationFillMode: 'both' }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Slide;
