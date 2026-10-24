import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Folder, File, Trash2, Plus, CheckCircle2, X } from 'lucide-react';
import { Container, Section, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';
import { Button } from '../../../portfolio/src/components/ui/Button';

interface MediaItem {
  id: string;
  filename: string;
  size: string;
  type: string;
  folder: string;
  date: string;
  previewUrl?: string;
}

const defaultMediaFiles: MediaItem[] = [
  { id: '1', filename: 'desktop-buddy-render.webp', size: '142 KB', type: 'image/webp', folder: 'Projects', date: '2 days ago' },
  { id: '2', filename: 'system-diagram-mesh.png', size: '89 KB', type: 'image/png', folder: 'Projects', date: '4 days ago' },
  { id: '3', filename: 'resume_v1.0.pdf', size: '310 KB', type: 'application/pdf', folder: 'Resume', date: '1 week ago' }
];

export const MediaCMS: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [activeFolder, setActiveFolder] = useState('Projects');
  const [folders, setFolders] = useState<string[]>(() => {
    const saved = localStorage.getItem('adithyan_cms_media_folders');
    return saved ? JSON.parse(saved) : ['Projects', 'Research', 'Profile', 'Resume', 'Certificates'];
  });

  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('adithyan_cms_media_files');
    return saved ? JSON.parse(saved) : defaultMediaFiles;
  });

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('adithyan_cms_media_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('adithyan_cms_media_files', JSON.stringify(mediaFiles));
  }, [mediaFiles]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleProcessFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newItems: MediaItem[] = Array.from(fileList).map((f) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      filename: f.name,
      size: formatFileSize(f.size),
      type: f.type || 'application/octet-stream',
      folder: activeFolder,
      date: 'Just now',
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
    }));

    setMediaFiles((prev) => [...newItems, ...prev]);
    showNotification(`Uploaded ${newItems.length} file(s) into ${activeFolder}.`);
  };

  const handleDeleteFile = (id: string) => {
    setMediaFiles((prev) => prev.filter((item) => item.id !== id));
    showNotification('File removed from registry.');
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed || folders.includes(trimmed)) return;

    setFolders((prev) => [...prev, trimmed]);
    setActiveFolder(trimmed);
    setNewFolderName('');
    setIsFolderModalOpen(false);
    showNotification(`Folder "${trimmed}" created.`);
  };

  return (
    <Section className="!py-12">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header row */}
          <motion.div variants={fadeUp} className="flex items-center justify-between border-b border-neutral-border/30 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
                Static Assets Registry
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
                Media Library
              </h1>
            </div>
            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="inline-flex items-center justify-center font-sans font-medium text-[10px] tracking-widest uppercase bg-primary text-bg px-5 py-2.5 rounded-[20px] border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <Plus size={14} className="mr-1.5" /> New Folder
            </button>
          </motion.div>

          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-surface border border-accent/40 text-primary text-xs rounded-[12px] flex items-center gap-2"
            >
              <CheckCircle2 size={14} className="text-accent" />
              <span>{notification}</span>
            </motion.div>
          )}

          <Grid cols="1-2" gap="xl">
            {/* Left: Folder listings and upload zone */}
            <Stack spacing="lg">
              {/* Folders List */}
              <div className="bg-surface border border-neutral-border p-6 rounded-[20px] shadow-premium">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-secondary opacity-60 font-semibold">
                    Asset Folders
                  </h3>
                  <button
                    onClick={() => setIsFolderModalOpen(true)}
                    className="text-[10px] text-accent hover:underline uppercase tracking-wider focus:outline-none cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <Stack spacing="xs">
                  {folders.map((folder) => (
                    <button
                      key={folder}
                      onClick={() => setActiveFolder(folder)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                        activeFolder === folder
                          ? 'bg-accent/10 border border-accent/20 text-accent'
                          : 'text-secondary hover:bg-neutral-border/30 hover:text-primary border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Folder size={14} /> {folder}
                      </span>
                      <span className="text-[10px] font-mono opacity-50">
                        {mediaFiles.filter((f) => f.folder === folder).length}
                      </span>
                    </button>
                  ))}
                </Stack>
              </div>

              {/* Upload Dropzone */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={(e) => handleProcessFiles(e.target.files)}
              />
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleProcessFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-[20px] p-8 text-center transition-colors duration-300 flex flex-col items-center justify-center cursor-pointer ${
                  dragActive
                    ? 'border-accent bg-accent/5'
                    : 'border-neutral-border hover:border-accent/40 bg-surface/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={32} className="text-secondary mb-3 opacity-60" />
                <h4 className="text-xs font-semibold text-primary">Drag & drop files here to upload</h4>
                <p className="text-[10px] text-secondary mt-1 max-w-xs leading-relaxed font-light">
                  Uploading directly into folder <span className="text-accent font-semibold">"{activeFolder}"</span>.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="text-[10px] font-semibold text-accent uppercase tracking-wider mt-4 hover:underline focus:outline-none cursor-pointer"
                >
                  Or select file from device
                </button>
              </div>
            </Stack>

            {/* Right: Files grid list inside active folder */}
            <div className="bg-surface border border-neutral-border p-6 rounded-[20px] shadow-premium space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-border/30 pb-3">
                <h3 className="text-xs uppercase tracking-[0.2em] text-secondary opacity-60 font-semibold">
                  Files inside <span className="text-primary">{activeFolder}</span>
                </h3>
                <span className="text-[10px] font-mono text-secondary">
                  {mediaFiles.filter((f) => f.folder === activeFolder).length} item(s)
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {mediaFiles
                  .filter((f) => f.folder === activeFolder)
                  .map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3.5 bg-bg border border-neutral-border rounded-[12px] hover:border-accent/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {file.previewUrl ? (
                          <img
                            src={file.previewUrl}
                            alt={file.filename}
                            className="w-9 h-9 rounded-[8px] object-cover border border-neutral-border"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-[8px] bg-surface border border-neutral-border flex items-center justify-center text-secondary shrink-0">
                            <File size={16} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-primary truncate max-w-xs">{file.filename}</h4>
                          <p className="text-[9px] text-secondary font-light mt-0.5">{file.size} &bull; {file.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-secondary/60 font-mono hidden sm:inline">{file.date}</span>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-secondary hover:text-red-400 p-1.5 transition-colors focus:outline-none cursor-pointer"
                          title="Delete File"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                {mediaFiles.filter((f) => f.folder === activeFolder).length === 0 && (
                  <div className="text-center py-16 text-secondary opacity-50 text-xs font-light">
                    No files found inside folder "{activeFolder}".<br />
                    Use the upload area on the left to add items.
                  </div>
                )}
              </div>
            </div>
          </Grid>
        </motion.div>
      </Container>

      {/* Modal for Creating New Folder */}
      <AnimatePresence>
        {isFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-surface border border-neutral-border rounded-[20px] shadow-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-border/40 pb-3">
                <h3 className="text-base font-semibold text-primary uppercase">
                  Create New Folder
                </h3>
                <button
                  onClick={() => setIsFolderModalOpen(false)}
                  className="p-1 text-secondary hover:text-primary rounded-lg transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-secondary">
                    Folder Name *
                  </label>
                  <input
                    required
                    autoFocus
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Schematics, Firmware"
                    className="w-full bg-bg border border-neutral-border focus:border-accent text-primary px-4 py-2.5 rounded-[12px] text-xs font-sans focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-border/40">
                  <button
                    type="button"
                    onClick={() => setIsFolderModalOpen(false)}
                    className="px-4 py-2 rounded-[20px] text-xs uppercase font-medium text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary">
                    Create Folder
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};
export default MediaCMS;
