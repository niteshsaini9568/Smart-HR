import { useState, useEffect } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '../ui/button';

import { Badge } from '../ui/badge';

import { Loader2, MapPin, DollarSign, Users, Calendar, Heart, ArrowLeft } from 'lucide-react';

import jobService from '../../services/jobService';

import PublicPageHeader from '../shared/PublicPageHeader';



export default function JobOpportunityDetailPage() {

  const { jobId } = useParams();

  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    const fetchJob = async () => {

      setIsLoading(true);

      setError(null);

      try {

        const response = await jobService.getJobById(jobId);

        if (response.success && response.data) {

          setJob(response.data);

        } else {

          setError('Job not found');

        }

      } catch (err) {

        console.error('Error fetching job:', err);

        setError('Failed to load job details');

      } finally {

        setIsLoading(false);

      }

    };

    if (jobId) fetchJob();

  }, [jobId]);



  const formatDate = (dateString) => {

    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  };



  const formatSalary = (salary) => {

    if (!salary) return 'Not specified';

    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;

  };



  const goToLogin = () => navigate('/login?role=employee');



  if (isLoading) {

    return (

      <div className="min-h-screen bg-background flex items-center justify-center">

        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />

      </div>

    );

  }



  if (error || !job) {

    return (

      <div className="min-h-screen bg-background">

        <PublicPageHeader title="Job Not Found" />

        <div className="max-w-6xl mx-auto px-4 py-20 text-center">

          <p className="text-muted-foreground mb-4">{error || 'This job posting could not be found.'}</p>

          <Button asChild><Link to="/opportunities">Back to Opportunities</Link></Button>

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-background">

      <PublicPageHeader

        title={job.title}

        description="Full details for this job opportunity"

        backTo="/opportunities"

        backLabel="Back to opportunities"

      />



      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">

          <div className="flex flex-wrap gap-2">

            <Badge variant="secondary">{job.department}</Badge>

            <Badge variant="outline">{job.employmentType}</Badge>

            <Badge variant="outline">{job.experienceLevel}</Badge>

          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">

            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-400" />{job.location}</div>

            <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-blue-400" />{formatSalary(job.salary)}</div>

            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-400" />{job.openings} opening{job.openings !== 1 ? 's' : ''}</div>

            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-400" />Deadline: {formatDate(job.deadline)}</div>

          </div>



          <div>

            <h2 className="font-display font-semibold text-lg mb-2">Job Description</h2>

            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{job.description}</p>

          </div>



          {job.responsibilities?.length > 0 && (

            <div>

              <h2 className="font-display font-semibold text-lg mb-2">Key Responsibilities</h2>

              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">

                {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}

              </ul>

            </div>

          )}



          {job.qualifications?.length > 0 && (

            <div>

              <h2 className="font-display font-semibold text-lg mb-2">Required Qualifications</h2>

              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">

                {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}

              </ul>

            </div>

          )}



          {job.skills?.length > 0 && (

            <div>

              <h2 className="font-display font-semibold text-lg mb-2">Required Skills</h2>

              <div className="flex flex-wrap gap-2">

                {job.skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}

              </div>

            </div>

          )}



          {job.benefits?.length > 0 && (

            <div>

              <h2 className="font-display font-semibold text-lg mb-2">Benefits</h2>

              <div className="flex flex-wrap gap-2">

                {job.benefits.map((benefit, i) => <Badge key={i} variant="outline">{benefit}</Badge>)}

              </div>

            </div>

          )}



          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">

            <Button className="flex-1" onClick={goToLogin}>Apply Now</Button>

            <Button variant="outline" onClick={goToLogin}><Heart className="h-4 w-4 mr-2" />Save Job</Button>

            <Button variant="ghost" asChild>

              <Link to="/opportunities"><ArrowLeft className="h-4 w-4 mr-2" />Back to List</Link>

            </Button>

          </div>

        </div>

      </main>

    </div>

  );

}


