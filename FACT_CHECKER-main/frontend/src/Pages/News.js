import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown } from 'react-bootstrap'; 
import './News.css'; 

const TopNewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const [categories] = useState(['All','Sports', 'Entertainment', 'International']);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5001/news/economic-times', {
          params: { category: selectedCategory } 
        });
        setNews(response.data); 
      } catch (error) {
        setError('Failed to fetch top news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [selectedCategory]); 
  useEffect(() => {
    if (searchQuery) {
      setNews(prevNews => 
        prevNews.filter((article) =>
          article.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.paragraph.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  if (loading) {
    return <div>Loading top news...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <h2 className="my-4 text-center">Daily Top News</h2>

      {/* Search Bar and Dropdown */}
      <Row className="mb-4">
        <Col sm={12} md={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col sm={12} md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {selectedCategory}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {categories.map((category, index) => (
                <Dropdown.Item key={index} onClick={() => setSelectedCategory(category)}>
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* News Cards */}
      <Row>
        {news.length > 0 ? (
          news.map((article, index) => (
            <Col key={index} sm={12} md={6} lg={4} xl={3}>
              <Card className="mb-4 news-card">
                <Card.Img variant="top" src={article.image} alt={article.heading} />
                <Card.Body>
                  <Card.Title className="card-title">{article.heading}</Card.Title>
                  <Card.Text className="card-text">{article.paragraph}</Card.Text>
                  <Button variant="secondary" href={article.link} target="_blank">
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <div className="text-center">No news articles found.</div>
        )}
      </Row>
    </Container>
  );
};

export default TopNewsSection;
