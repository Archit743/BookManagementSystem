import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox } from 'react-icons/md';
import Spinner from '../components/Spinner';
import BooksTable from '../components/home/BooksTable';
import '../styles/Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showType, setShowType] = useState('table');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt'); // Retrieve the token
  
    if (!token) {
      setError('You must be logged in to view books.');
      setLoading(false);
      return;
    }
  
    axios
      .get('http://localhost:5555/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load books. Ensure you are logged in and try again.');
        setLoading(false);
      });
  }, []);
  

  return (
    <div className="home-container p-4">
      {/* View Switch Buttons */}
      <div className="button-wrapper">
        <button
          className={`view-button ${showType === 'table' ? 'active' : ''}`}
          onClick={() => setShowType('table')}
        >
          Table
        </button>
        <button
          className={`view-button ${showType === 'card' ? 'active' : ''}`}
          onClick={() => setShowType('card')}
        >
          Card
        </button>
      </div>

      {/* Header Section */}
      <div className="header flex justify-between items-center">
        <h1 className="page-title">Books List</h1>
        <Link to="/books/create">
          <MdOutlineAddBox className="add-icon" />
        </Link>
      </div>

      {/* Render Content */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : showType === 'table' ? (
        <BooksTable books={books} />
      ) : (
        <div className="card-grid">
          {books.map((book) => (
            <div className="card" key={book._id}>
              <img
                src={book.imageUrl || 'https://via.placeholder.com/150'}
                alt={book.title || 'No Title'}
                className="card-img"
              />
              <div className="card-footer">
                <Link to={`/books/${book._id}`} className="card-action">
                  <BsInfoCircle /> View
                </Link>
                <Link to={`/books/edit/${book._id}`} className="card-action">
                  <AiOutlineEdit /> Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
