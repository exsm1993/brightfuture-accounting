import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePeople } from '@/hooks/usePeople';
import { PersonFormDialog } from '@/components/forms/PersonFormDialog';
import { Search, UserCheck, UserX, Loader2 } from 'lucide-react';

const PeoplePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { data: people = [], isLoading } = usePeople();

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || person.role === roleFilter;
    const matchesActive = activeFilter === 'all' || 
      (activeFilter === 'active' && person.active) ||
      (activeFilter === 'inactive' && !person.active);
    return matchesSearch && matchesRole && matchesActive;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'closer': return 'bg-primary/10 text-primary border-primary/20';
      case 'setter': return 'bg-success/10 text-success border-success/20';
      case 'team_leader': return 'bg-warning/10 text-warning border-warning/20';
      case 'call_center': return 'bg-info/10 text-info border-info/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatRole = (role: string) =>
    role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const formatPayFrequency = (freq: string) => {
    switch (freq) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-Weekly';
      case 'monthly': return 'Monthly';
      default: return freq;
    }
  };

  const getPaymentTypes = (person: typeof people[0]) => {
    const types: string[] = [];
    if (person.receives_commission) types.push('Commission');
    if (person.receives_bonus) types.push('Bonus');
    if (person.receives_salary) types.push('Salary');
    return types.length > 0 ? types.join(', ') : '—';
  };

  return (
    <AppLayout 
      title="Users" 
      subtitle="Manage team members and their roles"
      actions={<PersonFormDialog />}
    >
      <div className="space-y-4 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Closers</p>
            <p className="text-2xl font-bold">{people.filter(p => p.role === 'closer' && p.active).length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Setters</p>
            <p className="text-2xl font-bold">{people.filter(p => p.role === 'setter' && p.active).length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Team Leaders</p>
            <p className="text-2xl font-bold">{people.filter(p => p.role === 'team_leader' && p.active).length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Call Center</p>
            <p className="text-2xl font-bold">{people.filter(p => p.role === 'call_center' && p.active).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="closer">Closer</SelectItem>
                <SelectItem value="setter">Setter</SelectItem>
                <SelectItem value="team_leader">Team Leader</SelectItem>
                <SelectItem value="call_center">Call Center</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Pay Frequency</TableHead>
                <TableHead>Payment Types</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPeople.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    No users found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPeople.map((person) => (
                  <TableRow key={person.id} className="data-table-row">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium">{person.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${getRoleBadgeColor(person.role)}`}>
                        {formatRole(person.role)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPayFrequency(person.pay_frequency)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getPaymentTypes(person)}
                    </TableCell>
                    <TableCell>
                      {person.active ? (
                        <span className="inline-flex items-center gap-1 text-sm text-success">
                          <UserCheck className="h-4 w-4" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <UserX className="h-4 w-4" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <PersonFormDialog
                        person={person}
                        trigger={<Button variant="ghost" size="sm">Edit</Button>}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PeoplePage;
