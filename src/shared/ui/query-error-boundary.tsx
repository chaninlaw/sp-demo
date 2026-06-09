import { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class QueryErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  retry = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[200px]">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <div>
          <p className="font-semibold text-foreground">โหลดข้อมูลไม่สำเร็จ</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {error.message}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={this.retry}>
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          ลองใหม่
        </Button>
      </div>
    );
  }
}
