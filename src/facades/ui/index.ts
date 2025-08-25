/**
 * UI Facades - Componentes e hooks de interface
 * Re-exports para facilitar importação e estabilizar API pública
 */

// Hooks de UI
export { useToast } from '@/hooks/use-toast';

// Utilitários de UI
export { cn } from '@/lib/utils';

// Componentes base mais utilizados (shadcn/ui)
export { Button } from '@/components/ui/button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
export { Input } from '@/components/ui/input';
export { Label } from '@/components/ui/label';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export { Textarea } from '@/components/ui/textarea';
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export { Badge } from '@/components/ui/badge';
export { Separator } from '@/components/ui/separator';
export { ScrollArea } from '@/components/ui/scroll-area';
export { Progress } from '@/components/ui/progress';