import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '../styles/BackButton.css';

const BackButton = ({ destination = '/home' }) => {
  return (
    <div className='back-button'>
      <Link to={destination} className='back-button'>
        <BsArrowLeft className='icon' />
      </Link>
    </div>
  );
};

export default BackButton;
