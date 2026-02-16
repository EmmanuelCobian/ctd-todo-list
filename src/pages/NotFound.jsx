import { Link } from 'react-router';

function NotFound() {
  return (
    <>
      <p>page not found</p>
      <Link to={'/'}>Go back home</Link>
    </>
  );
}

export default NotFound;
