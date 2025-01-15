import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
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
	autoComplete?: string;
}

const CustomInput = ({ form, type = "text", name, placeholder, label, autoComplete = "on" }: CustomInputProp) => {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="form-item">
					<FormLabel className="form-label">{label}</FormLabel>
					<div className="flex flex-col w-full">
						<FormControl>
							<Input
								id={name}
								type={type}
								placeholder={placeholder}
								className="Input-class"
								autoComplete={autoComplete}
								{...field}
							></Input>
						</FormControl>
						<FormMessage className="form-message mt-2" />
					</div>
				</FormItem>
			)}
		/>
	);
};

export default CustomInput;
