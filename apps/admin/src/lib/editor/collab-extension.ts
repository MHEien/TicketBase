import { createCollabExtension } from '@rekajs/collaboration';

import { getCollaborativeYjsType } from './utils';

export const CollabExtension = createCollabExtension(getCollaborativeYjsType());