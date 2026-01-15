import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { issueCategories } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Building2, 
  Wifi, 
  Bus, 
  GraduationCap, 
  Utensils, 
  Bath,
  MoreHorizontal
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Building2,
  Wifi,
  Bus,
  GraduationCap,
  Utensils,
  Bath,
  MoreHorizontal,
};

export default function ReportIssuePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="lg:flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complaint</h1>
            <p className="text-muted-foreground">
              Submit your issues and we'll take care of them
            </p>
          </div>
          <div className="lg:flex-1 flex justify-center lg:justify-end">
            <div className="w-64 h-48 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Report Issues</p>
              </div>
            </div>
          </div>
        </div>

        {/* List of Issues Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">List Of Issues</h2>
          <p className="text-muted-foreground">Feel free to complaint here</p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {issueCategories.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            return (
              <Link
                key={category.id}
                to={category.href}
                className="group block"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="relative bg-card border border-border rounded-xl p-6 text-center transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 hover:border-primary/30">
                  <div className="rounded-xl p-4 mx-auto w-fit bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">Report Issue</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
