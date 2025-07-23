import { getRandomId, invariant } from '@rekajs/utils';
import * as Y from 'yjs';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import { ENCODED_DUMMY_PROGRAM, Y_ROOT_DOCUMENT } from './constants';

const doc = new Y.Doc();
const type = doc.getMap<{ document: any }>(Y_ROOT_DOCUMENT);

// Browser-compatible base64 decoding
const base64String = ENCODED_DUMMY_PROGRAM;
const binaryString = atob(base64String);
const bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}

Y.applyUpdate(doc, bytes);

export const getCollaborativeYjsDocument = () => {
  return doc;
};

export const CREATE_BEZIER_TRANSITION = (
  opts: Partial<{ duration: number; delay: number }> = {
    duration: 0.4,
    delay: 0,
  }
): any => ({
  ease: [0.19, 1, 0.22, 1],
  duration: opts.duration,
  delay: opts.delay,
});

export const generateRandomName = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: ' ',
    style: 'capital',
  });

export const getCollaborativeYjsType = () => {
  return type;
};

export const getCollaborativeYjsRekaState = () => {
  const document = type.get('document');

  invariant(
    document && document instanceof Y.Map,
    'Collaborative document not found!'
  );

  return document;
};

/**
 * Get room name to join via WebRTC
 * Note: Generating a random room id for each machine to prevent the demo on the production site to be altered
 */
export const getCollabRoomId = () => {
  const RANDOM_ROOM_ID_LOCALSTORAGE_KEY = 'rekajs-site-random-room-id';

  let randomRoomId = localStorage.getItem(RANDOM_ROOM_ID_LOCALSTORAGE_KEY);

  if (!randomRoomId) {
    randomRoomId = getRandomId();
    localStorage.setItem(RANDOM_ROOM_ID_LOCALSTORAGE_KEY, randomRoomId);
  }

  return `reka-yjs-test-${randomRoomId}`;
};

type AnimationSequence = [() => void, number?];

export const requestAnimationSequence = (sequences: AnimationSequence[]) => {
  let current = sequences.shift();
  let prevTimestamp = 0;

  const animate = (timestamp: number) => {
    if (!current) {
      return;
    }

    const [fn, delay] = current;

    if (!prevTimestamp) {
      prevTimestamp = timestamp;
    }
    if (!delay || timestamp - prevTimestamp >= delay) {
      fn();
      prevTimestamp = timestamp;
      current = sequences.shift();
    }

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
};