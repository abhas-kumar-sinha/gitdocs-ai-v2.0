import Loader from "@/components/kokonutui/loader";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    size?: "sm" | "md" | "lg";
}

const LoadingScreen = ({
    title = "Configuring your account...",
    subtitle = "Please wait while we prepare everything for you",
    size = "md",
    className,
    ...props
}: LoaderProps) => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader title={title} subtitle={subtitle} size={size} className={className} {...props} />
    </div>
  )
}
export default LoadingScreen