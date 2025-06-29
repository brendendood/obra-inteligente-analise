
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Building, Tag } from 'lucide-react';

interface UserCardProps {
  user: {
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    company: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    sector: string | null;
    tags: string[] | null;
    subscription: {
      plan: string;
      status: string;
    } | null;
  };
  onUpdateTags: (userId: string, tags: string[]) => void;
  onUpdatePlan: (userId: string, plan: string) => void;
}

export const UserCard = ({ user, onUpdateTags, onUpdatePlan }: UserCardProps) => {
  const [newTags, setNewTags] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateTags = () => {
    const tagsArray = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onUpdateTags(user.user_id, tagsArray);
    setDialogOpen(false);
    setNewTags('');
  };

  const handlePlanChange = (newPlan: string) => {
    if (newPlan === 'free' || newPlan === 'pro' || newPlan === 'enterprise') {
      onUpdatePlan(user.user_id, newPlan);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{user.full_name || 'Nome não informado'}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getPlanColor(user.subscription?.plan || 'free')}>
              {user.subscription?.plan?.toUpperCase() || 'FREE'}
            </Badge>
            <Badge className={getStatusColor(user.subscription?.status || 'active')}>
              {user.subscription?.status || 'active'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Company and Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {user.company && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{user.company}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
            )}
            {(user.city || user.state) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {[user.city, user.state].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            {user.sector && (
              <div className="text-sm text-gray-600">
                <strong>Setor:</strong> {user.sector}
              </div>
            )}
          </div>

          {/* Tags */}
          {user.tags && user.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {user.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setNewTags(user.tags?.join(', ') || '');
                    setDialogOpen(true);
                  }}
                >
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Tags - {user.full_name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Digite as tags separadas por vírgula"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateTags}>
                      Salvar Tags
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Select 
              value={user.subscription?.plan || 'free'}
              onValueChange={handlePlanChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
