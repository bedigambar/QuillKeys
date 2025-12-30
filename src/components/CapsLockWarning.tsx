import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface CapsLockWarningProps {
  isVisible: boolean;
}

const CapsLockWarning = ({ isVisible }: CapsLockWarningProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-yellow-950 rounded-lg shadow-lg border border-yellow-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Caps Lock is ON</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CapsLockWarning;
