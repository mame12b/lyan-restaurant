import React from 'react';
import { motion } from 'framer-motion';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <motion.div ref={ref} {...props} />;
});

export default Transition;
