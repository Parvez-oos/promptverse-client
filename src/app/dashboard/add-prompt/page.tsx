'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSend, FiArrowLeft, FiUpload, FiEye, FiEdit3 } from 'react-icons/fi';
import { promptService } from '@/services/promptService';
import { uploadService } from '@/services/uploadService';
import RichTextEditor from '@/components/ui/RichTextEditor';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import toast from 'react-hot-toast';

const promptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  content: z.string().min(1, 'Prompt content is required'),
  category: z.string().min(1, 'Category is required'),
  aiTool: z.string().min(1, 'AI tool is required'),
  tags: z.string(),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Pro']),
  visibility: z.enum(['public', 'private']),
});

type PromptForm = z.infer<typeof promptSchema>;

export default function AddPromptPage() {
  const [uploading, setUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: FormData | Record<string, any>) => promptService.create(data),
    onSuccess: () => {
      toast.success('Prompt submitted for review!');
      router.push('/dashboard/my-prompts');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create prompt');
    },
  });

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      visibility: 'public',
      difficultyLevel: 'Beginner',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setThumbnail(url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: PromptForm) => {
    const promptData = {
      ...data,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      thumbnail,
    };
    mutation.mutate(promptData);
  };

  const contentValue = watch('content');
  const titleValue = watch('title');
  const descriptionValue = watch('description');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    >
      <button onClick={() => router.back()} className="btn btn-ghost btn-sm rounded-lg gap-1.5 mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-1">Add New Prompt</h1>
        <p className="text-sm text-base-content/50 mb-6">Create a new prompt to share with the community.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 border border-base-300 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Prompt Title</label>
              <input {...register('title')} placeholder="Enter a descriptive title" className="input input-bordered w-full rounded-xl text-sm" />
              {errors.title && <p className="text-xs text-error mt-1">{errors.title.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <textarea {...register('description')} placeholder="Describe what this prompt does..." className="textarea textarea-bordered w-full rounded-xl text-sm" rows={3} />
              {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Prompt Content</label>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="btn btn-ghost btn-xs rounded-lg gap-1.5"
                >
                  {preview ? (
                    <><FiEdit3 className="w-3.5 h-3.5" /> Edit</>
                  ) : (
                    <><FiEye className="w-3.5 h-3.5" /> Preview</>
                  )}
                </button>
              </div>
              {preview ? (
                <div className="min-h-[200px] p-4 bg-base-200/50 rounded-xl border border-base-300">
                  {contentValue ? (
                    <MarkdownRenderer content={contentValue} />
                  ) : (
                    <p className="text-base-content/40 text-sm">Nothing to preview</p>
                  )}
                </div>
              ) : (
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write or paste your prompt content here... Supports markdown!"
                      height="300px"
                    />
                  )}
                />
              )}
              {errors.content && <p className="text-xs text-error mt-1">{errors.content.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <select {...register('category')} className="select select-bordered w-full rounded-xl text-sm">
                <option value="">Select category</option>
                <option value="Writing">Writing</option>
                <option value="Coding">Coding</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Creative">Creative</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-xs text-error mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">AI Tool</label>
              <select {...register('aiTool')} className="select select-bordered w-full rounded-xl text-sm">
                <option value="">Select AI tool</option>
                <option value="ChatGPT">ChatGPT</option>
                <option value="Gemini">Gemini</option>
                <option value="Claude">Claude</option>
                <option value="Midjourney">Midjourney</option>
                <option value="DALL-E">DALL-E</option>
                <option value="Stable Diffusion">Stable Diffusion</option>
                <option value="Copilot">Copilot</option>
                <option value="Other">Other</option>
              </select>
              {errors.aiTool && <p className="text-xs text-error mt-1">{errors.aiTool.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Difficulty Level</label>
              <select {...register('difficultyLevel')} className="select select-bordered w-full rounded-xl text-sm">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Pro">Pro</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Visibility</label>
              <select {...register('visibility')} className="select select-bordered w-full rounded-xl text-sm">
                <option value="public">Public</option>
                <option value="private">Private (Premium)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Tags (comma separated)</label>
              <input {...register('tags')} placeholder="e.g., copywriting, marketing, seo" className="input input-bordered w-full rounded-xl text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Thumbnail Image</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered file-input-sm w-full rounded-xl text-sm" />
                {uploading && <span className="loading loading-spinner loading-sm" />}
              </div>
              {thumbnail && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2"
                >
                  <img src={thumbnail} alt="Thumbnail" className="w-20 h-20 rounded-lg object-cover" />
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => router.back()} className="btn btn-ghost rounded-xl">
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary rounded-xl gap-2"
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <><FiSend className="w-4 h-4" /> Submit for Review</>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
