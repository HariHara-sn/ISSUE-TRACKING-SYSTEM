import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  FolderCog,
  Building2,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

interface Department {
  id: string;
  name: string;
  staffCount: number;
  enabled: boolean;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Cleanliness', icon: 'Sparkles', enabled: true },
  { id: '2', name: 'Hostel Issues', icon: 'Building2', enabled: true },
  { id: '3', name: 'WiFi Issues', icon: 'Wifi', enabled: true },
  { id: '4', name: 'Transport Issues', icon: 'Bus', enabled: true },
  { id: '5', name: 'Academy Issues', icon: 'GraduationCap', enabled: true },
  { id: '6', name: 'Canteen Issues', icon: 'Utensils', enabled: true },
  { id: '7', name: 'Restroom Issues', icon: 'Bath', enabled: true },
  { id: '8', name: 'Others', icon: 'MoreHorizontal', enabled: true },
];

const initialDepartments: Department[] = [
  { id: '1', name: 'CSE', staffCount: 3, enabled: true },
  { id: '2', name: 'IT', staffCount: 2, enabled: true },
  { id: '3', name: 'ECE', staffCount: 2, enabled: true },
  { id: '4', name: 'MECH', staffCount: 1, enabled: true },
  { id: '5', name: 'CIVIL', staffCount: 1, enabled: true },
  { id: '6', name: 'MBA', staffCount: 1, enabled: true },
  { id: '7', name: 'MCA', staffCount: 1, enabled: false },
];

const staffMembers = [
  { id: '1', name: 'Sarah Williams' },
  { id: '2', name: 'John Martinez' },
  { id: '3', name: 'Emily Chen' },
  { id: '4', name: 'Ravi Kumar' },
  { id: '5', name: 'Joael Sir' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  
  // Category Dialog
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'Sparkles' });

  // Department Dialog
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentForm, setDepartmentForm] = useState({ name: '', assignedStaff: '' });

  // Category Functions
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', icon: 'Sparkles' });
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, icon: category.icon });
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) return;

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: categoryForm.name, icon: categoryForm.icon }
          : c
      ));
      toast({ title: "Category Updated", description: `${categoryForm.name} has been updated.` });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryForm.name,
        icon: categoryForm.icon,
        enabled: true
      };
      setCategories([...categories, newCategory]);
      toast({ title: "Category Added", description: `${categoryForm.name} has been added.` });
    }
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast({ title: "Category Deleted", description: "Category has been removed." });
  };

  const handleToggleCategory = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  // Department Functions
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentForm({ name: '', assignedStaff: '' });
    setIsDepartmentDialogOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentForm({ name: department.name, assignedStaff: '' });
    setIsDepartmentDialogOpen(true);
  };

  const handleSaveDepartment = () => {
    if (!departmentForm.name.trim()) return;

    if (editingDepartment) {
      setDepartments(departments.map(d => 
        d.id === editingDepartment.id 
          ? { ...d, name: departmentForm.name }
          : d
      ));
      toast({ title: "Department Updated", description: `${departmentForm.name} has been updated.` });
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: departmentForm.name,
        staffCount: 0,
        enabled: true
      };
      setDepartments([...departments, newDepartment]);
      toast({ title: "Department Added", description: `${departmentForm.name} has been added.` });
    }
    setIsDepartmentDialogOpen(false);
  };

  const handleToggleDepartment = (id: string) => {
    setDepartments(departments.map(d => 
      d.id === id ? { ...d, enabled: !d.enabled } : d
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header with Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings & Configuration</h1>
          <p className="mt-1 text-muted-foreground">
            Manage categories, departments, and system settings
          </p>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="categories" className="gap-2">
              <FolderCog className="h-4 w-4" />
              Category Management
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <Building2 className="h-4 w-4" />
              Department Management
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Issue Categories</h3>
                  <p className="text-sm text-muted-foreground">Manage issue types and categories</p>
                </div>
                <Button variant="hero" onClick={handleAddCategory}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>

              <div className="space-y-3">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={category.enabled}
                        onCheckedChange={() => handleToggleCategory(category.id)}
                      />
                      <span className={`font-medium ${!category.enabled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {category.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">{category.icon}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Departments</h3>
                  <p className="text-sm text-muted-foreground">Manage departments and staff assignments</p>
                </div>
                <Button variant="hero" onClick={handleAddDepartment}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </div>

              <div className="space-y-3">
                {departments.map((department) => (
                  <div 
                    key={department.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={department.enabled}
                        onCheckedChange={() => handleToggleDepartment(department.id)}
                      />
                      <span className={`font-medium ${!department.enabled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {department.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {department.staffCount} staff
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditDepartment(department)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Category Dialog */}
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="Enter category name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon</Label>
                <Select 
                  value={categoryForm.icon} 
                  onValueChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sparkles">Sparkles</SelectItem>
                    <SelectItem value="Building2">Building</SelectItem>
                    <SelectItem value="Wifi">WiFi</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="GraduationCap">Graduation Cap</SelectItem>
                    <SelectItem value="Utensils">Utensils</SelectItem>
                    <SelectItem value="Bath">Bath</SelectItem>
                    <SelectItem value="MoreHorizontal">More</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleSaveCategory}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {editingCategory ? 'Update' : 'Add'} Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Department Dialog */}
        <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="department-name">Department Name</Label>
                <Input
                  id="department-name"
                  placeholder="Enter department name"
                  value={departmentForm.name}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                />
              </div>
              {editingDepartment && (
                <div className="space-y-2">
                  <Label htmlFor="assign-staff">Assign Staff</Label>
                  <Select 
                    value={departmentForm.assignedStaff} 
                    onValueChange={(value) => setDepartmentForm({ ...departmentForm, assignedStaff: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleSaveDepartment}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {editingDepartment ? 'Update' : 'Add'} Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
