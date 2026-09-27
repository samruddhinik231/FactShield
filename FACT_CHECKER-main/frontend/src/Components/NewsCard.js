import React from 'react';

const NewsCard = ({ title, description, url, urlToImage, publisher }) => {
  return (
    <div
      className="Newscard shadow-sm"
      style={{
        borderRadius: '12px',
        minHeight: '400px', // Ensure consistent card height
        overflow: 'hidden',
        marginBottom: '20px',
        transition: 'transform 0.2s',
        flex: '1 1 calc(300px)',
        maxWidth: '400px',
       
        marginLeft : "15px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={urlToImage || 'https://via.placeholder.com/150'}
          className="card-img-top"
          alt={title || 'News image'}
          style={{ height: '200px', objectFit: 'cover', width: '100%' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            width: '100%',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))',
            color: 'white',
            padding: '10px',
            textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h6 className="mb-1">{publisher || 'Unknown Publisher'}</h6>
        </div>
      </div>
      <div className="card-body">
  <h5
    className="card-title"
    style={{
      fontWeight: 'bold',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }}
  >
    {title}
  </h5>
  <p
    className="card-text text-muted"
    style={{
      fontSize: '14px',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }}
  >
    {description || 'No description available...'}
  </p>
  <a
    href={url}
    className="btn btn-outline-primary"
    target="_blank"
    rel="noopener noreferrer"
    style={{ fontWeight: 'bold' }}
  >
    Read More
  </a>
</div>

      </div>
 
  );
};

export default NewsCard;
