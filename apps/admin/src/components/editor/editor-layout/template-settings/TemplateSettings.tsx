import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useEditor } from '@/lib/use-editor';

import { ConditionalTemplateSettings } from './shared/ConditionalTemplateSettings';
import { EachTemplateSettings } from './shared/EachTemplateSettings';
import { PropTemplateSettings } from './shared/PropTemplateSettings';

type TemplateHeadingProps = {
  template: t.Template;
};

const TemplateHeading = (props: TemplateHeadingProps) => {
  let title: string;

  if (props.template instanceof t.ComponentTemplate) {
    title = props.template.component.name;
  } else if (props.template instanceof t.TagTemplate) {
    title = props.template.tag;
  } else if (props.template instanceof t.SlotTemplate) {
    title = 'Slot';
  } else {
    title = 'Template';
  }

  return (
    <div className="flex items-center flex-1">
      <div className="flex-1 text-sm">
        <span className="text-lg color-gray-800 w-full flex items-center mt-1 cursor-pointer">
          {title}
        </span>
      </div>
      <div className="text-xs bg-primary-100 text-primary inline-block w-auto px-3 py-1 rounded-full align-end">
        {props.template.type}
      </div>
    </div>
  );
};

const InternalTemplateSettings = (props: { template: t.Template }) => {
  return (
    <div>
      <div className="flex px-5 py-3 mt-4">
        <TemplateHeading template={props.template} />
      </div>
      <div className="mt-3">
        <EachTemplateSettings template={props.template} />
        <ConditionalTemplateSettings template={props.template} />
        <PropTemplateSettings template={props.template} />
      </div>
    </div>
  );
};

export const TemplateSettings = observer(() => {
  const editor = useEditor();

  const template = editor.activeComponentEditor?.tplEvent.selected;

  if (!template) {
    return (
      <div className="px-8 py-4 flex flex-col justify-center items-center h-full text-center gap-2">
        <span className="text-gray-500 text-xs leading-5 max-w-[250px]">
          Click on an element on the screen to start editing a template.
        </span>
      </div>
    );
  }

  return <InternalTemplateSettings key={template.id} template={template} />;
});
