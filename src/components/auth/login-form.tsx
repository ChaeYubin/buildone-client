"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import Button from "@/components/@common/button";
import { LOGIN_ERROR_CODE } from "@/constants/error";
import { useDebounce } from "@/hooks/use-debounce";
import { ApiError } from "@/lib/error";
import { TEST_ACCOUNT } from "@/mocks/v1/auth/mock-data";
import { login } from "@/services/auth";
import { useUserStore } from "@/store/user-store";

import LabeledInput from "../@common/input/labeled-input";
import LoadingSpinner from "../@common/loading-spinner";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("이메일을 입력해주세요.")
    .email("이메일 형식을 입력해주세요."),
  password: z.string().nonempty("비밀번호를 입력해주세요."),
});

type LoginSchema = z.infer<typeof loginSchema>;
type LoginSchemaKey = keyof LoginSchema;

export default function LoginForm() {
  const router = useRouter();
  const { setUserInfo } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setError,
    trigger,
    watch,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const debouncedEmail = useDebounce(email, 1000);

  useEffect(() => {
    if (debouncedEmail) {
      trigger("email");
    }
  }, [debouncedEmail, trigger]);

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    try {
      const response = await login(data.email, data.password);

      setUserInfo(response.data.memberInformation);

      router.push("/dashboard");
    } catch (error: unknown) {
      setIsLoading(false);

      if (error instanceof ApiError) {
        if (
          error.code === LOGIN_ERROR_CODE.INVALID_EMAIL_FORMAT ||
          error.code === LOGIN_ERROR_CODE.NOT_FOUND_MEMBER_WITH_EMAIL
        ) {
          setError("email", { type: "valid", message: error.message });
        }

        if (error.code === LOGIN_ERROR_CODE.INVALID_PASSWORD_FORMAT) {
          setError("password", { type: "valid", message: error.message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {[
        {
          key: "email",
          label: "이메일",
          placeholder: "이메일을 입력해주세요.",
        },
        {
          key: "password",
          label: "비밀번호",
          placeholder: "비밀번호를 입력해주세요.",
        },
      ].map(({ key, label, placeholder }, index) => (
        <div className={index > 0 ? "mt-24" : ""} key={key}>
          <LabeledInput
            id={key}
            label={label}
            type={key.includes("password") ? "password" : "text"}
            placeholder={placeholder}
            {...register(key as LoginSchemaKey)}
            className={
              errors[key as LoginSchemaKey] &&
              "border-red-500 focus-within:border-red-500 hover:border-red-500"
            }
          />
          {errors[key as LoginSchemaKey] && (
            <p className="mt-8 inline-block text-sm font-normal text-red-500">
              {errors[key as LoginSchemaKey]?.message}
            </p>
          )}
        </div>
      ))}
      <Button
        type="submit"
        className="mt-48 w-full"
        disabled={!isDirty || !isValid || isLoading}
      >
        {isLoading ? <LoadingSpinner size={20} /> : "로그인하기"}
      </Button>
      <Button
        type="button"
        className="mt-16 w-full"
        onClick={() => onSubmit(TEST_ACCOUNT)}
      >
        {isLoading ? (
          <LoadingSpinner size={20} />
        ) : (
          "테스트 계정으로 로그인하기"
        )}
      </Button>
    </form>
  );
}
