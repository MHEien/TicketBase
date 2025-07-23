import { motion } from 'framer-motion';
import * as React from 'react';

import { useEditor } from '@/lib/use-editor';
import { User } from '@/components/editor/editor';
import { cn } from '@/lib/utils';

const getInitials = (name: string) => {
  const [first, last] = name.split(' ');
  return first[0] + last[0];
};

type UserAvatarProps = {
  user: User;
};

export const UserAvatar = React.forwardRef<HTMLSpanElement, UserAvatarProps>(
  (props, ref) => {
    const editor = useEditor();

    const isActive = editor.user.id === props.user.id;
    return (
      <motion.span
        className={cn(
          'w-7 h-7 bg-transparent rounded-full text-[0.6rem] text-white font-medium flex flex-col justify-center text-center border border-solid border-transparent relative cursor-pointer',
          {
            'border-primary-400 shadow-md shadow-primary/20': isActive,
          }
        )}
        style={{ backgroundColor: props.user.color }}
        ref={ref}
      >
        <div className="absolute left-0 top-0 w-full h-full bg-black/20 rounded-full" />
        <b className="relative font-bold z-1 font-medium relative text-white leading-[1.2rem]">
          {getInitials(props.user.name)}
        </b>
      </motion.span>
    );
  }
);