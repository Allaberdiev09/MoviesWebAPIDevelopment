import { Modal, show, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import youtubeLogo from "./youtube.png";
const Api_Image = "https://image.tmdb.org/t/p/w500/";

const MovieContainer = ({ title, poster_path, vote_average, release_date, overview }) => {
    const Api_News = "https://newsapi.org/v2/everything?pageSize=12&domains=hollywoodreporter.com,collider.com,screenrant.com,ew.com,cinemablend.com&sortBy=relevancy&q=";
    const Api_Key_News = "39c63b60afdb462cafa1186425f47634";

    const [show, setShow] = useState(false);
    const [news, setNews] = useState([]);

    const ShowModal = () => setShow(true);
    const CloseModal = () => setShow(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get(`${Api_News}${encodeURIComponent(title)}&apiKey=${Api_Key_News}`);
            setNews(response.data.articles);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    return (
        <div className="card text-center bg-secondary mb-3">
            <div className="card-body">
                <img className="card-img-top" src={Api_Image + poster_path} />
                <div className="card-body">
                    <button type="button" className="btn btn-dark" onClick={ShowModal} >View Details</button>
                    <Modal show={show} onHide={CloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <img className="card-img-top" style={{ width: '300px' }} src={Api_Image + poster_path} />
                            <h3>{title}</h3>
                            <h4>IMDb: {vote_average}</h4>
                            <h5>Date Released: {release_date}</h5>
                            <h6>Overview</h6>
                            <p>{overview}</p>
                            <h6>YouTube Trailer:</h6>
                            <a href={`https://www.youtube.com/results?search_query=${title} trailer`} target='blank'>
                                <img src={youtubeLogo} />
                            </a>
                            <h6>  </h6>
                            <h6>Related News:</h6>
                            {news.map((article, index) => (
                                <div key={index}>
                                    <h5>{article.title}</h5>
                                    <p>{article.description}</p>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                                </div>
                            ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={CloseModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default MovieContainer;
