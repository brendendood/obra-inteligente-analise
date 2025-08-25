/**
 * Components UI Barrel - Re-exports dos componentes mais utilizados
 * Facilita importação dos componentes shadcn/ui mais usados
 */

// Componentes base mais utilizados (baseado em docs/inventory)
export { Button } from '@/components/ui/button'; // 100+ componentes
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // 80+ componentes
export { Input } from '@/components/ui/input'; // 60+ componentes
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // 40+ componentes
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // 30+ componentes

// Outros componentes UI frequentemente usados
export { Label } from '@/components/ui/label';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export { Textarea } from '@/components/ui/textarea';
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export { Badge } from '@/components/ui/badge';
export { Separator } from '@/components/ui/separator';
export { ScrollArea } from '@/components/ui/scroll-area';
export { Progress } from '@/components/ui/progress';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Sistema de toast
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';