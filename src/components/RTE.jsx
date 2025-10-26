import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';



export default function RTE({name, control, label, defaultValue = ""}) {
  return (
    <div className='w-full'> 
      {label && (
        <label className='inline-block mb-3 text-xs sm:text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        render={({field: {onChange}}) => (
          <div className='border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all duration-200'>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              
              initialValue={defaultValue}
              init={{
                height: 400, // Smaller default height for better mobile experience
                min_height: 300,
                max_height: 800,
                menubar: true,
                mobile: {
                  menubar: true,
                  toolbar_mode: 'sliding'
                },
                plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                  "emoticons"
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat code fullscreen | help",
                toolbar_mode: 'sliding', // Better for responsive
                content_style: `
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #1f2937;
                    padding: 16px;
                  }
                  @media (max-width: 640px) {
                    body {
                      font-size: 14px;
                      padding: 12px;
                    }
                  }
                `,
                // Better image handling
                automatic_uploads: true,
                file_picker_types: 'image',
                
                // Paste handling
                paste_data_images: true,
                paste_as_text: false,
                
                // Better UX
                branding: false, // Remove "Powered by TinyMCE"
                promotion: false,
                resize: true,
                
                // Accessibility
                accessibility_focus: true,
                
                // Content formatting
                block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Preformatted=pre',
                
                // Link settings
                link_default_target: '_blank',
                link_title: false,
                target_list: false,
                
                // Responsive images
                image_advtab: true,
                image_caption: true,
                image_class_list: [
                  {title: 'Responsive', value: 'img-fluid'},
                  {title: 'Full Width', value: 'w-full'},
                ],
              }}
              onEditorChange={onChange}
            />
          </div>
        )}
      />
    </div>
  )
}
