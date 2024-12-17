import React from "react";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { FieldPath, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { signUpAuthFormSchema } from "@/lib/utils";

interface CustomInputProp {
	form: UseFormReturn<z.infer<typeof signUpAuthFormSchema>>;
	type?: string;
	name: FieldPath<z.infer<typeof signUpAuthFormSchema>>;
	placeholder: string;
	label: string;
}

const CustomInput = ({ form, type = "text", name, placeholder, label }: CustomInputProp) => {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<div className="form-item">
					<FormLabel className="form-label">{label}</FormLabel>
					<div className="flex flex-col w-full">
						<FormControl>
							<Input type={type} placeholder={placeholder} className="Input-class" {...field}></Input>
						</FormControl>
						<FormMessage className="form-message mt-2" />
					</div>
				</div>
			)}
		/>
	);
};

export default CustomInput;
