import {Button, Result} from "antd";
import React, {Component, ErrorInfo, ReactNode} from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (<div className="flex h-screen w-screen items-center justify-center">
                <Result
                    status="500"
                    title="Oops, there is an error!"
                    extra={
                        <Button type="primary" key="console" onClick={() => {
                            window.location.reload()
                            this.setState({ hasError: false })
                        }
                        }>
                            Try Again
                        </Button>
                    }
                />

            </div>)
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
