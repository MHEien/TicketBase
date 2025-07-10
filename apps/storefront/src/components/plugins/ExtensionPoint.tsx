import React, { useMemo } from 'react';
import { usePlugins } from '../../contexts/PluginContext';

interface ExtensionPointProps {
  name: string;
  context?: any;
  fallback?: React.ReactNode;
  className?: string;
  maxComponents?: number;
  filter?: (component: React.ComponentType<any>) => boolean;
  children?: (components: React.ComponentType<any>[]) => React.ReactNode;
}

export const ExtensionPoint: React.FC<ExtensionPointProps> = ({
  name,
  context,
  fallback,
  className,
  maxComponents,
  filter,
  children,
}) => {
  const { executeExtensionPoint, loading } = usePlugins();

  const components = useMemo(() => {
    let comps = executeExtensionPoint(name, context);
    
    // Apply filter if provided
    if (filter) {
      comps = comps.filter(filter);
    }
    
    // Limit number of components if specified
    if (maxComponents) {
      comps = comps.slice(0, maxComponents);
    }
    
    return comps;
  }, [name, context, executeExtensionPoint, filter, maxComponents]);

  if (loading) {
    return (
      <div className={className}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (components.length === 0) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  // If children render prop is provided, use it
  if (children) {
    return <div className={className}>{children(components)}</div>;
  }

  // Default rendering: render all components
  return (
    <div className={className}>
      {components.map((Component, index) => (
        <div key={index} data-plugin-extension={name}>
          <Component context={context} />
        </div>
      ))}
    </div>
  );
};

// Specialized extension point components for common use cases

export const PaymentMethods: React.FC<{
  context?: any;
  onMethodSelect?: (method: string) => void;
  className?: string;
}> = ({ context, onMethodSelect, className }) => {
  const { getPaymentMethods } = usePlugins();
  
  const paymentMethods = useMemo(() => getPaymentMethods(), [getPaymentMethods]);

  if (paymentMethods.length === 0) {
    return (
      <div className={className}>
        <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-gray-500 mb-2">No payment methods available</div>
          <div className="text-sm text-gray-400">
            Contact support to enable payment processing
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {paymentMethods.map((PaymentMethod, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <PaymentMethod 
            context={context}
            onSelect={onMethodSelect}
          />
        </div>
      ))}
    </div>
  );
};

export const CheckoutExtensions: React.FC<{
  context?: any;
  position?: 'before-payment' | 'after-payment' | 'before-submit' | 'after-submit';
  className?: string;
}> = ({ context, position = 'before-payment', className }) => {
  return (
    <ExtensionPoint
      name="checkout-extensions"
      context={{ ...context, position }}
      className={className}
      filter={(component: any) => {
        // Filter components by position if they specify one
        return !component.position || component.position === position;
      }}
    />
  );
};

export const EventDetailExtensions: React.FC<{
  event: any;
  context?: any;
  className?: string;
}> = ({ event, context, className }) => {
  return (
    <ExtensionPoint
      name="event-detail-extensions"
      context={{ ...context, event }}
      className={className}
    />
  );
};

export const SearchExtensions: React.FC<{
  query: string;
  results: any[];
  context?: any;
  className?: string;
}> = ({ query, results, context, className }) => {
  return (
    <ExtensionPoint
      name="search-extensions"
      context={{ ...context, query, results }}
      className={className}
    />
  );
};

export const AnalyticsExtensions: React.FC<{
  event: string;
  data: any;
  context?: any;
}> = ({ event, data, context }) => {
  return (
    <ExtensionPoint
      name="analytics-extensions"
      context={{ ...context, event, data }}
    />
  );
}; 