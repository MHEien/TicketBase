import * as t from '@rekajs/types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { ExpressionInput } from '@/components/editor/expression-input';
import { SettingSection } from '@/components/editor/settings-section';
import { useEditor } from '@/lib/use-editor';

type ConditionalTemplateSettingsProps = {
  template: t.Template;
};

export const ConditionalTemplateSettings = observer(
  (props: ConditionalTemplateSettingsProps) => {
    const editor = useEditor();

    return (
      <SettingSection
        title={'Conditional'}
        info={'Render this template conditionally'}
        collapsedOnInitial={false}
      >
        <div>
          <ExpressionInput
            value={props.template.if}
            identifiables={editor.reka.getIdentifiablesAtNode(props.template, {
              filter: ({ identifiable }) => !t.is(identifiable, t.Component),
            })}
            placeholder="counter > 0"
            onCommit={(expression) => {
              editor.reka.change(() => {
                props.template.if = expression;
              });
            }}
            onCancel={() => {
              editor.reka.change(() => {
                props.template.if = null;
              });
            }}
          />
        </div>
      </SettingSection>
    );
  }
);
