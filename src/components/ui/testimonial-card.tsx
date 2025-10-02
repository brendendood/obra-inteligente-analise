import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
  // opcional: variação de cor de fundo para o avatar genérico
  // ex.: "bg-blue-500", "bg-emerald-500", etc.
  avatarBg?: string;
}
export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
  className?: string;
}
export function TestimonialCard({
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card: any = href ? 'a' : 'div';
  const initials = author?.name ? author.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase() : "U";
  return <Card {...href ? {
    href,
    target: "_blank",
    rel: "noreferrer"
  } : {}} className={cn("flex flex-col rounded-lg border-t", "bg-gradient-to-b from-muted/50 to-muted/10", "p-3 text-start sm:p-4", "hover:from-muted/60 hover:to-muted/20", "max-w-[430px] sm:max-w-[430px]", "transition-colors duration-300", className)}>
      <div className="flex items-center gap-3">
        <Avatar className={cn("h-12 w-12", !author.avatar && (author.avatarBg ?? "bg-primary/20"))}>
          {author.avatar ? <AvatarImage src={author.avatar} alt={author.name} /> : <AvatarFallback className={cn("text-sm font-semibold")}>
              {initials}
            </AvatarFallback>}
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none">
            {author.name}
          </h3>
          <p className="text-sm text-muted-foreground py-0 px-[59px]">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-muted-foreground">
        {text}
      </p>
    </Card>;
}