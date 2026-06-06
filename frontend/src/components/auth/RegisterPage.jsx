import { Link, Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

import AuthLayout from '../shared/AuthLayout';

import RegisterForm from './RegisterForm';



export default function RegisterPage() {

  const { isAuthenticated } = useAuth();



  if (isAuthenticated) {

    return <Navigate to="/" replace />;

  }



  return (

    <AuthLayout

      title="Create Account"

      subtitle="Register as an employee to apply for open positions"

    >

      <RegisterForm expectedRole="employee" />

      <p className="mt-6 text-center text-sm text-muted-foreground">

        Already have an account?{' '}

        <Link to="/login?role=employee" className="text-blue-400 font-medium hover:underline">Sign In</Link>

      </p>

      <p className="mt-3 text-center text-sm text-muted-foreground">

        <Link to="/" className="hover:text-foreground transition-colors">← Back to home</Link>

      </p>

    </AuthLayout>

  );

}


