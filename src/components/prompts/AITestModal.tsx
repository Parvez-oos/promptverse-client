'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlay, FiCpu, FiAlertCircle } from 'react-icons/fi';
import { aiService } from '@/services/promptService';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AITestModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptContent: string;
  aiTool: string;
}

export default function AITestModal({ isOpen, onClose, promptContent, aiTool }: AITestModalProps) {
  const [selectedTool, setSelectedTool] = useState(aiTool || 'ChatGPT');
  const [customInput, setCustomInput] = useState(promptContent);

  const testMutation = useMutation({
    mutationFn: () => aiService.testPrompt(customInput, selectedTool),
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-base-100 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiCpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Test Prompt</h3>
                  <p className="text-xs text-base-content/50">Run this prompt against an AI model</p>
                </div>
              </div>
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-square rounded-xl">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">AI Model</label>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="select select-bordered w-full rounded-xl text-sm"
                >
                  <option value="ChatGPT">ChatGPT (GPT-4o-mini)</option>
                  <option value="Gemini">Gemini (Gemini 2.0 Flash)</option>
                  <option value="Claude">Claude (Claude 3 Haiku)</option>
                  <option value="Copilot">Copilot (GPT-4o-mini)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Prompt Input</label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-xl text-sm font-mono"
                  rows={6}
                  placeholder="Enter your prompt..."
                />
              </div>

              <button
                onClick={() => testMutation.mutate()}
                disabled={testMutation.isPending || !customInput.trim()}
                className="btn btn-primary rounded-xl gap-2 w-full"
              >
                {testMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <><FiPlay className="w-4 h-4" /> Run Test</>
                )}
              </button>

              {testMutation.isError && (
                <div className="flex items-start gap-2 p-4 bg-error/10 rounded-xl text-error text-sm">
                  <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{(testMutation.error as any)?.response?.data?.message || 'Failed to test prompt. API key may not be configured.'}</span>
                </div>
              )}

              {testMutation.data?.data?.content && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-primary/20 rounded-xl overflow-hidden"
                >
                  <div className="bg-primary/5 px-4 py-2.5 border-b border-primary/20 flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">AI Response ({selectedTool})</span>
                    <span className="text-[10px] text-base-content/40">{testMutation.data.data.model}</span>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto">
                    <MarkdownRenderer content={testMutation.data.data.content} />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
