import React, { useState, useEffect } from 'react';
import { 
  definePlugin, 
  createPuckWidget, 
  createExtensionPoint,
  usePlatformSDK,
  registerPuckComponents,
  type PluginDefinition,
  type PuckWidgetDefinition 
} from 'ticketsplatform-plugin-sdk';
import { motion } from 'framer-motion';

// =============================================================================
// COUNTDOWN WIDGET COMPONENT
// =============================================================================

interface CountdownProps {
  title: string;
  targetDate: string;
  description: string;
  showSeconds: boolean;
  animation: 'fadeIn' | 'slideUp' | 'scale' | 'bounce' | 'none';
  styling: {
    blur: string;
    opacity: string;
    borderStyle: string;
  };
  spacing: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  textColor: string;
  accentColor: string;
  className: string;
}

const CountdownWidget: React.FC<CountdownProps> = ({
  title,
  targetDate,
  description,
  showSeconds,
  animation,
  styling,
  spacing,
  textColor,
  accentColor,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.8 },
    },
    slideUp: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.8 },
    },
    scale: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.8 },
    },
    bounce: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
    none: {
      initial: {},
      animate: {},
      transition: {},
    },
  };

  const animationProps = animations[animation];

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    ...(showSeconds ? [{ label: 'Seconds', value: timeLeft.seconds }] : []),
  ];

  const paddingStyle = {
    paddingTop: spacing.top,
    paddingRight: spacing.right,
    paddingBottom: spacing.bottom,
    paddingLeft: spacing.left,
  };

  return (
    <motion.div
      className={`${className} ${styling.blur} ${styling.opacity} border ${styling.borderStyle} rounded-2xl shadow-xl`}
      style={{ ...paddingStyle, color: textColor }}
      {...animationProps}
    >
      <div className="text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          style={{ color: textColor }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        
        {description && (
          <motion.p
            className="text-lg opacity-90 mb-6"
            style={{ color: textColor }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {description}
          </motion.p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index + 0.6, type: "spring" }}
            >
              <div
                className="text-4xl md:text-5xl font-bold rounded-lg p-4 mb-2"
                style={{ backgroundColor: accentColor, color: 'white' }}
              >
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-sm uppercase tracking-wider opacity-80" style={{ color: textColor }}>
                {unit.label}
              </div>
            </motion.div>
          ))}
        </div>

        {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
          <motion.div
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: accentColor, color: 'white' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <h3 className="text-xl font-bold">Time's Up!</h3>
            <p>The countdown has reached zero.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// =============================================================================
// PUCK WIDGET DEFINITION
// =============================================================================

const countdownWidgetDefinition: PuckWidgetDefinition = createPuckWidget({
  id: 'countdown-widget',
  label: 'Event Countdown',
  category: 'Event Widgets',
  defaultProps: {
    title: 'Event Starts In',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    description: 'Get ready for an amazing experience!',
    showSeconds: true,
    textColor: '#ffffff',
    accentColor: '#3B82F6',
  },
  fields: {
    title: {
      type: 'text',
      label: 'Countdown Title',
    },
    targetDate: {
      type: 'text',
      label: 'Target Date (ISO format)',
    },
    description: {
      type: 'textarea',
      label: 'Description',
    },
    showSeconds: {
      type: 'select',
      label: 'Show Seconds',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    textColor: {
      type: 'text',
      label: 'Text Color (hex)',
    },
    accentColor: {
      type: 'text',
      label: 'Accent Color (hex)',
    },
  },
  render: CountdownWidget,
});

// =============================================================================
// ADMIN SETTINGS COMPONENT
// =============================================================================

const AdminSettings = createExtensionPoint(({ context, sdk }) => {
  const { config, saveConfig, loading } = sdk.hooks.usePluginConfig('countdown-widget');
  const [settings, setSettings] = sdk.hooks.useState(config || {
    defaultDuration: 7,
    allowSecondsToggle: true,
    defaultColors: {
      text: '#ffffff',
      accent: '#3B82F6',
    },
  });

  const handleSave = async () => {
    try {
      await saveConfig(settings);
      sdk.utils.toast({
        title: 'Settings saved',
        description: 'Countdown widget settings have been updated.',
        variant: 'success',
      });
    } catch (error) {
      sdk.utils.toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <sdk.components.Card>
      <sdk.components.CardHeader>
        <sdk.components.CardTitle>Countdown Widget Settings</sdk.components.CardTitle>
        <sdk.components.CardDescription>
          Configure default settings for countdown widgets.
        </sdk.components.CardDescription>
      </sdk.components.CardHeader>
      <sdk.components.CardContent className="space-y-4">
        <div>
          <sdk.components.Label htmlFor="defaultDuration">
            Default Duration (days)
          </sdk.components.Label>
          <sdk.components.Input
            id="defaultDuration"
            type="number"
            value={settings.defaultDuration}
            onChange={(e) => setSettings({
              ...settings,
              defaultDuration: parseInt(e.target.value) || 7,
            })}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <sdk.components.Switch
            id="allowSecondsToggle"
            checked={settings.allowSecondsToggle}
            onCheckedChange={(checked) => setSettings({
              ...settings,
              allowSecondsToggle: checked,
            })}
          />
          <sdk.components.Label htmlFor="allowSecondsToggle">
            Allow seconds display toggle
          </sdk.components.Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <sdk.components.Label htmlFor="defaultTextColor">
              Default Text Color
            </sdk.components.Label>
            <sdk.components.Input
              id="defaultTextColor"
              value={settings.defaultColors?.text || '#ffffff'}
              onChange={(e) => setSettings({
                ...settings,
                defaultColors: {
                  ...settings.defaultColors,
                  text: e.target.value,
                },
              })}
            />
          </div>
          <div>
            <sdk.components.Label htmlFor="defaultAccentColor">
              Default Accent Color
            </sdk.components.Label>
            <sdk.components.Input
              id="defaultAccentColor"
              value={settings.defaultColors?.accent || '#3B82F6'}
              onChange={(e) => setSettings({
                ...settings,
                defaultColors: {
                  ...settings.defaultColors,
                  accent: e.target.value,
                },
              })}
            />
          </div>
        </div>

        <sdk.components.Button onClick={handleSave} className="w-full">
          Save Settings
        </sdk.components.Button>
      </sdk.components.CardContent>
    </sdk.components.Card>
  );
});

// =============================================================================
// PLUGIN DEFINITION
// =============================================================================

const plugin: PluginDefinition = definePlugin({
  metadata: {
    id: 'countdown-widget',
    name: 'Event Countdown Widget',
    version: '1.0.0',
    description: 'Beautiful countdown timer widget for events and promotions',
    author: 'TicketBase Team',
    category: 'layout',
    displayName: 'Countdown Timer',
    iconUrl: '⏰',
    requiredPermissions: [],
    priority: 1,
    // Register Puck components
    puckComponents: [countdownWidgetDefinition],
  },
  extensionPoints: {
    'admin-settings': AdminSettings,
  },
});

// Register Puck components when plugin loads
registerPuckComponents([countdownWidgetDefinition]);

export default plugin;