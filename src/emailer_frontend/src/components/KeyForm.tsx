import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useKeys } from "../provider/KeyProvider";
import { actorClient } from "../services/actorClient";

export const KeyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setHasKey } = useKeys();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await actorClient.registerKey(data.key);
      setHasKey(true);
      toast.success("successful registered key");
    } catch (error) {
      console.log(error);
      toast("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="email-form" onSubmit={handleSubmit(onSubmit)}>
      {errors?.key?.message && (
        <p className="error-text">{errors?.key?.message + ""}</p>
      )}

      <input
        type="text"
        placeholder="Recipent"
        {...register("key", { required: true })}
        className={`${errors.key && "error"}`}
      />

      <button type="submit" disabled={loading}>
        {loading && (
          <i className="fa fa-refresh fa-spin" style={{ marginRight: "5px" }} />
        )}
        {loading && <span>Trying to set key...</span>}
        {!loading && <span>Set key</span>}
      </button>
    </form>
  );
};
