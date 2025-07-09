import React, { useEffect, useState } from 'react'
import SelectInput from './SelectInput'
import fields from '../Data/Profile'
import { Button, TextInput } from '@mantine/core'
import { MonthPickerInput } from '@mantine/dates'
import { isNotEmpty, useForm } from '@mantine/form'
import { IconCancel, IconPlus } from '@tabler/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { changeProfile } from '../Slices/ProfileSlice'
import { SuccessNotification } from '../Services/Notification'
const CertiInput = ( props:any) => {
    const select = fields;
    const profile = useSelector((state:any)=>state.profile);
     const [issueDate, setIssueDate] = useState<Date | null>(new Date());
     const dispatch=useDispatch();
     const form = useForm({
      mode: "controlled",
      validateInputOnChange: true,
      initialValues: {
        name: props.name || "",
        issuer: props.issuer || "",
        issueDate: props.issueDate ? new Date(props.issueDate) : null,  // Ensure user's date is set
        certificateId: "",
      },
      validate: {
        name: isNotEmpty("Enter your Company name."),
        issuer: isNotEmpty("Enter your issuer company."),
        certificateId: isNotEmpty("Enter your Certificate Number."),
        issueDate: isNotEmpty("Issue Date is not empty."),
      },
    });
           useEffect(() => {
            form.setValues({
              name: props.name || "",
              issuer: props.issuer || "",
              certificateId: props.certificateId || "",
              issueDate: props.issueDate ? new Date(props.issueDate) : null, // Use user's date, not current date
            });
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [props.issueDate]);
           const handleSave=()=>{
            form.validate();
            if(!form.isValid())return;
            let certi = [...profile.certification];
            certi.push(form.getValues());
            certi[certi.length-1].issueDate=certi[certi.length-1].issueDate.toISOString();
            let updatedProfile={...profile, certification:certi};
            props.setEdit(false);
            dispatch(changeProfile(updatedProfile));
            SuccessNotification("success",`Certificate added successfully`)

           }
  return (
    <div className='flex flex-col gap-3'>
         <div className='text-lg font-semibold'>Add Certificate</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TextInput {...form.getInputProps("name")} label="Title" withAsterisk placeholder="Enter Title"/>
        <SelectInput form={form} name="issuer" {...select[1]} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthPickerInput
  {...form.getInputProps("issueDate")}
  value={issueDate}
  onChange={(date) => {
    setIssueDate(date); // Update state
    form.setFieldValue("issueDate", date); // Save user-selected date
  }}
  label="Issue Date"
  placeholder="Enter Issue Date"
  maxDate={new Date()}
/>
          <TextInput {...form.getInputProps("certificateId")} label="Certificate ID" withAsterisk placeholder="Enter  Certificate ID"/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
         <div className='flex gap-2'>
            <Button onClick={handleSave} color='green.8' variant="outline" leftSection={<IconPlus size={14}/>}>Save</Button>
            <Button  onClick={()=>props.setEdit(false)} color='orange.8' variant="outline" leftSection={<IconCancel size={14}/>}>Cancel</Button>
          </div>
        </div>
    </div>
  )
}
export default CertiInput
