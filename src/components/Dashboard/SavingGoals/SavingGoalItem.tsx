import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import supabase from "../../../utils/supabase";

import { ERROR_MSG } from "../../../data/errorMessages";

// icons import
import XIcon from "../../../images/icons/x.svg?react";

// components import
import MoreMenu from "../../MoreMenu";
import Modal from "../../Modal";
import { SavingGoalFormProps } from "./SavingGoals";
import Icon from "../../Icon";
import { ButtonPrimary, ButtonSecondary } from "../../Button";

interface SavingGoalItemProps {
  id: number;
  name: string;
  targetAmount: number;
  savedAmount: number;
  onDelete: () => void;
  onEditSuccess: (data: SavingGoalFormProps) => void;
}

interface EditGoalFormProps {
  name: string;
  target_amount: number;
  saved_amount: number;
}

export default function SavingGoalItem({
  id,
  name,
  targetAmount,
  savedAmount,
  onDelete,
  onEditSuccess,
  ...props
}: SavingGoalItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const savedAmountPercentage = Math.round((savedAmount / targetAmount) * 100);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setFocus,
    formState: { errors, isSubmitSuccessful },
  } = useForm<EditGoalFormProps>();

  const handleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const editSavingGoal = async () => {
    const { data, error } = await supabase
      .from("saving_goals")
      .update({
        name: getValues("name"),
        saved_amount: savedAmount + getValues("saved_amount"),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
    }

    if (data) {
      onEditSuccess(data[0]);
    }

    setIsEditModalOpen(false);
  };

  const handleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDelete = () => {
    onDelete();

    setIsDeleteModalOpen(false);
  };

  const onSubmit: SubmitHandler<EditGoalFormProps> = async () => {
    await editSavingGoal();
  };

  useEffect(() => {
    if (isEditModalOpen) {
      setFocus("name");
    }
  }, [isEditModalOpen]);

  // https://react-hook-form.com/docs/useform/reset
  useEffect(() => {
    const updateList = async () => {
      if (isSubmitSuccessful) {
        reset();
      }
    };

    updateList();
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (savedAmount >= targetAmount) {
      setIsComplete(true);
    }
  }, [savedAmount, targetAmount]);

  return (
    <li
      {...props}
      className="relative flex flex-row items-center justify-between gap-2"
    >
      <p className="pl-4 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-md before:bg-brand before:content-['']">
        {name}
      </p>
      <div className="flex flex-row items-center gap-4">
        <p className={`${isComplete && "text-green-500"} font-semibold`}>
          {savedAmountPercentage}%
        </p>

        {isComplete ? (
          <button type="button" onClick={handleDeleteModal}>
            <Icon SvgIcon={XIcon} width={16} height={16} isBorderless />
          </button>
        ) : (
          <MoreMenu
            onEdit={handleEditModal}
            isDeletable
            onDelete={handleDeleteModal}
          />
        )}
      </div>

      <Modal
        id={`goal-edit-modal-${id}`}
        title="Edit this goal?"
        isOpen={isEditModalOpen}
        handleClose={() => setIsEditModalOpen(false)}
      >
        <form
          id="editSavingGoalForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="goalName" className="text-sm">
              Name
            </label>
            <input
              id="goalName"
              type="text"
              placeholder="Insert goal name"
              className="w-full rounded-md border border-accent/10 bg-transparent p-2"
              defaultValue={name}
              autoComplete="off"
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name", {
                required: {
                  value: true,
                  message: ERROR_MSG.FIELD_IS_REQUIRED,
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="goalAmount" className="text-sm">
              Target Amount
            </label>
            <input
              id="goalAmount"
              type="number"
              min={0}
              placeholder="Insert amount"
              className="w-full rounded-md border border-accent/10 bg-transparent p-2"
              defaultValue={targetAmount}
              autoComplete="off"
              aria-invalid={errors.target_amount ? "true" : "false"}
              {...register("target_amount", {
                required: {
                  value: true,
                  message: ERROR_MSG.FIELD_IS_REQUIRED,
                },
                validate: (value) => {
                  if (value <= 0) {
                    return "Target amount cannot be zero";
                  }
                },
                valueAsNumber: true,
              })}
            />
            {errors.target_amount && (
              <p className="text-sm text-red-500">
                {errors.target_amount.message}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="goalSavedAmount" className="text-sm">
              Saved Amount (optional)
            </label>
            <input
              id="goalSavedAmount"
              type="number"
              min={0}
              placeholder="Insert saved amount"
              className="w-full rounded-md border border-accent/10 bg-transparent p-2"
              defaultValue={savedAmount}
              autoComplete="off"
              aria-invalid={errors.saved_amount ? "true" : "false"}
              {...register("saved_amount", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="flex flex-row items-center justify-end gap-2">
            <ButtonSecondary
              type="button"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </ButtonSecondary>

            <ButtonPrimary type="submit">Save</ButtonPrimary>
          </div>
        </form>
      </Modal>

      <Modal
        id={`goal-delete-modal-${id}`}
        title="Delete this goal?"
        isOpen={isDeleteModalOpen}
        handleClose={() => setIsDeleteModalOpen(false)}
      >
        <p>Are you sure you want to delete this goal?</p>

        <div className="flex flex-row items-center justify-end gap-2">
          <ButtonSecondary
            type="button"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </ButtonSecondary>

          <button
            type="button"
            className="w-fit rounded-md bg-red-700 px-6 py-3 text-white hover:bg-red-500"
            onClick={() => handleDelete()}
          >
            Delete
          </button>
        </div>
      </Modal>
    </li>
  );
}