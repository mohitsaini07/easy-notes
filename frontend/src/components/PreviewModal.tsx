import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { getFileUrl } from '../api/axios';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: any;
  onDownload: (note: any) => void;
}

export const PreviewModal = ({ isOpen, onClose, note, onDownload }: PreviewModalProps) => {
  if (!note) return null;

  const fileUrl = getFileUrl(note.fileUrl);
  const isPDF = note.fileUrl.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(note.fileUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl h-[80vh] bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black line-clamp-1">{note.title}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{note.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownload(note)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content / Preview Area */}
            <div className="flex-1 bg-secondary/20 relative overflow-hidden flex items-center justify-center">
              {isPDF ? (
                <iframe 
                  src={`${fileUrl}#toolbar=0`} 
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              ) : isImage ? (
                <img 
                  src={fileUrl} 
                  alt={note.title} 
                  className="max-w-full max-h-full object-contain shadow-lg"
                />
              ) : (
                <div className="text-center p-12">
                  <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">No Preview Available</h4>
                  <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
                    This file format cannot be previewed in the browser. Please download it to view the content.
                  </p>
                  <button
                    onClick={() => onDownload(note)}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold inline-flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download to View
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer (Optional Details) */}
            <div className="p-6 bg-card border-t border-border flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{note.description}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                <span>{note.views || 0} Views</span>
                <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
                <span>{note.downloads || 0} Downloads</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
