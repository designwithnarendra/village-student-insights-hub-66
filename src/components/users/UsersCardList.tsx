
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  role: string;
  assignedTo: string;
  username: string;
  password: string;
  createdOn: string;
  villages: string[];
}

interface UsersCardListProps {
  users: User[];
  onUserClick: (user: User) => void;
  onEditUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
  onCopyLoginDetails: (username: string, password: string) => void;
}

const UsersCardList = ({ users, onUserClick, onEditUser, onDeleteUser, onCopyLoginDetails }: UsersCardListProps) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
    setActiveSheet(null);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete);
      setUserToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleCopyClick = (username: string, password: string) => {
    onCopyLoginDetails(username, password);
    toast({
      title: "Login details copied",
      description: "Username and password have been copied to clipboard",
    });
    setActiveSheet(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <>
      <div className="md:hidden space-y-3">
        {users.map((user, index) => (
          <div key={user.id}>
            <div className="flex items-start justify-between py-3" onClick={() => onUserClick(user)}>
              <div className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-base">{user.name}</h3>
                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {user.username} • Password: {user.password}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div>Created: {formatDate(user.createdOn)}</div>
                  <div>Assigned to: {user.assignedTo}</div>
                </div>
              </div>
              
              <Sheet 
                open={activeSheet === user.id.toString()} 
                onOpenChange={(open) => setActiveSheet(open ? user.id.toString() : null)}
              >
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto">
                  <SheetHeader>
                    <SheetTitle>Actions for {user.name}</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-2 mt-4">
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12"
                      onClick={() => handleCopyClick(user.username, user.password)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy Login Details
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12"
                      onClick={() => {
                        onEditUser(user.id);
                        setActiveSheet(null);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit User
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12 text-destructive"
                      onClick={() => handleDeleteClick(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete User
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {index < users.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersCardList;
