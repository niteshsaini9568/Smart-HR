import { Link } from 'react-router-dom';

import { ArrowLeft, LayoutGrid } from 'lucide-react';

import { Button } from '../ui/button';



export default function PublicPageHeader({ title, description, backTo = '/', backLabel = 'Back to home' }) {

  return (

    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-40">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

        <div className="flex items-center justify-between gap-4 mb-4">

          <Link to="/" className="flex items-center gap-2.5 shrink-0">

            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">

              <LayoutGrid className="h-4 w-4 text-white" />

            </div>

            <span className="font-display font-semibold text-foreground">SmartHR</span>

          </Link>

          <div className="flex items-center gap-2">

            <Button variant="outline" size="sm" asChild>

              <Link to="/login?role=employee">Sign In</Link>

            </Button>

            <Button size="sm" asChild>

              <Link to="/register">Register</Link>

            </Button>

          </div>

        </div>

        <Link

          to={backTo}

          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"

        >

          <ArrowLeft className="h-4 w-4" />

          {backLabel}

        </Link>

        {title && <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>}

        {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}

      </div>

    </header>

  );

}


