type ButtonStyle = "red" | "yellow" | "black" | "white" | "outline";
type ButtonProps = {
    children?: React.ReactNode;
    className?: string;
    variant?: "small" | "normal" | "big";
    link: string;
    Style: ButtonStyle;
};

export default function Buttomsheet({
    className = "",
    variant = "normal",
    link,
    Style,
    children
}:ButtonProps) {
    const sizeClasses = {
        small: "px-4 py-1.5 text-sm",
        normal: "px-6 py-2.5 text-base",
        big: "px-8 py-3.5 text-lg font-bold"
    };
    const styleClasses: Record<ButtonStyle, string> = {
        red: "bg-[var(--institutional-red,#8c1919)] text-white hover:bg-[var(--institutional-gold,#fdb400)] hover:text-[var(--institutional-red,#8c1919)] border border-transparent",
        yellow: "bg-[var(--institutional-gold,#fdb400)] text-[var(--institutional-red,#8c1919)] hover:bg-[var(--institutional-red,#8c1919)] hover:text-white border border-transparent",
        black: "bg-[var(--institutional-charcoal,#000000)] text-white hover:bg-[var(--institutional-red,#8c1919)] border border-transparent",
        white: "bg-white text-[var(--institutional-red,#8c1919)] hover:bg-[var(--institutional-gold,#fdb400)] hover:text-black border border-transparent",
        outline: "bg-transparent text-[var(--institutional-red,#8c1919)] border-2 border-white hover:border-[var(--institutional-gold,#fdb400)] hover:text-white"
    };
return (
    <a href={link}
        className={`inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none ${sizeClasses[variant]} ${styleClasses[Style]} ${className}`}
    >
        {children}
    </a>
)

}