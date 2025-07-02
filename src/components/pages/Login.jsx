import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/App';

function Login() {
  const { isInitialized } = useContext(AuthContext) || {};
  
  useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-surface-800 rounded-lg shadow-md border border-surface-600">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-2xl 2xl:text-3xl font-bold">
            W
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold text-accent">
              Sign in to Wild West Showdown
            </div>
            <div className="text-center text-sm text-surface-400">
              Welcome back, partner. Ready to test your aim?
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-accent hover:text-accent/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;