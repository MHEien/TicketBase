import type { Config } from '@measured/puck'

// Import components from storefront (we'll create lightweight versions for admin)
import { Hero } from './components/Hero'
import { EventGrid } from './components/EventGrid'
import { EventCarousel } from './components/EventCarousel'
import { AdvancedEventGrid } from './components/AdvancedEventGrid'
import { FeaturedEvents } from './components/FeaturedEvents'
import { NewsletterSignup } from './components/NewsletterSignup'
import { TextBlock } from './components/TextBlock'
import { ImageBlock } from './components/ImageBlock'
import { ButtonBlock } from './components/ButtonBlock'
import { StatsBlock } from './components/StatsBlock'
import { TestimonialsBlock } from './components/TestimonialsBlock'
import { CTABlock } from './components/CTABlock'

type Components = {
  Hero: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    showCTA: boolean;
    ctaText: string;
    ctaLink: string;
  };
  EventGrid: {
    title: string;
    subtitle?: string;
    limit: number;
    showFeatured: boolean;
    category?: string;
  };
  EventCarousel: {
    title: string;
    subtitle?: string;
    autoPlay: boolean;
    showDots: boolean;
    showArrows: boolean;
    slideInterval: number;
  };
  AdvancedEventGrid: {
    title: string;
    subtitle?: string;
    showFilters: boolean;
    showSearch: boolean;
    defaultCategory: string;
    showFeaturedFirst: boolean;
    itemsPerPage: number;
    showSoldOut: boolean;
  };
  FeaturedEvents: {
    title: string;
    subtitle?: string;
    layout: 'grid' | 'carousel' | 'list';
    showRatings: boolean;
    showAttendeeCount: boolean;
    maxEvents: number;
  };
  NewsletterSignup: {
    title: string;
    subtitle?: string;
    placeholder: string;
    buttonText: string;
    backgroundColor: string;
    showBenefits: boolean;
    benefits: string[];
  };
  TextBlock: {
    text: string;
    alignment: 'left' | 'center' | 'right';
    size: 'sm' | 'md' | 'lg';
  };
  ImageBlock: {
    src: string;
    alt: string;
    caption?: string;
    size: 'sm' | 'md' | 'lg' | 'full';
  };
  ButtonBlock: {
    text: string;
    link: string;
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size: 'default' | 'sm' | 'lg' | 'icon';
    fullWidth: boolean;
  };
  StatsBlock: {
    stats: Array<{
      label: string;
      value: string;
      description?: string;
    }>;
  };
  TestimonialsBlock: {
    testimonials: Array<{
      name: string;
      role: string;
      content: string;
      avatar?: string;
    }>;
  };
  CTABlock: {
    title: string;
    subtitle?: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
  };
};

