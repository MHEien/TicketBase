import { Render } from '@measured/puck';
import { config } from './config';

interface PageRendererProps {
  data: {
    content: any;
    root: any;
  };
}

export function PageRenderer({ data }: PageRendererProps) {
  return (
    <div className="min-h-screen">
      <Render config={config} data={data} />
    </div>
  );
}
