import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DriveCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setError(`Authorization error: ${decodeURIComponent(error)}`);
      return;
    }

    if (token) {
      // Se temos um token de confirmação, a autenticação foi bem-sucedida
      try {
        // Opcionalmente pode fazer algo com o token, como armazenar temporariamente
        // ou verificar informações adicionais
        localStorage.setItem('driveConnected', 'true');
        setStatus('success');

        // Timeout para mostrar a mensagem de sucesso antes de redirecionar
        const timer = setTimeout(() => {
          navigate('/drive');
        }, 2000);

        return () => clearTimeout(timer);
      } catch (err) {
        setStatus('error');
        setError('Failed to process authentication response');
      }
    } else {
      setStatus('error');
      setError('No authentication token received from server');
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === 'processing' && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Google Drive Authorization</h2>
          <p className="text-gray-600">Please wait while we complete the authorization process...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authorization Successful</h2>
          <p className="text-gray-600">Your Google Drive account has been successfully connected.</p>
          <p className="text-gray-500 mt-4">Redirecting you back to the application...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authorization Failed</h2>
          <p className="text-red-600">{error || 'An error occurred during the authorization process.'}</p>
          <button
            onClick={() => navigate('/drive')}
            className="mt-6 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            Return to Drive Integration
          </button>
        </>
      )}
    </div>
  );
};

export default DriveCallbackPage;