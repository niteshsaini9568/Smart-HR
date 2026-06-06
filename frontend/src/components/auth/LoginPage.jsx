import { Link, Navigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

import AuthLayout from '../shared/AuthLayout';

import LoginForm from './LoginForm';



const ROLE_TITLES = {

  admin: 'Admin',

  hr_recruiter: 'HR Manager',

  manager: 'Manager',

  employee: 'Employee',

};



export default function LoginPage() {

  const [searchParams] = useSearchParams();

  const { isAuthenticated } = useAuth();

  const role = searchParams.get('role');

  const roleTitle = role ? ROLE_TITLES[role] : null;



  if (isAuthenticated) {

    return <Navigate to="/" replace />;

  }



  return (

    <AuthLayout

      title="Sign In"

      subtitle={roleTitle ? `Portal access as ${roleTitle}` : 'Access your SmartHR account'}

    >

      <LoginForm expectedRole={role} />

      <p className="mt-6 text-center text-sm text-muted-foreground">

        Don&apos;t have an account?{' '}

        {role === 'employee' ? (

          <Link to="/register" className="text-blue-400 font-medium hover:underline">Register</Link>

        ) : (

          <Link to="/#contact" className="text-blue-400 font-medium hover:underline">Contact Admin</Link>

        )}

      </p>

      <p className="mt-3 text-center text-sm text-muted-foreground">

        <Link to="/" className="hover:text-foreground transition-colors">← Back to home</Link>

      </p>

    </AuthLayout>

  );

}


