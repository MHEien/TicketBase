import { jsToYType } from '@rekajs/collaboration';
import { Reka } from '@rekajs/core';
import * as t from '@rekajs/types';

import * as Y from 'yjs';
import fs from 'fs';

import { DUMMY_PROGRAM } from './constants';
import { Y_ROOT_DOCUMENT } from './constants';
import { createSharedStateGlobals } from './constants';

const doc = new Y.Doc();

const type = doc.getMap(Y_ROOT_DOCUMENT);

const reka = Reka.create({
  ...createSharedStateGlobals(),
});

reka.load(
  t.state({
    program: DUMMY_PROGRAM,
    extensions: {},
  })
);

const flattenState = t.flatten(reka.state);

const { converted } = jsToYType(flattenState);

type.set('document', converted);

const update = Y.encodeStateAsUpdate(doc);

const encoded = Buffer.from(update).toString('base64');

fs.writeFileSync(
  './constants/encoded-dummy-program.ts',
  `export const ENCODED_DUMMY_PROGRAM = '${encoded}';`
);