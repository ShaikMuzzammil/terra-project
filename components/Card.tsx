import { cn } from "@/lib/utils";
export default function Card({ children, className, hover=true }: { children:React.ReactNode; className?:string; hover?:boolean }) {
  return <div className={cn("card", hover && "card-hover", className)}>{children}</div>;
}
