import { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

import { Badge } from '../ui/badge';

import { Input } from '../ui/input';

import { Card, CardContent } from '../ui/card';

import {

  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,

} from '../ui/select';

import {

  Loader2, MapPin, Briefcase, DollarSign, Users, Clock,

  Search, Heart, Eye, ChevronLeft, ChevronRight,

} from 'lucide-react';

import jobService from '../../services/jobService';

import PublicPageHeader from '../shared/PublicPageHeader';



export default function JobOpportunitiesPage() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [filteredJobs, setFilteredJobs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const [selectedType, setSelectedType] = useState('all');

  const [selectedLevel, setSelectedLevel] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(6);

  const [totalPages, setTotalPages] = useState(1);



  useEffect(() => {

    fetchJobs();

  }, []);



  useEffect(() => {

    let filtered = jobs;

    if (searchTerm) {

      filtered = filtered.filter(job =>

        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||

        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||

        job.location.toLowerCase().includes(searchTerm.toLowerCase())

      );

    }

    if (selectedDepartment !== 'all') filtered = filtered.filter(job => job.department === selectedDepartment);

    if (selectedType !== 'all') filtered = filtered.filter(job => job.employmentType === selectedType);

    if (selectedLevel !== 'all') filtered = filtered.filter(job => job.experienceLevel === selectedLevel);



    setFilteredJobs(filtered);

    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));

    setCurrentPage(1);

  }, [searchTerm, selectedDepartment, selectedType, selectedLevel, jobs, itemsPerPage]);



  const fetchJobs = async () => {

    setIsLoading(true);

    setError(null);

    try {

      const response = await jobService.getJobs({ status: 'open', limit: 1000 });

      if (response.success && response.data) {

        setJobs(response.data);

        setFilteredJobs(response.data);

      } else {

        setError('Failed to load job opportunities');

      }

    } catch (err) {

      console.error('Error fetching jobs:', err);

      setError('Failed to load job opportunities');

    } finally {

      setIsLoading(false);

    }

  };



  const formatDate = (dateString) => {

    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  };



  const formatSalary = (salary) => {

    if (!salary) return 'Not specified';

    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;

  };



  const getPaginatedJobs = () => {

    const start = (currentPage - 1) * itemsPerPage;

    return filteredJobs.slice(start, start + itemsPerPage);

  };



  const clearFilters = () => {

    setSearchTerm('');

    setSelectedDepartment('all');

    setSelectedType('all');

    setSelectedLevel('all');

  };



  const goToLogin = () => navigate('/login?role=employee');



  const departments = [...new Set(jobs.map(job => job.department))];

  const employmentTypes = [...new Set(jobs.map(job => job.employmentType))];

  const experienceLevels = [...new Set(jobs.map(job => job.experienceLevel))];



  return (

    <div className="min-h-screen bg-background">

      <PublicPageHeader

        title="Job Opportunities"

        description="Explore open positions and find your next career opportunity"

      />



      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        <div className="space-y-4 mb-8">

          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input

              placeholder="Search by job title, description, or location..."

              value={searchTerm}

              onChange={(e) => setSearchTerm(e.target.value)}

              className="pl-10 bg-input"

            />

          </div>



          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>

              <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>

              <SelectContent>

                <SelectItem value="all">All Departments</SelectItem>

                {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}

              </SelectContent>

            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>

              <SelectTrigger><SelectValue placeholder="Employment Type" /></SelectTrigger>

              <SelectContent>

                <SelectItem value="all">All Types</SelectItem>

                {employmentTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}

              </SelectContent>

            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>

              <SelectTrigger><SelectValue placeholder="Experience Level" /></SelectTrigger>

              <SelectContent>

                <SelectItem value="all">All Levels</SelectItem>

                {experienceLevels.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}

              </SelectContent>

            </Select>

          </div>



          <div className="flex items-center justify-between text-sm text-muted-foreground">

            <span>{filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} available</span>

            {(searchTerm || selectedDepartment !== 'all' || selectedType !== 'all' || selectedLevel !== 'all') && (

              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear Filters</Button>

            )}

          </div>

        </div>



        {isLoading ? (

          <div className="flex items-center justify-center py-20">

            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />

          </div>

        ) : error ? (

          <div className="text-center py-20">

            <p className="text-destructive mb-4">{error}</p>

            <Button onClick={fetchJobs}>Try Again</Button>

          </div>

        ) : filteredJobs.length === 0 ? (

          <div className="text-center py-20">

            <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />

            <p className="text-muted-foreground">No job opportunities found matching your criteria.</p>

          </div>

        ) : (

          <>

            <div className="space-y-4">

              {getPaginatedJobs().map((job) => (

                <Card

                  key={job._id}

                  className="border-border hover:border-blue-500/30 transition-colors cursor-pointer"

                  onClick={() => navigate(`/opportunities/${job._id}`)}

                >

                  <CardContent className="p-5 sm:p-6">

                    <div className="flex flex-col gap-4">

                      <div className="flex-1 min-w-0">

                        <h3 className="text-lg font-semibold text-foreground mb-2">{job.title}</h3>

                        <div className="flex flex-wrap gap-2 mb-3">

                          <Badge variant="secondary">{job.department}</Badge>

                          <Badge variant="outline">{job.employmentType}</Badge>

                          <Badge variant="outline">{job.experienceLevel}</Badge>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">

                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{job.location}</span></div>

                          <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 shrink-0" /><span className="truncate">{formatSalary(job.salary)}</span></div>

                          <div className="flex items-center gap-2"><Users className="h-4 w-4 shrink-0" /><span>{job.openings} opening{job.openings !== 1 ? 's' : ''}</span></div>

                          <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /><span>Deadline: {formatDate(job.deadline)}</span></div>

                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        <Button size="sm" onClick={(e) => { e.stopPropagation(); goToLogin(); }}>Apply Now</Button>

                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); goToLogin(); }}>

                          <Heart className="h-4 w-4" />

                        </Button>

                        <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>

                          <Link to={`/opportunities/${job._id}`}><Eye className="h-4 w-4 mr-1" />View Details</Link>

                        </Button>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>



            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">

              <div className="flex items-center gap-2 text-sm text-muted-foreground">

                <span>Show:</span>

                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>

                  <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>

                  <SelectContent>

                    <SelectItem value="6">6</SelectItem>

                    <SelectItem value="12">12</SelectItem>

                    <SelectItem value="24">24</SelectItem>

                  </SelectContent>

                </Select>

                <span>per page</span>

              </div>

              <div className="flex items-center gap-2">

                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>

                  <ChevronLeft className="h-4 w-4" />

                </Button>

                <span className="text-sm text-muted-foreground px-2">Page {currentPage} of {totalPages}</span>

                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>

                  <ChevronRight className="h-4 w-4" />

                </Button>

              </div>

            </div>

          </>

        )}

      </main>

    </div>

  );

}


