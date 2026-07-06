import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function GoogleButton({ text = 'continue_with' }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      await googleLogin(response.credential);
      toast.success('Welcome!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="google-btn-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in was cancelled')}
        theme="filled_black"
        size="large"
        width="100%"
        text={text}
        shape="rectangular"
      />
    </div>
  );
}
