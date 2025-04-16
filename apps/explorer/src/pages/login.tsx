import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      // Assuming login returns a Promise
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(
        typeof err === 'string'
          ? err
          : 'Failed to login. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen 
        flex 
        items-center 
        justify-center
        bg-gradient-to-b 
        from-gradient-blue-start 
        to-gradient-blue-end
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          bg-white 
          p-8 
          rounded-lg 
          shadow-md 
          w-full 
          max-w-md
        "
      >
        <h2 className="text-2xl font-bold mb-6 text-ebony">Log In</h2>

        {error && (
          <div
            className="mb-4 p-3 bg-issue-light text-issue-dark rounded"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-ebony mb-2 font-medium"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full 
              p-3 
              border 
              border-gray-55 
              rounded 
              focus:outline-none 
              focus:ring-2 
              focus:ring-sui
            "
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-ebony mb-2 font-medium"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full 
              p-3 
              border 
              border-gray-55 
              rounded 
              focus:outline-none 
              focus:ring-2 
              focus:ring-sui
            "
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          className="
            w-full 
            bg-sui 
            text-white 
            p-3 
            rounded 
            hover:bg-sui-dark 
            flex 
            justify-center 
            items-center 
            h-12 
            font-medium
          "
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