export const config: Config<Components> = {
  categories: {
    layout: {
      components: ['Hero', 'TextBlock', 'ImageBlock', 'ButtonBlock'],
    },
    events: {
      components: ['EventGrid', 'EventCarousel', 'AdvancedEventGrid', 'FeaturedEvents'],
    },
    engagement: {
      components: ['NewsletterSignup', 'TestimonialsBlock', 'CTABlock', 'StatsBlock'],
    },
  },
  components: {
    Hero: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        backgroundImage: { type: 'text' },
        showCTA: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        ctaText: { type: 'text' },
        ctaLink: { type: 'text' },
      },
      defaultProps: {
        title: 'Welcome to Our Events',
        subtitle: 'Discover amazing events and experiences',
        showCTA: true,
        ctaText: 'Browse Events',
        ctaLink: '/events',
      },
      render: Hero,
    },

    EventGrid: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        limit: { type: 'number' },
        showFeatured: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        category: { type: 'text' },
      },
      defaultProps: {
        title: 'Upcoming Events',
        limit: 6,
        showFeatured: true,
      },
      render: EventGrid,
    },
    EventCarousel: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        autoPlay: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        showDots: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        showArrows: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        slideInterval: { type: 'number' },
      },
      defaultProps: {
        title: 'Featured Events',
        subtitle: 'Don\'t miss these amazing upcoming events',
        autoPlay: true,
        showDots: true,
        showArrows: true,
        slideInterval: 5,
      },
      render: EventCarousel,
    },
    AdvancedEventGrid: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        showFilters: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        showSearch: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        defaultCategory: {
          type: 'select',
          options: [
            { label: 'All Categories', value: 'all' },
            { label: 'Music', value: 'music' },
            { label: 'Conference', value: 'conference' },
            { label: 'Food', value: 'food' },
            { label: 'Entertainment', value: 'entertainment' },
            { label: 'Arts', value: 'arts' },
          ],
        },
        showFeaturedFirst: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        itemsPerPage: { type: 'number' },
        showSoldOut: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
      },
      defaultProps: {
        title: 'All Events',
        subtitle: 'Find the perfect event for you',
        showFilters: true,
        showSearch: true,
        defaultCategory: 'all',
        showFeaturedFirst: true,
        itemsPerPage: 9,
        showSoldOut: false,
      },
      render: AdvancedEventGrid,
    },
    FeaturedEvents: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        layout: {
          type: 'select',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'Carousel', value: 'carousel' },
            { label: 'List', value: 'list' },
          ],
        },
        showRatings: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        showAttendeeCount: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        maxEvents: { type: 'number' },
      },
      defaultProps: {
        title: 'Featured Events',
        subtitle: 'Hand-picked events you won\'t want to miss',
        layout: 'grid',
        showRatings: true,
        showAttendeeCount: true,
        maxEvents: 3,
      },
      render: FeaturedEvents,
    },
    NewsletterSignup: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        placeholder: { type: 'text' },
        buttonText: { type: 'text' },
        backgroundColor: { type: 'text' },
        showBenefits: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
        benefits: { type: 'textarea' },
      },
      defaultProps: {
        title: 'Stay in the Loop',
        subtitle: 'Get notified about the latest events and exclusive offers',
        placeholder: 'Enter your email address',
        buttonText: 'Subscribe Now',
        backgroundColor: '#3B82F6',
        showBenefits: true,
        benefits: ['Early access to tickets', 'Exclusive discounts', 'Event recommendations'],
      },
      render: NewsletterSignup,
    },

    TextBlock: {
      fields: {
        text: { type: 'textarea' },
        alignment: {
          type: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        size: {
          type: 'select',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
      },
      defaultProps: {
        text: 'Add your text content here...',
        alignment: 'left',
        size: 'md',
      },
      render: TextBlock,
    },
    ImageBlock: {
      fields: {
        src: { type: 'text' },
        alt: { type: 'text' },
        caption: { type: 'text' },
        size: {
          type: 'select',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Full Width', value: 'full' },
          ],
        },
      },
      defaultProps: {
        src: 'https://via.placeholder.com/600x400',
        alt: 'Placeholder image',
        size: 'md',
      },
      render: ImageBlock,
    },
    ButtonBlock: {
      fields: {
        text: { type: 'text' },
        link: { type: 'text' },
        variant: {
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Destructive', value: 'destructive' },
            { label: 'Outline', value: 'outline' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Link', value: 'link' },
          ],
        },
        size: {
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Small', value: 'sm' },
            { label: 'Large', value: 'lg' },
            { label: 'Icon', value: 'icon' },
          ],
        },
        fullWidth: { type: 'radio', options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }
        ]},
      },
      defaultProps: {
        text: 'Click me',
        link: '#',
        variant: 'default',
        size: 'default',
        fullWidth: false,
      },
      render: ButtonBlock,
    },
    StatsBlock: {
      fields: {
        stats: {
          type: 'array',
          arrayFields: {
            label: { type: 'text' },
            value: { type: 'text' },
            description: { type: 'text' },
          },
        },
      },
      defaultProps: {
        stats: [
          { label: 'Events Hosted', value: '500+', description: 'Successful events' },
          { label: 'Happy Customers', value: '10K+', description: 'Satisfied attendees' },
          { label: 'Years Experience', value: '5+', description: 'In the industry' },
        ],
      },
      render: StatsBlock,
    },
    TestimonialsBlock: {
      fields: {
        testimonials: {
          type: 'array',
          arrayFields: {
            name: { type: 'text' },
            role: { type: 'text' },
            content: { type: 'textarea' },
            avatar: { type: 'text' },
          },
        },
      },
      defaultProps: {
        testimonials: [
          {
            name: 'Sarah Johnson',
            role: 'Event Organizer',
            content: 'This platform made organizing our conference so much easier!',
            avatar: 'https://via.placeholder.com/64x64',
          },
        ],
      },
      render: TestimonialsBlock,
    },
    CTABlock: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        buttonText: { type: 'text' },
        buttonLink: { type: 'text' },
        backgroundColor: { type: 'text' },
      },
      defaultProps: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of event organizers who trust our platform',
        buttonText: 'Get Started',
        buttonLink: '#',
        backgroundColor: '#3B82F6',
      },
      render: CTABlock,
    },
  },
};