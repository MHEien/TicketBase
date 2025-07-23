import { AlertTriangleIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import theme from '../theme';
import { useEditor } from '@/lib/use-editor';
import { EditorMode } from '@/components/editor/editor';
import { CREATE_BEZIER_TRANSITION } from '@/lib/editor/utils';
import { cn } from '@/lib/utils';

import { ComponentEditorView } from './ComponentEditorView';
import { ComponentList } from './ComponentList';
import { GlobalSettings } from './GlobalSettings';
import { ComponentSettings } from './component-settings';
import { TemplateSettings } from './template-settings';

import { AnimatedScreenSlider } from '@/components/editor/editor-layout/animated-screen-slider';
import { Carbonads } from './carbonads';
import { CodeEditor } from '@rekajs/react-code-editor';

export const EditorLayout = observer(
  (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  ) => {
    const editor = useEditor();

    const leftSidebarDomRef = React.useRef<HTMLDivElement | null>(null);
    const leftSidebarAnimate =
      (editor.mode === EditorMode.UI && !editor.compactSidebar) ||
      editor.compactSidebarVisible
        ? 'show'
        : 'hide';

    React.useEffect(() => {
      const { current: dom } = leftSidebarDomRef;

      if (!window || !dom) {
        return;
      }

      const onClickOutside = (e: MouseEvent) => {
        const target = e.target;

        if (target && target instanceof Element && dom.contains(target)) {
          return;
        }

        editor.showCompactSidebar(false);
      };

      window.addEventListener('click', onClickOutside);

      return () => {
        window.removeEventListener('click', onClickOutside);
      };
    }, [editor]);

    return (
      <React.Fragment>
        <div className="hidden max-sm:flex bg-white h-full text-slate-700 relative gap-3 flex-1 flex-col items-center justify-center text-center px-6">
          <AlertTriangleIcon width={25} height={25} />
          <h3 className="text-lg">
            Screen size is too small to use the editor.
          </h3>
        </div>
        <div
          {...props}
          className={cn(
            props.className,
            'flex max-sm:hidden overflow-hidden h-full relative flex-1'
          )}
        >
          <motion.div
            className={`overflow-x-hidden overflow-y-auto relative h-full flex flex-col border-r border-solid border-outline bg-white/80 backdrop-blur-md ml-0 w-editor-left-sidebar`}
            initial={false}
            animate={[
              leftSidebarAnimate,
              ...(editor.compactSidebar || editor.mode === EditorMode.Code
                ? ['compact']
                : ['standard']),
            ]}
            ref={leftSidebarDomRef}
            variants={{
              compact: {
                position: 'absolute',
                zIndex: '49',
              },
              standard: {
                position: 'relative',
              },
              hide: {
                marginLeft: 0 - theme.width['editor-left-sidebar'],
              },
              show: {
                marginLeft: 0,
              },
            }}
            transition={CREATE_BEZIER_TRANSITION({ delay: 0.2 })}
          >
            <div
              className="relative flex-1 h-full flex flex-col"
              style={{ minWidth: theme.width['editor-left-sidebar'] }}
            >
              <GlobalSettings />
              <AnimatedScreenSlider
                className="flex-1"
                goBackText="Components"
                active={'component-list'}
                onSetup={(getPath, goTo) => {
                  return autorun(() => {
                    const selectedTpl =
                      editor.activeComponentEditor?.tplEvent.selected;

                    const path = getPath();

                    if (path !== 'component-list') {
                      return;
                    }

                    if (!selectedTpl) {
                      return;
                    }

                    goTo('component-editor');
                  });
                }}
                screens={[
                  {
                    id: 'component-list',
                    render: (cb) => {
                      return (
                        <ComponentList
                          onComponentSelected={(component) => {
                            editor.setActiveComponentEditor(component);
                            cb.goTo('component-editor');
                          }}
                        />
                      );
                    },
                  },
                  {
                    id: 'component-editor',
                    render: () => {
                      return <ComponentSettings />;
                    },
                  },
                ]}
                after={(name) => (
                  <React.Fragment>
                    <Carbonads
                      className={cn(
                        'bg-white p-3 opacity-100 transition-ease',
                        {
                          'pointer-events-none opacity-0':
                            name !== 'component-list',
                        }
                      )}
                    />
                  </React.Fragment>
                )}
              />
            </div>
          </motion.div>
          <motion.div
            className="bg-white h-full transition flex-1"
            style={{
              width: `calc(100vw - ${
                theme.width['editor-left-sidebar'] +
                Math.max(
                  theme.width['editor-right-sidebar-code'],
                  theme.width['editor-right-sidebar-ui']
                )
              }px)`,
            }}
          >
            <ComponentEditorView />
          </motion.div>
          <motion.div
            className={`bg-white border-l border-solid border-outline overflow-hidden relative h-full w-editor-right-sidebar-ui`}
            initial={false}
            animate={editor.mode}
            variants={{
              ui: { width: theme.width['editor-right-sidebar-ui'] },
              code: { width: theme.width['editor-right-sidebar-code'] },
              preview: { width: 0 },
            }}
            transition={CREATE_BEZIER_TRANSITION({ delay: 0.2 })}
          >
            <AnimatePresence initial={false}>
              {editor.mode === EditorMode.Code && (
                <motion.div
                  className="absolute top-0 left-0 bg-white w-full h-full"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={{
                    show: {
                      opacity: 1,
                    },
                    hide: {
                      opacity: 0,
                    },
                  }}
                  transition={CREATE_BEZIER_TRANSITION()}
                >
                  <CodeEditor />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {editor.mode === EditorMode.UI && (
                <motion.div
                  className="overflow-auto absolute bg-white h-full flex flex-col top-0 right-0 w-editor-right-sidebar-ui"
                  initial="show"
                  animate="show"
                  exit="hide"
                  variants={{
                    show: {
                      opacity: 1,
                    },
                    hide: {
                      opacity: 0,
                    },
                  }}
                  transition={CREATE_BEZIER_TRANSITION()}
                >
                  <TemplateSettings />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </React.Fragment>
    );
  }
);
