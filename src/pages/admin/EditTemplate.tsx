import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { templateService } from '../../services/template';
import { CertificateTemplate, TemplateField } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Trash2, Save, Plus } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const EditTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<CertificateTemplate>({
    defaultValues: template || {
      id: '',
      name: '',
      description: '',
      institutionId: '',
      fields: [],
      design: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        accentColor: '#2563eb',
        logoUrl: '',
      },
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields"
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) {
        setError('Template ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        console.log(`Fetching template with ID: ${id}`);
        const fetchedTemplate = await templateService.getTemplateById(id);
        console.log('Fetched template:', fetchedTemplate);
        setTemplate(fetchedTemplate);
        reset(fetchedTemplate);
      } catch (err: any) {
        console.error('Error fetching template:', err);
        setError(err.message || 'Failed to fetch template');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [id, reset]);

  const onSubmit = async (data: CertificateTemplate) => {
    if (!id) {
       alert('Template ID is missing. Cannot update.');
       return;
    }
     setIsLoading(true);
    try {
      console.log('Submitting updated template:', data);
      const updateData = {
        name: data.name,
        description: data.description,
        institutionId: data.institutionId,
        fields: data.fields.map(field => ({
           ...field,
            id: field.id,
          })),
        design: data.design,
      };
      await templateService.updateTemplate(id, updateData);
      console.log('Template updated successfully!');
      alert('Template updated successfully!');
      navigate('/admin/templates');
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template.');
    } finally {
       setIsLoading(false);
    }
  };

   if (isLoading && !template) {
     return <div className="container mx-auto px-4 py-8 text-center">Loading template...</div>;
   }

   if (error) {
     return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
   }

   if (!template && !isLoading) {
      return <div className="container mx-auto px-4 py-8 text-center">Template not found.</div>;
   }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Template: {template?.name}</h1>
      
       {template && (
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
           <Input
             label="Template Name"
             placeholder="Enter template name (e.g., Certificate of Completion)"
             {...register('name', { required: 'Template name is required' })}
             error={errors.name?.message}
           />

           <div>
             <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
             <textarea
               id="description"
               rows={3}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
               placeholder="Provide a brief description of this template"
               {...register('description', { required: 'Description is required' })}
             />
             {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
           </div>

           <div className="space-y-4 bg-gray-50 p-4 rounded-md">
             <h3 className="text-lg font-medium text-gray-900">Design Properties</h3>
             <Input
               label="Background Color"
               type="color"
               {...register('design.backgroundColor', { required: 'Background color is required' })}
               error={errors.design?.backgroundColor?.message}
             />
              <Input
               label="Text Color"
               type="color"
               {...register('design.textColor', { required: 'Text color is required' })}
               error={errors.design?.textColor?.message}
             />
              <Input
               label="Accent Color"
               type="color"
               {...register('design.accentColor', { required: 'Accent color is required' })}
               error={errors.design?.accentColor?.message}
             />
              <Input
               label="Logo URL (Optional)"
               placeholder="Enter URL for template logo"
               {...register('design.logoUrl')}
               error={errors.design?.logoUrl?.message}
             />
           </div>

           <div className="space-y-4">
             <h3 className="text-lg font-medium text-gray-900">Custom Fields</h3>
             {fields.map((item, index) => (
               <Card key={item.id} className="p-4 border">
                 <CardContent className="space-y-4">
                   <Input
                     label="Field Label"
                     placeholder="e.g., Student Name"
                     {...register(`fields.${index}.label` as const, { required: 'Field label is required' })}
                     error={errors.fields?.[index]?.label?.message}
                   />
                    <Input
                     label="Field Name (Programmatic)"
                     placeholder="e.g., studentName (no spaces or special characters)"
                      {...register(`fields.${index}.name` as const, {
                       required: 'Field name is required',
                       pattern: {
                         value: /^[a-zA-Z0-9]+$/,
                         message: 'Only alphanumeric characters are allowed',
                       },
                     })}
                     error={errors.fields?.[index]?.name?.message}
                   />
                    <div>
                     <label htmlFor={`fields.${index}.type`} className="block text-sm font-medium text-gray-700">Field Type</label>
                     <select
                        id={`fields.${index}.type`}
                       {...register(`fields.${index}.type` as const, { required: 'Field type is required' })}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                     >
                       <option value="text">Text</option>
                       <option value="date">Date</option>
                     </select>
                      {errors.fields?.[index]?.type?.message && <p className="mt-1 text-sm text-red-600">{errors.fields?.[index]?.type?.message}</p>}
                   </div>
                    <div>
                     <label className="flex items-center">
                       <input
                         type="checkbox"
                         {...register(`fields.${index}.required` as const)}
                         className="form-checkbox"
                       />
                       <span className="ml-2 text-sm text-gray-900">Required</span>
                     </label>
                   </div>

                 </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="danger"
                     size="sm"
                     leftIcon={<Trash2 className="h-4 w-4" />}
                     onClick={() => remove(index)}
                     type="button"
                   >
                     Remove Field
                   </Button>
                  </CardFooter>
               </Card>
             ))}
              <Button type="button" variant="outline" onClick={() => append({ id: '', name: '', label: '', type: 'text', required: false, options: [] })} leftIcon={<Plus className="h-4 w-4" />}>
               Add Custom Field
             </Button>
           </div>

           <div className="flex justify-end">
             <Button type="submit" variant="primary" isLoading={isLoading} leftIcon={<Save className="h-5 w-5" />}>
               Save Changes
             </Button>
           </div>
         </form>
       )}
    </div>
  );
};

export default EditTemplate; 