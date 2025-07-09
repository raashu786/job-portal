import React, { useEffect } from 'react'
import SelectInput from './SelectInput'
import fields from '../Data/Profile';
import { Button, Checkbox, Textarea } from '@mantine/core'
import { MonthPickerInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { changeProfile } from '../Slices/ProfileSlice';
import { SuccessNotification } from '../Services/Notification';
import { IconCancel, IconPhoto, IconPlus } from '@tabler/icons-react';

const ExpInput = (props: any) => {
    const select = fields;
    const dispatch=useDispatch();
    const profile = useSelector((state:any)=>state.profile);
      const form = useForm({
          mode: "controlled",
          validateInputOnChange: true,
          initialValues: {
              title: "",
              company: "",
              location: "",
              startDate: new Date(),
              endDate: new Date(),
              working: false,
              description: "",
          },
          validate: {
              title: isNotEmpty("Enter your job title."),
              company: isNotEmpty("Enter your company name."),
              location: isNotEmpty("Enter your job location."),
              description: isNotEmpty("Enter your job description."),
          },
      });
      useEffect(() => {
          form.setValues({
              title: props.title || "",
              company: props.company || "",
              location: props.location || "",
              startDate: props.startDate ? new Date(props.startDate) : new Date(),
              endDate: props.endDate ? new Date(props.endDate) : new Date(),
              working: props.working ?? false,
              description: props.description || "",
          });
      }, []);
  const handleSave=()=>{
    form.validate();
    if(!form.isValid())return;
    let exp=[...profile.experiances]
    if(props.add===true){
      exp.push(form.getValues());
      exp[exp.length-1].startDate=exp[exp.length-1].startDate.toISOString();
      exp[exp.length-1].endDate=exp[exp.length-1].endDate.toISOString();
    }
    else {
      exp[props.index]=form.getValues();
      exp[props.index].startDate=exp[props.index].startDate.toISOString();
      exp[props.index].endDate=exp[props.index].endDate.toISOString();
    }

    let updatedProfile={...profile, experiances:exp};
    props.setEdit(false);
    dispatch(changeProfile(updatedProfile));
    SuccessNotification("success",`Experiance ${props.add === true ? "Added" : "Updated"} successfully`)
  }

  return (
    <div className='flex flex-col gap-4'>
        <div className='text-lg font-semibold'>{props.add === true ? "Add" : "Edit"} Experiance</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SelectInput form={form} name="title" {...select[0]} />
          <SelectInput form={form} name="company" {...select[1]} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SelectInput form={form} name="location" {...select[2]} />
        </div>
        <div>
            <Textarea
                    withAsterisk
                    label="Summary"
                    placeholder='Enter Summary.. '
                    resize="vertical"
                    autosize
                    minRows={2}
                    maxRows={8}
                    {...form.getInputProps('description')}
                  />                        
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <MonthPickerInput
      {...form.getInputProps("startDate")}
      label="Start Date"
      placeholder="Enter Start Date"
      maxDate={form.values.endDate instanceof Date ? form.values.endDate : undefined}
    />
    <MonthPickerInput
      {...form.getInputProps("endDate")}
      label="End Date"
      placeholder="Enter End Date"
      maxDate={new Date()}
      minDate={form.values.startDate instanceof Date ? form.values.startDate : undefined}
      withAsterisk
      disabled={form.getValues().working}
    />
  </div>
    <Checkbox
    checked={form.getValues().working}
    autoContrast
    label="Currently Working here"
    onChange={(event)=>form.setFieldValue("working", event.currentTarget.checked)}
    />
    <div className='flex gap-2'>
        <Button onClick={handleSave} color='green.8' variant="outline" leftSection={props.add===true?<IconPlus size={14} />:<IconPhoto size={14} />}>{props.add === true ? "Add" : "Save"}</Button>
        <Button  onClick={()=>props.setEdit(false)} leftSection={props.add===true?<IconCancel size={15} />:<IconCancel size={15} />} color='orange.8' variant="outline">{props.add === true ? "Cancel" : "Close"}</Button>
      </div>
    </div>
  )
}
export default ExpInput


