
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  block: string;
  village: string;
  schoolStatus: string;
  school?: string;
}

interface ChildrenTableProps {
  data: Student[];
  onChildClick: (childId: string) => void;
  onEditChild?: (childId: string) => void;
  onDeleteChild: (childId: string) => void;
}

const ChildrenTable = ({ data, onChildClick, onEditChild, onDeleteChild }: ChildrenTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return <Badge className="status-enrolled">{status}</Badge>;
      case 'Dropout':
        const dropoutPeriod = Math.floor(Math.random() * 18) + 1;
        const displayText = dropoutPeriod > 12 ? 'Dropout > 1 year' : `Dropout for ${dropoutPeriod} months`;
        return <Badge className="status-dropout">{displayText}</Badge>;
      case 'Never Enrolled':
        return <Badge className="status-never">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEditChild = (childId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEditChild) {
      onEditChild(childId);
    }
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Aadhar No.</TableHead>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Age</TableHead>
                <TableHead className="font-bold">Gender</TableHead>
                <TableHead className="font-bold">Block</TableHead>
                <TableHead className="font-bold">Village</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">School</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((student, index) => (
                <TableRow 
                  key={student.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/30" : ""}`}
                  onClick={() => onChildClick(student.id)}
                >
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.block}</TableCell>
                  <TableCell>{student.village}</TableCell>
                  <TableCell>{getStatusBadge(student.schoolStatus)}</TableCell>
                  <TableCell>{student.school || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleEditChild(student.id, e)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Child Record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the record for {student.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChild(student.id);
                            }} className="bg-destructive text-destructive-foreground">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildrenTable;
