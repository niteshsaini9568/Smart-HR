import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import LoadingScreen from '../shared/LoadingScreen';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('OAuth authentication failed. Please try again.');
        navigate('/');
        return;
      }

      if (token) {
        try {
          localStorage.setItem('token', token);
          if (setToken) setToken(token);
          toast.success('Successfully signed in!');
          navigate('/');
        } catch (err) {
          console.error('OAuth callback error:', err);
          toast.error('Authentication failed. Please try again.');
          navigate('/');
        }
      } else {
        toast.error('No authentication token received.');
        navigate('/');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setToken]);

  return <LoadingScreen message="Completing sign in..." />;
}
