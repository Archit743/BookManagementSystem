import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import '../styles/ShowBook.css';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='details-container'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show Book</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='details-container'>
          <div className='detail-item'>
            <span className='label'>Id</span>
            <span className='value'>{book._id}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Title</span>
            <span className='value'>{book.title}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Author</span>
            <span className='value'>{book.author}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Publish Year</span>
            <span className='value'>{book.publishYear}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Create Time</span>
            <span className='value'>{new Date(book.createdAt).toString()}</span>
          </div>
          <div className='detail-item'>
            <span className='label'>Last Update Time</span>
            <span className='value'>{new Date(book.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
