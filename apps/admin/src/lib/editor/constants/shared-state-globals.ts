import { RekaOpts } from '@rekajs/core';
import * as t from '@rekajs/types';

import { CommentExtension } from '@/lib/editor/comment-extension';
import { CollabExtension } from '@/lib/editor/collab-extension';
import { UserFrameExtension } from '@/lib/editor/user-frame-extension';

export const createSharedStateGlobals = (
  config: Partial<RekaOpts> = {}
): RekaOpts => ({
  extensions: [
    ...(config.extensions || []),
    UserFrameExtension,
    CommentExtension,
  ],
  externals: {
    components: [...(config.externals?.components ?? [])],
    states: [
      t.externalState({
        name: 'myString',
        init: 'Hello from External Variable',
      }),
      t.externalState({
        name: 'posts',
        init: [
          {
            name: 'Interesting Post',
            image: '/images/pawel-olek-1.png',
            description:
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco',
          },
          {
            name: 'Hello World',
            image: '/images/pawel-olek-2.png',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          },
        ],
      }),
      ...(config.externals?.states ?? []),
    ],
    functions: config.externals?.functions,
  },
});