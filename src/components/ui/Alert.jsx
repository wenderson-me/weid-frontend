import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../utils/cn"
import { AlertCircle, CheckCircle2, InfoIcon, XCircle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-slate-50 text-slate-950 border-slate-200",
        destructive: "bg-red-50 text-red-900 border-red-200 [&>svg]:text-red-900",
        success: "bg-green-50 text-green-900 border-green-200 [&>svg]:text-green-900",
        warning: "bg-amber-50 text-amber-900 border-amber-200 [&>svg]:text-amber-900",
        info: "bg-blue-50 text-blue-900 border-blue-200 [&>svg]:text-blue-900"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertSuccess = ({ title, children, className, ...props }) => (
  <Alert variant="success" className={className} {...props}>
    <CheckCircle2 className="h-4 w-4" />
    {title && <AlertTitle>{title}</AlertTitle>}
    <AlertDescription>{children}</AlertDescription>
  </Alert>
)

const AlertError = ({ title, children, className, ...props }) => (
  <Alert variant="destructive" className={className} {...props}>
    <XCircle className="h-4 w-4" />
    {title && <AlertTitle>{title}</AlertTitle>}
    <AlertDescription>{children}</AlertDescription>
  </Alert>
)

const AlertInfo = ({ title, children, className, ...props }) => (
  <Alert variant="info" className={className} {...props}>
    <InfoIcon className="h-4 w-4" />
    {title && <AlertTitle>{title}</AlertTitle>}
    <AlertDescription>{children}</AlertDescription>
  </Alert>
)

const AlertWarning = ({ title, children, className, ...props }) => (
  <Alert variant="warning" className={className} {...props}>
    <AlertCircle className="h-4 w-4" />
    {title && <AlertTitle>{title}</AlertTitle>}
    <AlertDescription>{children}</AlertDescription>
  </Alert>
)

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertSuccess,
  AlertError,
  AlertInfo,
  AlertWarning
}