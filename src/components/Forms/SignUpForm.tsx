import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { SignUpFormProps } from "../../types/forms";
import { ERROR_MSG } from "../../data/errorMessages";
import { EMAIL_REGEX, LOCAL_STORAGE_KEY } from "../../data/constants";

// icons import
import EyeIcon from "../../images/icons/eye.svg?react";
import EyeOffIcon from "../../images/icons/eye-off.svg?react";

// components import
import ErrorMessage from "../ErrorMessage";
import { ButtonPrimary } from "../Button";

function SignUpForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormProps>();

  let users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]");

  const onSubmit: SubmitHandler<SignUpFormProps> = (data) => {
    users.push(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));

    navigate("/dashboard/");
  };

  const isNewEmail = (value: string) => {
    return users.every((user: SignUpFormProps) => {
      return user.email !== value;
    });
  };

  return (
    <form
      className="flex w-full max-w-4xl flex-col items-center gap-4 lg:items-start"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-2 text-left">
          <label htmlFor="firstName" className="text-sm">
            First Name:
          </label>
          <input
            id="firstName"
            type="text"
            className="w-full rounded-md border border-accent/10 bg-transparent px-4 py-2"
            autoComplete="given-name"
            aria-invalid={errors.firstName ? "true" : "false"}
            {...register("firstName", {
              required: { value: true, message: ERROR_MSG.FIELD_IS_REQUIRED },
              maxLength: { value: 30, message: ERROR_MSG.MAX_LENGTH_EXCEEDED },
            })}
          />
          {errors.firstName && (
            <ErrorMessage error={errors.firstName.message} />
          )}
        </div>

        <div className="flex w-full flex-col gap-2 text-left">
          <label htmlFor="lastName" className="text-sm">
            Last Name:
          </label>
          <input
            id="lastName"
            type="text"
            className="w-full rounded-md border border-accent/10 bg-transparent px-4 py-2"
            autoComplete="family-name"
            aria-invalid={errors.lastName ? "true" : "false"}
            {...register("lastName", {
              required: { value: true, message: ERROR_MSG.FIELD_IS_REQUIRED },
              maxLength: { value: 30, message: ERROR_MSG.MAX_LENGTH_EXCEEDED },
            })}
          />
          {errors.lastName && <ErrorMessage error={errors.lastName.message} />}
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-2 text-left">
          <label htmlFor="email" className="text-sm">
            Email:
          </label>
          <input
            id="email"
            className="w-full rounded-md border border-accent/10 bg-transparent px-4 py-2"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email", {
              required: { value: true, message: ERROR_MSG.FIELD_IS_REQUIRED },
              pattern: { value: EMAIL_REGEX, message: ERROR_MSG.INVALID_EMAIL },
              validate: (value) => {
                return isNewEmail(value) || ERROR_MSG.EMAIL_ALREADY_EXISTS;
              },
            })}
          />
          {errors.email && <ErrorMessage error={errors.email.message} />}
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2 text-left">
            <label className="text-sm" htmlFor="password">
              Password:
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                className="w-full rounded-md border border-accent/10 bg-transparent px-4 py-2"
                autoComplete="new-password"
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password", {
                  required: {
                    value: true,
                    message: ERROR_MSG.FIELD_IS_REQUIRED,
                  },
                  minLength: {
                    value: 8,
                    message: ERROR_MSG.PASSWORD_TOO_SHORT,
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md text-sm text-accent/20 transition-colors duration-300 hover:text-accent-hover"
                aria-controls="password"
                aria-label="toggle password visibility"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {errors.password && (
              <ErrorMessage error={errors.password.message} />
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <ButtonPrimary type="submit">Sign Up</ButtonPrimary>
      </div>
    </form>
  );
}

export default SignUpForm;
