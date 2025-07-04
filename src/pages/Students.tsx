
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudentData, type StudentData, type FilterOptions } from '../data/mockData';
import { downloadCSV, downloadPDF } from '../utils/exportUtils';
import { Download, Filter, Search } from 'lucide-react';

const Students = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    block: 'all',
    cluster: 'all',
    village: 'all',
    panchayat: 'all',
    gender: 'all',
    schoolStatus: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      blocks: [...new Set(mockStudentData.map(student => student.block))],
      clusters: [...new Set(mockStudentData.map(student => student.cluster))],
      villages: [...new Set(mockStudentData.map(student => student.village))],
      panchayats: [...new Set(mockStudentData.map(student => student.panchayat))],
      genders: ['Male', 'Female'],
      schoolStatuses: ['Enrolled', 'Dropout', 'Never Enrolled']
    };
  }, []);

  // Filter and search data
  const filteredData = useMemo(() => {
    return mockStudentData.filter(student => {
      const matchesFilters = (
        (filters.block === 'all' || student.block === filters.block) &&
        (filters.cluster === 'all' || student.cluster === filters.cluster) &&
        (filters.village === 'all' || student.village === filters.village) &&
        (filters.panchayat === 'all' || student.panchayat === filters.panchayat) &&
        (filters.gender === 'all' || student.gender === filters.gender) &&
        (filters.schoolStatus === 'all' || student.schoolStatus === filters.schoolStatus)
      );

      const matchesSearch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.block.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilters && matchesSearch;
    });
  }, [filters, searchTerm]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    downloadCSV(filteredData, 'students-data');
  };

  const handleExportPDF = () => {
    const stats = {
      totalStudents: filteredData.length,
      enrolledCount: filteredData.filter(s => s.schoolStatus === 'Enrolled').length,
      dropoutCount: filteredData.filter(s => s.schoolStatus === 'Dropout').length,
      neverEnrolledCount: filteredData.filter(s => s.schoolStatus === 'Never Enrolled').length,
      maleCount: filteredData.filter(s => s.gender === 'Male').length,
      femaleCount: filteredData.filter(s => s.gender === 'Female').length
    };
    downloadPDF(filteredData, stats, 'students-report');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-[#488b8f] border-[#5ea3a3]">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Student Records</CardTitle>
          </CardHeader>
        </Card>

        {/* Search and Filters Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Bar - Takes 1 column */}
          <Card className="bg-[#faf9f9] border-[#5ea3a3]">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#488b8f]" />
                <Input
                  type="text"
                  placeholder="Search by name, Aadhar number, village, or block..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 bg-white border-[#5ea3a3] focus:ring-[#488b8f] text-[#488b8f]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filters - Takes 2 columns */}
          <Card className="lg:col-span-2 bg-[#add2c9] border-[#5ea3a3]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#488b8f] flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="text-[#488b8f] text-sm font-medium mb-1 block">Block</label>
                  <Select value={filters.block} onValueChange={(value) => handleFilterChange('block', value)}>
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blocks</SelectItem>
                      {filterOptions.blocks.map(block => (
                        <SelectItem key={block} value={block}>{block}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#488b8f] text-sm font-medium mb-1 block">Cluster</label>
                  <Select value={filters.cluster} onValueChange={(value) => handleFilterChange('cluster', value)}>
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Select Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clusters</SelectItem>
                      {filterOptions.clusters.map(cluster => (
                        <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#488b8f] text-sm font-medium mb-1 block">Village</label>
                  <Select value={filters.village} onValueChange={(value) => handleFilterChange('village', value)}>
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Select Village" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Villages</SelectItem>
                      {filterOptions.villages.map(village => (
                        <SelectItem key={village} value={village}>{village}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#488b8f] text-sm font-medium mb-1 block">Panchayat</label>
                  <Select value={filters.panchayat} onValueChange={(value) => handleFilterChange('panchayat', value)}>
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Select Panchayat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Panchayats</SelectItem>
                      {filterOptions.panchayats.map(panchayat => (
                        <SelectItem key={panchayat} value={panchayat}>{panchayat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#488b8f] text-sm font-medium mb-1 block">Gender</label>
                  <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      {filterOptions.genders.map(gender => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#488b8f] text-sm font-medium mb-1 block">School Status</label>
                  <Select value={filters.schoolStatus} onValueChange={(value) => handleFilterChange('schoolStatus', value)}>
                    <SelectTrigger className="bg-white h-9 text-sm">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {filterOptions.schoolStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons and Stats */}
        <div className="flex justify-between items-center">
          <div className="text-[#488b8f] font-medium">
            Showing {paginatedData.length} of {filteredData.length} students
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} className="bg-[#5ea3a3] hover:bg-[#488b8f] text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleExportPDF} className="bg-[#5ea3a3] hover:bg-[#488b8f] text-white">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white border-[#5ea3a3]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#5ea3a3] hover:bg-[#5ea3a3]">
                    <TableHead className="text-white font-semibold">Aadhar Number</TableHead>
                    <TableHead className="text-white font-semibold">Name</TableHead>
                    <TableHead className="text-white font-semibold">Age</TableHead>
                    <TableHead className="text-white font-semibold">Gender</TableHead>
                    <TableHead className="text-white font-semibold">Block</TableHead>
                    <TableHead className="text-white font-semibold">Cluster</TableHead>
                    <TableHead className="text-white font-semibold">Village</TableHead>
                    <TableHead className="text-white font-semibold">Panchayat</TableHead>
                    <TableHead className="text-white font-semibold">School Status</TableHead>
                    <TableHead className="text-white font-semibold">Class</TableHead>
                    <TableHead className="text-white font-semibold">School</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((student, index) => (
                    <TableRow key={student.id} className={index % 2 === 0 ? "bg-[#faf9f9]" : "bg-white"}>
                      <TableCell className="font-medium text-[#488b8f]">{student.id}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.name}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.age}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.gender}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.block}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.cluster}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.village}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.panchayat}</TableCell>
                      <TableCell className="text-[#488b8f]">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.schoolStatus === 'Enrolled' ? 'bg-green-100 text-green-800' :
                          student.schoolStatus === 'Dropout' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.schoolStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#488b8f]">{student.class || '-'}</TableCell>
                      <TableCell className="text-[#488b8f]">{student.school || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[#5ea3a3] hover:bg-[#488b8f] text-white"
            >
              Previous
            </Button>
            <span className="text-[#488b8f] font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-[#5ea3a3] hover:bg-[#488b8f] text-white"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
