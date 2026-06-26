'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSend, FiUpload, FiEye, FiEdit3 } from 'react-icons/fi';
import { promptService } from '@/services/promptService';
import { uploadService } from '@/services/uploadService';
import RichTextEditor from '@/components/ui/RichTextEditor';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import toast from 'react-hot-toast';

const promptSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  content: z.string().min(1),
  category: z.string().min(1),
  aiTool: z.string().min(1),
  tags: z.string(),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Pro']),
  visibility: z.enum(['public', 'private']),
});

type PromptForm = z.infer<typeof promptSchema>;

export default function CreatorAddPromptPage() {
  const [uploading, setUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: Record<string, any>) => promptService.create(data),
    onSuccess: () => {
      toast.success('Prompt submitted for review!');
      router.push('/creator-dashboard/my-prompts');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to create prompt'),
  });

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: { visibility: 'public', difficultyLevel: 'Beginner' },
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
    mutation.mutate({ ...data, tags: data.tags.split(',').map(t => t.trim()).filter(Boolean), thumbnail });
  };

  const contentValue = watch('content');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    >
      <h1 className="text-2xl font-bold mb-6">Add New Prompt</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 border border-base-300 p-6 space-y-4 max-w-4xl">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium mb-1.5 block">Title</label>
          <input {...register('title')} placeholder="Prompt title" className="input input-bordered w-full rounded-xl text-sm" />
          {errors.title && <p className="text-xs text-error mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <textarea {...register('description')} placeholder="Describe your prompt" className="textarea textarea-bordered w-full rounded-xl text-sm" rows={3} />
          {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium">Content</label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="btn btn-ghost btn-xs rounded-lg gap-1.5"
            >
              {preview ? <><FiEdit3 className="w-3.5 h-3.5" /> Edit</> : <><FiEye className="w-3.5 h-3.5" /> Preview</>}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[200px] p-4 bg-base-200/50 rounded-xl border border-base-300">
              {contentValue ? <MarkdownRenderer content={contentValue} /> : <p className="text-base-content/40 text-sm">Nothing to preview</p>}
            </div>
          ) : (
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write your prompt content... Supports markdown!"
                  height="300px"
                />
              )}
            />
          )}
          {errors.content && <p className="text-xs text-error mt-1">{errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <select {...register('category')} className="select select-bordered w-full rounded-xl text-sm">
              <option value="">Select</option>
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
              <option value="">Select</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Gemini">Gemini</option>
              <option value="Claude">Claude</option>
              <option value="Midjourney">Midjourney</option>
              <option value="DALL-E">DALL-E</option>
              <option value="Stable Diffusion">Stable Diffusion</option>
              <option value="Other">Other</option>
            </select>
            {errors.aiTool && <p className="text-xs text-error mt-1">{errors.aiTool.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
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
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Tags (comma separated)</label>
          <input {...register('tags')} placeholder="tag1, tag2, tag3" className="input input-bordered w-full rounded-xl text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Thumbnail</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered file-input-sm w-full rounded-xl text-sm" />
          {uploading && <span className="loading loading-spinner loading-sm ml-2" />}
          {thumbnail && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-2">
              <img src={thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />
            </motion.div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="btn btn-ghost rounded-xl">Cancel</button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-primary rounded-xl gap-2"
          >
            {mutation.isPending ? <span className="loading loading-spinner loading-sm" /> : <><FiSend className="w-4 h-4" /> Submit</>}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
