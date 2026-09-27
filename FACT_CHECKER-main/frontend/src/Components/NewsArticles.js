import React from 'react';
import Slider from 'react-slick';
import NewsCard from './NewsCard';
import './NewsArticle.css';

const NewsArticles = ({ news }) => {
  const arrowStyle = (side) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: '1',
    background: '#fff',
    border: '2px solid #000',
    borderRadius: '50%',
    fontSize: '1.5rem',
    color: '#000',
    padding: '5px 10px',
    cursor: 'pointer',
    [side]: '10px',
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: 'ondemand',
    arrows: true,
    centerMode: true, // Enables centering of slides
    centerPadding: '0px', // Removes extra padding
    prevArrow: (
      <button
        className="slick-prev"
        style={arrowStyle('left')}
        aria-label="Previous Slide"
        
      >
        &#8592;
      </button>
    ),
    nextArrow: (
      <button
        className="slick-next"
        style={arrowStyle('right')}
        aria-label="Next Slide"
      >
        &#8594;
      </button>
    ),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="mt-3">
      {news && news.length > 0 ? (
        <Slider {...settings}>
          {news.map((article, index) => (
            <div key={index}>
              <NewsCard
                title={article.title}
                description={article.description}
                url={article.url}
                urlToImage={article.urlToImage}
                publisher={article.publisher}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center mt-4">No related news found.</p>
      )}
    </div>
  );
};

export default NewsArticles;
