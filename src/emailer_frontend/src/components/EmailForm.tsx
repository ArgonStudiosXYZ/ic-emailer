import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useKeys } from "../provider/KeyProvider";
import { actorClient } from "../services/actorClient";

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
  const { removeKey } = useKeys();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await actorClient.sendEmail(
        data.recipent,
        data.subject,
        data.body
      );
      if ("Ok" in response) {
        toast.success(response.Ok);
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error(error);
      toast("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeKey();
    } finally {
      setLoading(false);
    }
  };
  console.log({ loading });
  return (
    <form className="email-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>
        You have a courier api key registered{" "}
        <a className="remove" onClick={() => handleRemove()}>
          Remove
        </a>
      </h2>

      <div>
        <img src="logo.png" alt="DFINITY logo" />
      </div>

      {errors?.recipent?.message && (
        <p className="error-text">{errors?.recipent?.message + ""}</p>
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
        {loading && <span>Processing...</span>}
        {!loading && <span>Send email</span>}
      </button>
    </form>
  );
};
