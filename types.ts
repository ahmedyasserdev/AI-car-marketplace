import { FieldErrors, UseFormRegister, UseFormWatch, UseFormHandleSubmit, UseFormSetValue, UseFormGetValues, UseFormReset } from "react-hook-form";
import { z } from "zod";
import { carFormSchema } from "./schemas/cars";


export type CarFormType = z.infer<typeof carFormSchema>;

export interface ManualCarFormProps {
    reset: UseFormReset<CarFormType>;
    handleSubmit: UseFormHandleSubmit<CarFormType>;
    watch: UseFormWatch<CarFormType>;
    register: UseFormRegister<CarFormType>;
    errors: FieldErrors<CarFormType>;
    setValue: UseFormSetValue<CarFormType>;
    getValues: UseFormGetValues<CarFormType>;
    uploadedImages : string[] ;
    setUploadedImages : React.Dispatch<React.SetStateAction<string[]>>;
  }
  