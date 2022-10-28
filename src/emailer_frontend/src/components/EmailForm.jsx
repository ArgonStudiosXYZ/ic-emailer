import React, { Loading, useState } from "react";
import { useForm } from "react-hook-form";
import { emailer_backend } from "../../../declarations/emailer_backend";
import { toast } from "react-toastify";

export const validEmailRegex =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const emailIsValid = {
  pattern: {
    value: validEmailRegex,
    message: "Please enter a valid email",
  },
};

export const EmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await emailer_backend.sendEmail(
        data.recipent,
        data.subject,
        data.body
      );
      if (response.Ok) {
        toast.success(response.Ok);
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      toast("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="email-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <img src="logo.png" alt="DFINITY logo" />
      </div>

      {errors?.recipent?.message && (
        <p className="error-text">{errors?.recipent.message}</p>
      )}

      <input
        type="text"
        placeholder="Recipent"
        {...register("recipent", { required: true, ...emailIsValid })}
        className={`${errors.recipent && "error"}`}
      />

      <input
        type="text"
        placeholder="Subject"
        {...register("subject", { required: true })}
        className={`${errors.subject && "error"}`}
      />
      <textarea
        placeholder="Body text here ..."
        rows={3}
        {...register("body", { required: true })}
        className={`${errors.body && "error"}`}
      />
      <button type="submit" disabled={loading}>
        {" "}
        {loading && (
          <i className="fa fa-refresh fa-spin" style={{ marginRight: "5px" }} />
        )}
        {loading && <span>Sending email...</span>}
        {!loading && <span>Send email</span>}
      </button>
    </form>
  );
};
