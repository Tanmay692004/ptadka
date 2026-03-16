import { cn } from "@/lib/utils";

interface PaperclipProps {
  className?: string;
}

export function Paperclip({ className }: PaperclipProps) {
  return (
    <div
      className={cn(
        "absolute -top-4 right-5 w-9 h-20 z-10 transition-transform duration-300 group-hover:rotate-0",
        className
      )}
      style={{ transform: "rotate(-15deg)" }}
    >
      <svg
        viewBox="0 0 40 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full dark:stroke-[#888] stroke-[#ffd700]"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path
          d="M20 5C12 5 5 12 5 20V55C5 65 13 73 23 73C33 73 41 65 41 55V25C41 18 35 12 28 12C21 12 15 18 15 25V52C15 57 19 61 24 61C29 61 33 57 33 52V30"
          fill="none"
        />
      </svg>
    </div>
  );
}
